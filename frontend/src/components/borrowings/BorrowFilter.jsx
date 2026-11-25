import { BORROWING_FILTER_OPTIONS } from '../../utils/format';

function BorrowFilter({ status, onChange }) {
  return (
    <div
      className="btn-group flex-wrap mb-3"
      role="group"
      aria-label="Lọc theo trạng thái"
    >
      {BORROWING_FILTER_OPTIONS.map((option) => {
        const isActive = status === option.value;
        return (
          <button
            key={option.value}
            type="button"
            className={`btn btn-outline-secondary ${isActive ? 'active' : ''}`}
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default BorrowFilter;
