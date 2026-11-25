function EmptyState({ message = 'Không có dữ liệu.' }) {
  return (
    <div className="card">
      <div className="card-body text-center text-muted py-4">{message}</div>
    </div>
  );
}

export default EmptyState;
