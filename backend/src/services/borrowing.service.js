const equipmentRepo = require('../repositories/equipment.repository');
const borrowingRepo = require('../repositories/borrowing.repository');
const fineRepo = require('../repositories/fine.repository');
const AppError = require('../utils/AppError');
const { DAILY_FINE_RATE, MAX_BORROW_DAYS } = require('../utils/constants');
const { getTodayVN, diffDays } = require('../utils/date');
const { runInTransaction } = require('../utils/transaction');

function formatBorrowingCode(id) {
  return `PM-${String(id).padStart(3, '0')}`;
}

function resolveBorrowingStatus(row, todayVN) {
  if (row.returned_at !== null) {
    return 'returned';
  }
  if (row.due_date < todayVN) {
    return 'overdue';
  }
  return 'borrowed';
}

function resolveBorrowingFineInfo(row, todayVN) {
  const quantity = Number(row.quantity);

  if (row.returned_at !== null) {
    if (row.fine_id !== null && row.fine_id !== undefined) {
      return {
        fineId: Number(row.fine_id),
        lateDays: Number(row.fine_late_days),
        fineAmount: Number(row.fine_amount),
        fineStatus: row.fine_status,
        finePaidAt: row.fine_paid_at || null,
      };
    }

    return {
      fineId: null,
      lateDays: 0,
      fineAmount: 0,
      fineStatus: 'none',
      finePaidAt: null,
    };
  }

  const overdueDays = diffDays(todayVN, row.due_date);
  if (overdueDays > 0) {
    return {
      fineId: null,
      lateDays: overdueDays,
      fineAmount: overdueDays * quantity * DAILY_FINE_RATE,
      fineStatus: 'provisional',
      finePaidAt: null,
    };
  }

  return {
    fineId: null,
    lateDays: 0,
    fineAmount: 0,
    fineStatus: 'none',
    finePaidAt: null,
  };
}

function toBorrowingDto(row, todayVN) {
  const fineInfo = resolveBorrowingFineInfo(row, todayVN);

  return {
    id: Number(row.id),
    code: formatBorrowingCode(row.id),
    equipmentId: Number(row.equipment_id),
    equipmentCode: row.equipment_code,
    equipmentName: row.equipment_name,
    borrowerName: row.borrower_name,
    quantity: Number(row.quantity),
    borrowedAt: row.borrowed_at,
    dueDate: row.due_date,
    returnedAt: row.returned_at,
    note: row.note || null,
    status: resolveBorrowingStatus(row, todayVN),
    ...fineInfo,
  };
}

async function listBorrowings({ status }) {
  const todayVN = getTodayVN();
  const rows = await borrowingRepo.findAll({ status, todayVN });

  return {
    items: rows.map((row) => toBorrowingDto(row, todayVN)),
  };
}

async function createBorrowing(payload) {
  const todayVN = getTodayVN();
  const borrowDays = diffDays(payload.dueDate, todayVN);

  if (borrowDays < 0) {
    throw new AppError(
      400,
      'INVALID_DUE_DATE',
      'Hạn trả không được nhỏ hơn ngày mượn hôm nay.'
    );
  }

  if (borrowDays > MAX_BORROW_DAYS) {
    throw new AppError(
      400,
      'DUE_DATE_EXCEEDS_LIMIT',
      'Thời hạn mượn tối đa là 14 ngày kể từ ngày mượn.'
    );
  }

  const created = await runInTransaction(async (conn) => {
    const equipment = await equipmentRepo.findByIdForUpdate(payload.equipmentId, conn);
    if (!equipment) {
      throw new AppError(404, 'EQUIPMENT_NOT_FOUND', 'Không tìm thấy thiết bị.');
    }

    const borrowedQuantity = await equipmentRepo.getBorrowedQuantityById(
      payload.equipmentId,
      conn
    );
    const availableQuantity = Number(equipment.total_quantity) - borrowedQuantity;

    if (payload.quantity > availableQuantity) {
      throw new AppError(
        409,
        'INSUFFICIENT_QUANTITY',
        `Số lượng mượn vượt quá số lượng còn lại (hiện còn ${availableQuantity}).`
      );
    }

    const insertedId = await borrowingRepo.create(
      {
        equipmentId: payload.equipmentId,
        borrowerName: payload.borrowerName,
        quantity: payload.quantity,
        borrowedAt: todayVN,
        dueDate: payload.dueDate,
        note: payload.note,
      },
      conn
    );

    return borrowingRepo.findDetailedById(insertedId, conn);
  });

  return {
    borrowing: toBorrowingDto(created, todayVN),
  };
}

async function returnBorrowing(id) {
  const returnedAt = getTodayVN();

  const updated = await runInTransaction(async (conn) => {
    const existing = await borrowingRepo.findByIdForUpdate(id, conn);
    if (!existing) {
      throw new AppError(404, 'BORROWING_NOT_FOUND', 'Không tìm thấy phiếu mượn.');
    }

    if (existing.returned_at !== null) {
      throw new AppError(
        409,
        'BORROWING_ALREADY_RETURNED',
        'Phiếu mượn này đã được trả trước đó.'
      );
    }

    if (diffDays(returnedAt, existing.borrowed_at) < 0) {
      throw new AppError(
        400,
        'INVALID_RETURN_DATE',
        'Ngày trả không được nhỏ hơn ngày mượn.'
      );
    }

    const affectedRows = await borrowingRepo.markReturned(id, returnedAt, conn);
    if (affectedRows !== 1) {
      throw new AppError(
        409,
        'BORROWING_ALREADY_RETURNED',
        'Phiếu mượn này đã được trả trước đó.'
      );
    }

    const lateDays = diffDays(returnedAt, existing.due_date);
    if (lateDays > 0) {
      const fineAmount = lateDays * Number(existing.quantity) * DAILY_FINE_RATE;
      try {
        await fineRepo.create(
          {
            borrowingId: id,
            lateDays,
            dailyRate: DAILY_FINE_RATE,
            amount: fineAmount,
          },
          conn
        );
      } catch (err) {
        if (err && err.code === 'ER_DUP_ENTRY') {
          throw new AppError(
            409,
            'BORROWING_ALREADY_RETURNED',
            'Phiếu mượn này đã được ghi nhận trả và chốt tiền phạt trước đó.'
          );
        }
        throw err;
      }
    }

    return borrowingRepo.findDetailedById(id, conn);
  });

  return {
    borrowing: toBorrowingDto(updated, returnedAt),
  };
}

module.exports = {
  MAX_BORROW_DAYS,
  formatBorrowingCode,
  resolveBorrowingStatus,
  listBorrowings,
  createBorrowing,
  returnBorrowing,
};
