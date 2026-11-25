function Pagination({ page, totalPages, totalItems, itemLabel = 'mục', onPageChange }) {
  if (!totalPages || totalPages <= 0) {
    return null;
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3">
      <span className="text-muted small">
        Trang {page}/{totalPages} · {totalItems} {itemLabel}
      </span>

      <nav aria-label="Phân trang danh sách">
        <ul className="pagination pagination-sm mb-0">
          <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
            <button
              type="button"
              className="page-link"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              Trước
            </button>
          </li>

          {pageNumbers.map((num) => (
            <li
              key={num}
              className={`page-item ${num === page ? 'active' : ''}`}
              aria-current={num === page ? 'page' : undefined}
            >
              <button
                type="button"
                className="page-link"
                onClick={() => onPageChange(num)}
              >
                {num}
              </button>
            </li>
          ))}

          <li className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
            <button
              type="button"
              className="page-link"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              Sau
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Pagination;
