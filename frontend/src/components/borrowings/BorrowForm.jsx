import { useState } from 'react';
import { createBorrowing } from '../../services/borrowingService';
import { getErrorMessage } from '../../utils/error';
import {
  MAX_BORROW_DAYS,
  addDaysIso,
  diffDaysIso,
  formatDateVN,
  getTodayVN,
  isValidIsoDate,
} from '../../utils/format';

function BorrowForm({
  equipments,
  equipmentsLoading,
  equipmentsError,
  onRetryEquipments,
  onCreated,
}) {
  const todayVN = getTodayVN();
  const maxDueDate = addDaysIso(todayVN, MAX_BORROW_DAYS);

  const [equipmentId, setEquipmentId] = useState('');
  const [borrowerName, setBorrowerName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [dueDate, setDueDate] = useState(() => addDaysIso(todayVN, 7));
  const [note, setNote] = useState('');

  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const selectedEquipment = equipments.find(
    (item) => String(item.id) === String(equipmentId)
  );

  const validateClient = () => {
    const errors = {};
    const parsedEquipmentId = Number(equipmentId);
    const trimmedName = borrowerName.trim();
    const rawQty = String(quantity).trim();
    const parsedQty = Number(rawQty);
    const trimmedDueDate = dueDate.trim();
    const trimmedNote = note.trim();
    const currentTodayVN = getTodayVN();

    if (
      !equipmentId ||
      !Number.isInteger(parsedEquipmentId) ||
      parsedEquipmentId <= 0 ||
      !selectedEquipment
    ) {
      errors.equipmentId = 'Vui lòng chọn thiết bị hợp lệ.';
    } else if (selectedEquipment.availableQuantity <= 0) {
      errors.equipmentId = 'Thiết bị đã hết hàng, không thể mượn.';
    }

    if (!trimmedName) {
      errors.borrowerName = 'Vui lòng nhập tên người mượn.';
    } else if (trimmedName.length > 120) {
      errors.borrowerName = 'Tên người mượn tối đa 120 ký tự.';
    }

    if (rawQty === '' || !Number.isInteger(parsedQty) || parsedQty <= 0) {
      errors.quantity = 'Số lượng mượn phải là số nguyên lớn hơn 0.';
    } else if (
      selectedEquipment &&
      selectedEquipment.availableQuantity > 0 &&
      parsedQty > selectedEquipment.availableQuantity
    ) {
      errors.quantity = `Số lượng mượn không được vượt quá tồn kho (${selectedEquipment.availableQuantity}).`;
    }

    if (!trimmedDueDate) {
      errors.dueDate = 'Vui lòng chọn hạn trả.';
    } else if (!isValidIsoDate(trimmedDueDate)) {
      errors.dueDate = 'Hạn trả phải đúng định dạng YYYY-MM-DD và là ngày hợp lệ.';
    } else {
      const borrowDays = diffDaysIso(trimmedDueDate, currentTodayVN);
      if (borrowDays === null || borrowDays < 0) {
        errors.dueDate = 'Hạn trả không được trước ngày hôm nay.';
      } else if (borrowDays > MAX_BORROW_DAYS) {
        errors.dueDate = `Thời hạn mượn tối đa ${MAX_BORROW_DAYS} ngày kể từ hôm nay.`;
      }
    }

    if (trimmedNote.length > 255) {
      errors.note = 'Ghi chú tối đa 255 ký tự.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      payload: {
        equipmentId: parsedEquipmentId,
        borrowerName: trimmedName,
        quantity: parsedQty,
        dueDate: trimmedDueDate,
        note: trimmedNote === '' ? null : trimmedNote,
      },
    };
  };

  const handleEquipmentChange = (nextId) => {
    setEquipmentId(nextId);
    if (fieldErrors.equipmentId || fieldErrors.quantity) {
      setFieldErrors((prev) => ({
        ...prev,
        equipmentId: '',
        quantity: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) {
      return;
    }

    const { isValid, errors, payload } = validateClient();
    if (!isValid) {
      setFieldErrors(errors);
      setSubmitError('Không thể tạo phiếu mượn. Vui lòng kiểm tra lại thông tin.');
      return;
    }

    setFieldErrors({});
    setSubmitError('');
    setSubmitting(true);

    try {
      const data = await createBorrowing(payload);
      const refreshedToday = getTodayVN();
      setEquipmentId('');
      setBorrowerName('');
      setQuantity('1');
      setDueDate(addDaysIso(refreshedToday, 7));
      setNote('');
      setFieldErrors({});
      setSubmitError('');
      onCreated(data.borrowing);
    } catch (err) {
      const message = getErrorMessage(
        err,
        'Không thể tạo phiếu mượn. Vui lòng thử lại.'
      );
      setSubmitError(message);

      if (err?.code === 'INSUFFICIENT_QUANTITY') {
        setFieldErrors({ quantity: message });
      } else if (
        err?.code === 'INVALID_DUE_DATE' ||
        err?.code === 'DUE_DATE_EXCEEDS_LIMIT'
      ) {
        setFieldErrors({ dueDate: message });
      } else if (err?.code === 'EQUIPMENT_NOT_FOUND') {
        setFieldErrors({ equipmentId: message });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header">Tạo phiếu mượn</div>
      <div className="card-body">
        {equipmentsError && (
          <div className="alert alert-warning d-flex flex-wrap justify-content-between align-items-center gap-2 py-2 mb-3">
            <span className="small">{equipmentsError}</span>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={onRetryEquipments}
            >
              Tải lại thiết bị
            </button>
          </div>
        )}

        {submitError && (
          <div className="alert alert-danger py-2 mb-3" role="alert">
            {submitError}
          </div>
        )}

        <form className="row g-3" onSubmit={handleSubmit} noValidate>
          <div className="col-md-4">
            <label className="form-label" htmlFor="bEq">
              Thiết bị
            </label>
            <select
              id="bEq"
              className={`form-select ${fieldErrors.equipmentId ? 'is-invalid' : ''}`}
              value={equipmentId}
              disabled={submitting || equipmentsLoading}
              onChange={(e) => handleEquipmentChange(e.target.value)}
            >
              <option value="">
                {equipmentsLoading ? 'Đang tải thiết bị...' : 'Chọn thiết bị...'}
              </option>
              {equipments.map((item) => {
                const isOutOfStock = item.availableQuantity <= 0;
                return (
                  <option
                    key={item.id}
                    value={item.id}
                    disabled={isOutOfStock}
                  >
                    {item.code} - {item.name} (
                    {isOutOfStock ? 'Hết hàng' : `còn ${item.availableQuantity}`})
                  </option>
                );
              })}
            </select>
            {fieldErrors.equipmentId && (
              <div className="invalid-feedback d-block">
                {fieldErrors.equipmentId}
              </div>
            )}
            {!fieldErrors.equipmentId && selectedEquipment && (
              <div className="form-text">
                Số lượng còn lại: <strong>{selectedEquipment.availableQuantity}</strong>
              </div>
            )}
          </div>

          <div className="col-md-3">
            <label className="form-label" htmlFor="bName">
              Người mượn
            </label>
            <input
              id="bName"
              type="text"
              className={`form-control ${fieldErrors.borrowerName ? 'is-invalid' : ''}`}
              placeholder="Họ và tên"
              maxLength={120}
              value={borrowerName}
              disabled={submitting}
              onChange={(e) => {
                setBorrowerName(e.target.value);
                if (fieldErrors.borrowerName) {
                  setFieldErrors((prev) => ({ ...prev, borrowerName: '' }));
                }
              }}
            />
            {fieldErrors.borrowerName && (
              <div className="invalid-feedback d-block">
                {fieldErrors.borrowerName}
              </div>
            )}
          </div>

          <div className="col-md-2">
            <label className="form-label" htmlFor="bQty">
              Số lượng
            </label>
            <input
              id="bQty"
              type="number"
              min="1"
              max={
                selectedEquipment && selectedEquipment.availableQuantity > 0
                  ? selectedEquipment.availableQuantity
                  : undefined
              }
              step="1"
              className={`form-control ${fieldErrors.quantity ? 'is-invalid' : ''}`}
              value={quantity}
              disabled={submitting}
              onChange={(e) => {
                setQuantity(e.target.value);
                if (fieldErrors.quantity) {
                  setFieldErrors((prev) => ({ ...prev, quantity: '' }));
                }
              }}
            />
            {fieldErrors.quantity && (
              <div className="invalid-feedback d-block">
                {fieldErrors.quantity}
              </div>
            )}
          </div>

          <div className="col-md-3">
            <label className="form-label" htmlFor="bDue">
              Hạn trả
            </label>
            <input
              id="bDue"
              type="date"
              min={todayVN}
              max={maxDueDate}
              className={`form-control ${fieldErrors.dueDate ? 'is-invalid' : ''}`}
              value={dueDate}
              disabled={submitting}
              onChange={(e) => {
                setDueDate(e.target.value);
                if (fieldErrors.dueDate) {
                  setFieldErrors((prev) => ({ ...prev, dueDate: '' }));
                }
              }}
            />
            {fieldErrors.dueDate ? (
              <div className="invalid-feedback d-block">
                {fieldErrors.dueDate}
              </div>
            ) : (
              <div className="form-text">
                Tối đa {MAX_BORROW_DAYS} ngày (đến {formatDateVN(maxDueDate)})
              </div>
            )}
          </div>

          <div className="col-md-9">
            <label className="form-label" htmlFor="bNote">
              Ghi chú
            </label>
            <input
              id="bNote"
              type="text"
              className={`form-control ${fieldErrors.note ? 'is-invalid' : ''}`}
              placeholder="Không bắt buộc"
              maxLength={255}
              value={note}
              disabled={submitting}
              onChange={(e) => {
                setNote(e.target.value);
                if (fieldErrors.note) {
                  setFieldErrors((prev) => ({ ...prev, note: '' }));
                }
              }}
            />
            {fieldErrors.note && (
              <div className="invalid-feedback d-block">{fieldErrors.note}</div>
            )}
          </div>

          <div className="col-md-3 d-flex align-items-end">
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={submitting || equipmentsLoading}
            >
              {submitting ? 'Đang tạo...' : 'Tạo phiếu mượn'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BorrowForm;
