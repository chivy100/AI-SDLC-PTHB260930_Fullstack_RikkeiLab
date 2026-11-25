import { useState } from 'react';
import BorrowFilter from '../components/borrowings/BorrowFilter';
import BorrowForm from '../components/borrowings/BorrowForm';
import BorrowTable from '../components/borrowings/BorrowTable';
import ConfirmReturnModal from '../components/borrowings/ConfirmReturnModal';
import EmptyState from '../components/common/EmptyState';
import LoadingState from '../components/common/LoadingState';
import ReturnWithFineModal from '../components/common/ReturnWithFineModal';
import StatusAlert from '../components/common/StatusAlert';
import { useBorrowings } from '../hooks/useBorrowings';
import { diffDaysIso, formatCurrencyVND, getTodayVN } from '../utils/format';

function isBorrowingOverdue(borrowing) {
  if (!borrowing || borrowing.returnedAt !== null) {
    return false;
  }
  if (borrowing.status === 'overdue') {
    return true;
  }
  const lateDays = diffDaysIso(getTodayVN(), borrowing.dueDate);
  return lateDays !== null && lateDays > 0;
}

function BorrowingPage() {
  const {
    items,
    loading,
    error,
    statusFilter,
    equipments,
    equipmentsLoading,
    equipmentsError,
    handleStatusChange,
    refetchBorrowings,
    refetchEquipments,
    refetchAll,
  } = useBorrowings();

  const [successMessage, setSuccessMessage] = useState('');
  const [returnTarget, setReturnTarget] = useState(null);

  const handleCreated = (createdBorrowing) => {
    setSuccessMessage(`Đã tạo phiếu mượn ${createdBorrowing.code}.`);
    refetchAll();
  };

  const handleReturned = (returnedBorrowing) => {
    setReturnTarget(null);
    if (returnedBorrowing?.fineId) {
      setSuccessMessage(
        `Đã xác nhận trả phiếu ${returnedBorrowing.code}. Backend đã chốt khoản phạt ${formatCurrencyVND(
          returnedBorrowing.fineAmount
        )} (${returnedBorrowing.lateDays} ngày trễ, trạng thái: Chưa thu).`
      );
    } else {
      setSuccessMessage(
        `Đã xác nhận trả thiết bị cho phiếu ${returnedBorrowing?.code || ''}.`.trim()
      );
    }
    refetchAll();
  };

  const showReturnWithFineModal = isBorrowingOverdue(returnTarget);

  return (
    <section aria-label="Phiếu mượn thiết bị">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4 mb-0">Phiếu mượn thiết bị</h1>
      </div>

      <StatusAlert
        variant="success"
        message={successMessage}
        onClose={() => setSuccessMessage('')}
      />

      <BorrowForm
        equipments={equipments}
        equipmentsLoading={equipmentsLoading}
        equipmentsError={equipmentsError}
        onRetryEquipments={refetchEquipments}
        onCreated={handleCreated}
      />

      <BorrowFilter status={statusFilter} onChange={handleStatusChange} />

      {loading && <LoadingState message="Đang tải danh sách phiếu mượn..." />}

      {!loading && error && (
        <div
          className="alert alert-danger d-flex flex-wrap justify-content-between align-items-center gap-2 mb-0"
          role="alert"
        >
          <span>{error}</span>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger"
            onClick={refetchBorrowings}
          >
            Thử lại
          </button>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <EmptyState
          message={
            statusFilter === 'all'
              ? 'Chưa có phiếu mượn nào.'
              : 'Không có phiếu mượn nào thuộc trạng thái đang chọn.'
          }
        />
      )}

      {!loading && !error && items.length > 0 && (
        <BorrowTable items={items} onRequestReturn={setReturnTarget} />
      )}

      {returnTarget && !showReturnWithFineModal && (
        <ConfirmReturnModal
          borrowing={returnTarget}
          onClose={() => setReturnTarget(null)}
          onReturned={handleReturned}
        />
      )}

      {returnTarget && showReturnWithFineModal && (
        <ReturnWithFineModal
          borrowing={returnTarget}
          onClose={() => setReturnTarget(null)}
          onReturned={handleReturned}
        />
      )}
    </section>
  );
}

export default BorrowingPage;
