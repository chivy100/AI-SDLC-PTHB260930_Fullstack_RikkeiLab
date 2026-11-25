import { useEffect, useState } from 'react';
import { createEquipment, updateEquipment } from '../../services/equipmentService';
import { getErrorMessage } from '../../utils/error';
import { CATEGORY_OPTIONS } from '../../utils/format';

function EquipmentFormModal({ isOpen, mode, initialEquipment, onClose, onSuccess }) {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('laptop');
  const [totalQuantity, setTotalQuantity] = useState('1');

  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (mode === 'edit' && initialEquipment) {
      setCode(initialEquipment.code || '');
      setName(initialEquipment.name || '');
      setCategory(initialEquipment.category || 'laptop');
      setTotalQuantity(String(initialEquipment.totalQuantity ?? 0));
    } else {
      setCode('');
      setName('');
      setCategory('laptop');
      setTotalQuantity('1');
    }

    setFieldErrors({});
    setSubmitError('');
    setSubmitting(false);
  }, [isOpen, mode, initialEquipment]);

  if (!isOpen) {
    return null;
  }

  const validateClient = () => {
    const errors = {};
    const trimmedCode = code.trim();
    const trimmedName = name.trim();
    const rawQty = String(totalQuantity).trim();
    const parsedQty = Number(rawQty);

    if (!trimmedCode) {
      errors.code = 'Vui lòng nhập mã thiết bị.';
    } else if (trimmedCode.length > 20) {
      errors.code = 'Mã thiết bị tối đa 20 ký tự.';
    }

    if (!trimmedName) {
      errors.name = 'Vui lòng nhập tên thiết bị.';
    } else if (trimmedName.length > 150) {
      errors.name = 'Tên thiết bị tối đa 150 ký tự.';
    }

    if (!CATEGORY_OPTIONS.some((opt) => opt.value === category)) {
      errors.category = 'Vui lòng chọn loại thiết bị hợp lệ.';
    }

    if (rawQty === '' || !Number.isInteger(parsedQty) || parsedQty < 0) {
      errors.totalQuantity = 'Tổng số lượng phải là số nguyên không âm.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      payload: {
        code: trimmedCode,
        name: trimmedName,
        category,
        totalQuantity: parsedQty,
      },
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) {
      return;
    }

    const { isValid, errors, payload } = validateClient();
    if (!isValid) {
      setFieldErrors(errors);
      setSubmitError('Dữ liệu không hợp lệ.');
      return;
    }

    setFieldErrors({});
    setSubmitError('');
    setSubmitting(true);

    try {
      if (mode === 'edit' && initialEquipment) {
        const data = await updateEquipment(initialEquipment.id, payload);
        onSuccess(
          `Đã cập nhật thiết bị ${data.equipment?.code || payload.code}.`
        );
      } else {
        const data = await createEquipment(payload);
        onSuccess(
          `Đã thêm thiết bị ${data.equipment?.code || payload.code}.`
        );
      }
    } catch (err) {
      const message = getErrorMessage(
        err,
        'Không thể lưu thiết bị. Vui lòng thử lại.'
      );
      setSubmitError(message);

      if (err?.code === 'DUPLICATE_EQUIPMENT_CODE') {
        setFieldErrors({ code: message });
      } else if (err?.code === 'TOTAL_QUANTITY_LESS_THAN_BORROWED') {
        setFieldErrors({ totalQuantity: message });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const isEdit = mode === 'edit';

  return (
    <div
      className="modal d-block modal-backdrop-custom"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      aria-labelledby="equipmentFormTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) {
          onClose();
        }
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <form className="modal-content" onSubmit={handleSubmit} noValidate>
          <div className="modal-header">
            <h5 id="equipmentFormTitle" className="modal-title">
              {isEdit ? 'Cập nhật thiết bị' : 'Thêm thiết bị'}
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
            {submitError && (
              <div className="alert alert-danger py-2" role="alert">
                {submitError}
              </div>
            )}

            <div className="mb-3">
              <label className="form-label" htmlFor="eqCode">
                Mã thiết bị
              </label>
              <input
                id="eqCode"
                type="text"
                className={`form-control ${fieldErrors.code ? 'is-invalid' : ''}`}
                placeholder="LAB-015"
                maxLength={20}
                value={code}
                disabled={submitting}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (fieldErrors.code) {
                    setFieldErrors((prev) => ({ ...prev, code: '' }));
                  }
                }}
              />
              {fieldErrors.code && (
                <div className="invalid-feedback d-block">{fieldErrors.code}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="eqName">
                Tên thiết bị
              </label>
              <input
                id="eqName"
                type="text"
                className={`form-control ${fieldErrors.name ? 'is-invalid' : ''}`}
                maxLength={150}
                value={name}
                disabled={submitting}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) {
                    setFieldErrors((prev) => ({ ...prev, name: '' }));
                  }
                }}
              />
              {fieldErrors.name && (
                <div className="invalid-feedback d-block">{fieldErrors.name}</div>
              )}
            </div>

            <div className="row">
              <div className="col-md-7 mb-3">
                <label className="form-label" htmlFor="eqCat">
                  Loại
                </label>
                <select
                  id="eqCat"
                  className={`form-select ${fieldErrors.category ? 'is-invalid' : ''}`}
                  value={category}
                  disabled={submitting}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {fieldErrors.category && (
                  <div className="invalid-feedback d-block">
                    {fieldErrors.category}
                  </div>
                )}
              </div>

              <div className="col-md-5 mb-3">
                <label className="form-label" htmlFor="eqTotal">
                  Tổng số lượng
                </label>
                <input
                  id="eqTotal"
                  type="number"
                  min="0"
                  step="1"
                  className={`form-control ${fieldErrors.totalQuantity ? 'is-invalid' : ''}`}
                  value={totalQuantity}
                  disabled={submitting}
                  onChange={(e) => {
                    setTotalQuantity(e.target.value);
                    if (fieldErrors.totalQuantity) {
                      setFieldErrors((prev) => ({ ...prev, totalQuantity: '' }));
                    }
                  }}
                />
                {fieldErrors.totalQuantity && (
                  <div className="invalid-feedback d-block">
                    {fieldErrors.totalQuantity}
                  </div>
                )}
              </div>
            </div>

            {isEdit && initialEquipment && (
              <div className="form-text text-muted">
                Hiện đang được mượn: <strong>{initialEquipment.borrowedQuantity}</strong> · Còn lại:{' '}
                <strong>{initialEquipment.availableQuantity}</strong>
              </div>
            )}
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
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EquipmentFormModal;
