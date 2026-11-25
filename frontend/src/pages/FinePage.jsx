import { useState } from 'react';
import EmptyState from '../components/common/EmptyState';
import LoadingState from '../components/common/LoadingState';
import ReturnWithFineModal from '../components/common/ReturnWithFineModal';
import StatusAlert from '../components/common/StatusAlert';
import ConfirmPayFineModal from '../components/fines/ConfirmPayFineModal';
import FineSummary from '../components/fines/FineSummary';
import FineTable from '../components/fines/FineTable';
import { useFines } from '../hooks/useFines';
import { formatCurrencyVND, formatDateVN } from '../utils/format';

function FinePage() {
  const { summary, items, loading, error, refetch } = useFines();

  const [successMessage, setSuccessMessage] = useState('');
  const [returnTarget, setReturnTarget] = useState(null);
  const [payTarget, setPayTarget] = useState(null);

  const handleReturned = (returnedBorrowing) => {
    setReturnTarget(null);
    if (returnedBorrowing?.fineId) {
      setSuccessMessage(
        `Đã xác nhận trả phiếu ${returnedBorrowing.code}. Backend đã chốt khoản phạt ${formatCurrencyVND(
          returnedBorrowing.fineAmount
        )} (${returnedBorrowing.lateDays} ngày trễ, trạng thái: Đã chốt – Chưa thu).`
      );
    } else {
      setSuccessMessage(
        `Đã xác nhận trả phiếu ${returnedBorrowing?.code || ''}.`.trim()
      );
    }
    refetch();
  };

  const handlePaid = (paidFine) => {
    setPayTarget(null);
    setSuccessMessage(
      `Đã thu đủ khoản phạt ${formatCurrencyVND(paidFine.fineAmount)} cho phiếu ${
        paidFine.borrowingCode
      }${paidFine.paidAt ? ` (ngày ${formatDateVN(paidFine.paidAt)})` : ''}.`
    );
    refetch();
  };

  const handleClosePayModal = (shouldSync) => {
    setPayTarget(null);
    if (shouldSync) {
      refetch();
    }
  };

  return (
    <section aria-label="Quá hạn và tiền phạt">
      <div className="mb-3">
        <h1 className="h4 mb-1">Quá hạn và tiền phạt</h1>
        <p className="text-muted small mb-0">
          Theo dõi khoản phạt tạm tính chưa trả, khoản phạt đã chốt chưa thu và
          lịch sử đã thu.
        </p>
      </div>

      <StatusAlert
        variant="success"
        message={successMessage}
        onClose={() => setSuccessMessage('')}
      />

      {loading && <LoadingState message="Đang tải dữ liệu tiền phạt..." />}

      {!loading && error && (
        <div
          className="alert alert-danger d-flex flex-wrap justify-content-between align-items-center gap-2 mb-0"
          role="alert"
        >
          <span>{error}</span>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={refetch}
          >
            Thử lại
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <FineSummary summary={summary} />

          {items.length === 0 ? (
            <EmptyState message="Hiện chưa có phiếu quá hạn hoặc khoản phạt nào." />
          ) : (
            <FineTable
              items={items}
              onRequestReturn={setReturnTarget}
              onRequestPay={setPayTarget}
            />
          )}
        </>
      )}

      <ReturnWithFineModal
        borrowing={returnTarget}
        onClose={() => setReturnTarget(null)}
        onReturned={handleReturned}
      />

      <ConfirmPayFineModal
        fine={payTarget}
        onClose={handleClosePayModal}
        onPaid={handlePaid}
      />
    </section>
  );
}

export default FinePage;
