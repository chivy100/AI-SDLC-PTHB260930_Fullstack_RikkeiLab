import { useEffect, useState } from 'react';
import { deleteEquipment } from '../../services/equipmentService';
import { getErrorMessage } from '../../utils/error';

function ConfirmDeleteModal({ equipment, onClose, onDeleted }) {
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setError('');
    setSubmitting(false);
  }, [equipment]);

  if (!equipment) {
    return null;
  }

  const handleConfirmDelete = async () => {
    if (submitting) {
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      await deleteEquipment(equipment.id);
      onDeleted(equipment);
    } catch (err) {
      setError(
        getErrorMessage(err, 'Không thể xóa thiết bị. Vui lòng thử lại.')
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
      aria-labelledby="deleteEquipmentTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) {
          onClose();
        }
      }}
    >
      <div className="modal-dialog modal-sm modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 id="deleteEquipmentTitle" className="modal-title">
              Xóa thiết bị
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
              <div className="alert alert-danger py-2" role="alert">
                {error}
              </div>
            )}
            <p className="mb-0">
              Bạn có chắc muốn xóa{' '}
              <strong>
                {equipment.name} ({equipment.code})
              </strong>
              ?
            </p>
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
              className="btn btn-danger"
              disabled={submitting}
              onClick={handleConfirmDelete}
            >
              {submitting ? 'Đang xóa...' : 'Xóa'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
