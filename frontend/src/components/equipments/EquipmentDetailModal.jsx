import { useEffect, useState } from 'react';
import { getEquipmentById } from '../../services/equipmentService';
import { getErrorMessage } from '../../utils/error';
import { formatCategoryLabel, formatDateVN } from '../../utils/format';
import LoadingState from '../common/LoadingState';
import StatusAlert from '../common/StatusAlert';

function EquipmentDetailModal({ equipmentId, onClose }) {
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!equipmentId) {
      return undefined;
    }

    const controller = new AbortController();
    let isCurrent = true;

    async function fetchDetail() {
      setLoading(true);
      setError(null);
      setEquipment(null);

      try {
        const data = await getEquipmentById(equipmentId, controller.signal);
        if (!isCurrent) {
          return;
        }
        setEquipment(data.equipment || null);
      } catch (err) {
        if (!isCurrent || err?.isCanceled) {
          return;
        }
        setError(getErrorMessage(err, 'Không tải được chi tiết thiết bị.'));
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    }

    fetchDetail();

    return () => {
      isCurrent = false;
      controller.abort();
    };
  }, [equipmentId]);

  if (!equipmentId) {
    return null;
  }

  const isAvailable = (equipment?.availableQuantity || 0) > 0;

  return (
    <div
      className="modal d-block modal-backdrop-custom"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      aria-labelledby="equipmentDetailTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 id="equipmentDetailTitle" className="modal-title">
              Chi tiết thiết bị
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Đóng"
              onClick={onClose}
            />
          </div>

          <div className="modal-body">
            {loading && <LoadingState message="Đang tải chi tiết thiết bị..." />}
            {error && <StatusAlert variant="danger" message={error} />}
            {!loading && !error && equipment && (
              <ul className="list-group">
                <li className="list-group-item d-flex justify-content-between">
                  <span className="text-muted">Mã thiết bị</span>
                  <strong className="text-nowrap">{equipment.code}</strong>
                </li>
                <li className="list-group-item d-flex justify-content-between gap-3">
                  <span className="text-muted text-nowrap">Tên thiết bị</span>
                  <span className="text-end fw-medium">{equipment.name}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span className="text-muted">Loại</span>
                  <span>{formatCategoryLabel(equipment.category)}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span className="text-muted">Tổng số lượng</span>
                  <strong>{equipment.totalQuantity}</strong>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span className="text-muted">Đang được mượn</span>
                  <strong>{equipment.borrowedQuantity}</strong>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span className="text-muted">Số lượng còn lại</span>
                  <span
                    className={`badge ${isAvailable ? 'text-bg-success' : 'text-bg-danger'}`}
                  >
                    {equipment.availableQuantity} ({isAvailable ? 'Còn hàng' : 'Hết hàng'})
                  </span>
                </li>
                {equipment.createdAt && (
                  <li className="list-group-item d-flex justify-content-between">
                    <span className="text-muted">Ngày tạo</span>
                    <span>{formatDateVN(equipment.createdAt)}</span>
                  </li>
                )}
              </ul>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EquipmentDetailModal;
