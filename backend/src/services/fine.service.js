const fineRepo = require('../repositories/fine.repository');
const AppError = require('../utils/AppError');
const { DAILY_FINE_RATE } = require('../utils/constants');
const { getTodayVN } = require('../utils/date');
const { runInTransaction } = require('../utils/transaction');
const { formatBorrowingCode } = require('./borrowing.service');

const STATUS_SORT_ORDER = {
  unpaid: 0,
  provisional: 1,
  paid: 2,
};

function toFineDto(row) {
  return {
    borrowingId: Number(row.borrowing_id),
    borrowingCode: formatBorrowingCode(row.borrowing_id),
    fineId: row.fine_id !== null ? Number(row.fine_id) : null,
    equipmentId: Number(row.equipment_id),
    equipmentCode: row.equipment_code,
    equipmentName: row.equipment_name,
    borrowerName: row.borrower_name,
    quantity: Number(row.quantity),
    borrowedAt: row.borrowed_at,
    dueDate: row.due_date,
    returnedAt: row.returned_at,
    lateDays: Number(row.late_days),
    dailyRate: Number(row.daily_rate),
    fineAmount: Number(row.amount),
    fineStatus: row.fine_status,
    paidAt: row.paid_at,
  };
}

async function listFines() {
  const todayVN = getTodayVN();

  const [totals, settledRows, provisionalRows] = await Promise.all([
    fineRepo.getSummaryTotals(todayVN, DAILY_FINE_RATE),
    fineRepo.findAllSettled(),
    fineRepo.findAllProvisionalOverdue(todayVN, DAILY_FINE_RATE),
  ]);

  const items = [...settledRows, ...provisionalRows]
    .map(toFineDto)
    .sort((a, b) => {
      const orderDiff = STATUS_SORT_ORDER[a.fineStatus] - STATUS_SORT_ORDER[b.fineStatus];
      if (orderDiff !== 0) {
        return orderDiff;
      }
      return b.borrowingId - a.borrowingId;
    });

  return {
    summary: {
      dailyRate: DAILY_FINE_RATE,
      collectedAmount: totals.collectedAmount,
      unpaidSettledAmount: totals.unpaidSettledAmount,
      provisionalAmount: totals.provisionalAmount,
      totalOwedAmount: totals.unpaidSettledAmount + totals.provisionalAmount,
    },
    items,
  };
}

async function payFine(id) {
  const paidAt = getTodayVN();

  const updated = await runInTransaction(async (conn) => {
    const existing = await fineRepo.findByIdForUpdate(id, conn);
    if (!existing) {
      throw new AppError(404, 'FINE_NOT_FOUND', 'Không tìm thấy khoản phạt.');
    }

    if (existing.status === 'paid') {
      throw new AppError(
        409,
        'FINE_ALREADY_PAID',
        'Khoản phạt này đã được thanh toán trước đó.'
      );
    }

    const affectedRows = await fineRepo.markAsPaid(id, paidAt, conn);
    if (affectedRows !== 1) {
      throw new AppError(
        409,
        'FINE_ALREADY_PAID',
        'Khoản phạt này đã được thanh toán trước đó.'
      );
    }

    return fineRepo.findDetailedById(id, conn);
  });

  return {
    fine: toFineDto(updated),
  };
}

module.exports = {
  listFines,
  payFine,
};
