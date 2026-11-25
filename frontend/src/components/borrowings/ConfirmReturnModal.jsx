import { useEffect, useState } from 'react';
import { returnBorrowing } from '../../services/borrowingService';
import { getErrorMessage } from '../../utils/error';
import { formatDateVN, getTodayVN } from '../../utils/format';

function ConfirmReturnModal({ borrowing, onClose, onReturned }) {
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setError('');
    setSubmitting(false);
  }, [borrowing]);

  if (!borrowing) {
    return null;
  }

  const todayVN = getTodayVN();

  const handleConfirm = async () => {
    if (submitting) {
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const data = await returnBorrowing(borrowing.id);
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
      aria-labelledby="confirmReturnTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) {
          onClose();
        }
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 id="confirmReturnTitle" className="modal-title">
              Xác nhận trả thiết bị
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
              Xác nhận trả đúng hạn cho phiếu <strong>{borrowing.code}</strong>:
            </p>

            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-between gap-3">
                <span className="text-muted text-nowrap">Thiết bị</span>
                <span className="text-end fw-medium">
                  {borrowing.equipmentName} ({borrowing.equipmentCode})
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between gap-3">
                <span className="text-muted text-nowrap">Người mượn</span>
                <span>{borrowing.borrowerName}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span className="text-muted">Số lượng</span>
                <strong>{borrowing.quantity}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span className="text-muted">Hạn trả</span>
                <span>{formatDateVN(borrowing.dueDate)}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span className="text-muted">Ngày trả dự kiến hôm nay</span>
                <strong className="text-success">{formatDateVN(todayVN)}</strong>
              </li>
            </ul>
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
              onClick={handleConfirm}
            >
              {submitting ? 'Đang xử lý...' : 'Xác nhận trả'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmReturnModal;
