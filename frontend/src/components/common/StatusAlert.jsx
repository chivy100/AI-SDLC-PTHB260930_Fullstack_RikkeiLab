function StatusAlert({ variant = 'danger', message, onClose }) {
  if (!message) {
    return null;
  }

  return (
    <div
      className={`alert alert-${variant} d-flex justify-content-between align-items-center py-2 mb-3`}
      role={variant === 'danger' ? 'alert' : 'status'}
    >
      <span>{message}</span>
      {onClose && (
        <button
          type="button"
          className="btn-close ms-2"
          aria-label="Đóng thông báo"
          onClick={onClose}
        />
      )}
    </div>
  );
}

export default StatusAlert;
