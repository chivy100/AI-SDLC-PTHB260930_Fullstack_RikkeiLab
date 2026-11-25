import { useEffect, useState } from 'react';
import { returnBorrowing } from '../../services/borrowingService';
import { getErrorMessage } from '../../utils/error';
import {
  DAILY_FINE_RATE,
  diffDaysIso,
  formatCurrencyVND,
  formatDateVN,
  getTodayVN,
} from '../../utils/format';

function ReturnWithFineModal({ borrowing, onClose, onReturned }) {
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setError('');
    setSubmitting(false);
  }, [borrowing]);

  if (!borrowing) {
    return null;
  }

  const borrowingId = borrowing.borrowingId ?? borrowing.id;
  const borrowingCode = borrowing.borrowingCode ?? borrowing.code;
  const todayVN = getTodayVN();
  const computedLateDays = Math.max(
    1,
    diffDaysIso(todayVN, borrowing.dueDate) ?? Number(borrowing.lateDays || 1)
  );
  const quantity = Number(borrowing.quantity || 0);
  const estimatedAmount = computedLateDays * quantity * DAILY_FINE_RATE;

  const handleConfirmReturn = async () => {
    if (submitting) {
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const data = await returnBorrowing(borrowingId);
      onReturned(data.borrowing);
    } catch (err) {
      setError(
        getErrorMessage(err, 'Không thể xác nhận trả thiết bị. Vui lòng thử lại.')
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal d-block modal-backdrop-custom"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      aria-labelledby="returnWithFineTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) {
          onClose();
        }
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 id="returnWithFineTitle" className="modal-title">
              Trả thiết bị quá hạn
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Đóng"
              disabled={submitting}
              onClick={onClose}
            />
          </div>

          <div className="modal-body">
            {error && (
              <div className="alert alert-danger py-2 mb-3" role="alert">
                {error}
              </div>
            )}

            <p className="mb-2">
              Phiếu <strong>{borrowingCode}</strong> · {borrowing.equipmentName} ·{' '}
              {borrowing.borrowerName}
            </p>

            <ul className="list-group mb-3">
              <li className="list-group-item d-flex justify-content-between gap-3">
                <span className="text-muted text-nowrap">Tên thiết bị</span>
                <span className="text-end fw-medium">
                  {borrowing.equipmentName}
                  {borrowing.equipmentCode ? ` (${borrowing.equipmentCode})` : ''}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span className="text-muted">Người mượn</span>
                <span>{borrowing.borrowerName}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span className="text-muted">Số lượng</span>
                <strong>{quantity}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span className="text-muted">Hạn trả</span>
                <span>{formatDateVN(borrowing.dueDate)}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span className="text-muted">Ngày trả dự kiến</span>
                <span>{formatDateVN(todayVN)}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span className="text-muted">Số ngày trễ</span>
                <strong className="text-danger">{computedLateDays} ngày</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span className="text-muted">Mức phạt</span>
                <span>{formatCurrencyVND(DAILY_FINE_RATE)} / thiết bị / ngày</span>
              </li>
              <li className="list-group-item d-flex justify-content-between fw-bold">
                <span>Tiền phạt tạm tính</span>
                <span className="text-danger">
                  {formatCurrencyVND(estimatedAmount)}
                </span>
              </li>
            </ul>

            <div className="alert alert-warning py-2 mb-0 small" role="note">
              Số tiền trên là tạm tính. Backend sẽ tính và chốt khoản phạt khi xác
              nhận trả thiết bị.
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              disabled={submitting}
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              type="button"
              className="btn btn-success"
              disabled={submitting}
              onClick={handleConfirmReturn}
            >
              {submitting ? 'Đang xử lý...' : 'Xác nhận trả'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReturnWithFineModal;
