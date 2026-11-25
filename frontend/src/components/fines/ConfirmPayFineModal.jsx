import { useEffect, useState } from 'react';
import { payFine } from '../../services/fineService';
import { getErrorMessage } from '../../utils/error';
import { formatCurrencyVND } from '../../utils/format';

function ConfirmPayFineModal({ fine, onClose, onPaid }) {
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [shouldSyncOnClose, setShouldSyncOnClose] = useState(false);

  useEffect(() => {
    setError('');
    setSubmitting(false);
    setShouldSyncOnClose(false);
  }, [fine]);

  if (!fine) {
    return null;
  }

  const handleClose = () => {
    if (submitting) {
      return;
    }
    onClose(shouldSyncOnClose);
  };

  const handleConfirmPay = async () => {
    if (submitting || fine.fineId === null || fine.fineId === undefined) {
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const data = await payFine(fine.fineId);
      onPaid(data.fine);
    } catch (err) {
      if (err?.code === 'FINE_ALREADY_PAID') {
        setShouldSyncOnClose(true);
        setError(
          'Khoản phạt này đã được thu ở một thao tác khác. Vui lòng đóng hộp thoại để đồng bộ trạng thái mới nhất.'
        );
      } else {
        if (err?.code === 'FINE_NOT_FOUND') {
          setShouldSyncOnClose(true);
        }
        setError(
          getErrorMessage(err, 'Không thể xác nhận thu tiền phạt. Vui lòng thử lại.')
        );
      }
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
      aria-labelledby="confirmPayFineTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 id="confirmPayFineTitle" className="modal-title">
              Xác nhận thu tiền phạt
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Đóng"
              disabled={submitting}
              onClick={handleClose}
            />
          </div>

          <div className="modal-body">
            {error && (
              <div className="alert alert-danger py-2 mb-3" role="alert">
                {error}
              </div>
            )}

            <p className="mb-2">
              Xác nhận thu đủ khoản phạt đã chốt cho phiếu{' '}
              <strong>{fine.borrowingCode}</strong>:
            </p>

            <ul className="list-group mb-3">
              <li className="list-group-item d-flex justify-content-between gap-3">
                <span className="text-muted text-nowrap">Thiết bị</span>
                <span className="text-end fw-medium">
                  {fine.equipmentName}
                  {fine.equipmentCode ? ` (${fine.equipmentCode})` : ''}
                </span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span className="text-muted">Người mượn</span>
                <span>{fine.borrowerName}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span className="text-muted">Số lượng</span>
                <strong>{fine.quantity}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span className="text-muted">Số ngày trễ</span>
                <span>{fine.lateDays} ngày</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <span className="text-muted">Trạng thái</span>
                <span className="badge text-bg-warning">Đã chốt – Chưa thu</span>
              </li>
              <li className="list-group-item d-flex justify-content-between fw-bold">
                <span>Số tiền phạt đã chốt</span>
                <span className="text-danger">
                  {formatCurrencyVND(fine.fineAmount)}
                </span>
              </li>
            </ul>

            <div className="small text-muted">
              Khoản phạt này đã được chốt cố định sau khi trả thiết bị. Sau khi
              xác nhận, hệ thống ghi nhận đã thanh toán toàn bộ trong hôm nay.
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              disabled={submitting}
              onClick={handleClose}
            >
              {shouldSyncOnClose ? 'Đóng & đồng bộ' : 'Hủy'}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={submitting || shouldSyncOnClose}
              onClick={handleConfirmPay}
            >
              {submitting ? 'Đang xử lý...' : 'Xác nhận thu tiền'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmPayFineModal;
