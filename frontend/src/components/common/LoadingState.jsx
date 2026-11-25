function LoadingState({ message = 'Đang tải dữ liệu...' }) {
  return (
    <div className="text-center py-4">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">{message}</span>
      </div>
      <div className="mt-2 text-muted small">{message}</div>
    </div>
  );
}

export default LoadingState;
