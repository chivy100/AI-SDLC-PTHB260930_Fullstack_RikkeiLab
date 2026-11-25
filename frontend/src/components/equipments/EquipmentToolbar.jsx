import { CATEGORY_OPTIONS } from '../../utils/format';

function EquipmentToolbar({
  search,
  category,
  onSearchChange,
  onCategoryChange,
  onAddClick,
}) {
  return (
    <div className="row g-2 mb-3">
      <div className="col-md-5">
        <input
          type="search"
          className="form-control"
          placeholder="Tìm theo tên hoặc mã"
          aria-label="Tìm thiết bị"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="col-md-4">
        <select
          className="form-select"
          aria-label="Lọc theo loại"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="all">Tất cả loại</option>
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-3 text-md-end">
        <button
          type="button"
          className="btn btn-primary w-100 w-md-auto"
          onClick={onAddClick}
        >
          Thêm thiết bị
        </button>
      </div>
    </div>
  );
}

export default EquipmentToolbar;
