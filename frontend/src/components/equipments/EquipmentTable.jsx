import { formatCategoryLabel } from '../../utils/format';

function EquipmentTable({ items, onViewDetail, onEdit, onDelete }) {
  return (
    <div className="card">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Mã</th>
              <th>Tên thiết bị</th>
              <th>Loại</th>
              <th className="text-end">Tổng</th>
              <th className="text-end">Đang mượn</th>
              <th className="text-end">Còn lại</th>
              <th>Trạng thái</th>
              <th className="text-end">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isAvailable = item.availableQuantity > 0;
              return (
                <tr key={item.id}>
                  <td className="text-nowrap fw-medium">{item.code}</td>
                  <td>{item.name}</td>
                  <td>{formatCategoryLabel(item.category)}</td>
                  <td className="text-end">{item.totalQuantity}</td>
                  <td className="text-end">{item.borrowedQuantity}</td>
                  <td className="text-end">
                    <span
                      className={`badge ${isAvailable ? 'text-bg-success' : 'text-bg-danger'}`}
                    >
                      {item.availableQuantity}
                    </span>
                  </td>
                  <td className="text-nowrap">
                    <span
                      className={`badge ${isAvailable ? 'text-bg-success' : 'text-bg-danger'}`}
                    >
                      {isAvailable ? 'Còn hàng' : 'Hết hàng'}
                    </span>
                  </td>
                  <td className="text-end text-nowrap">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary me-1"
                      onClick={() => onViewDetail(item)}
                    >
                      Chi tiết
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary me-1"
                      onClick={() => onEdit(item)}
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete(item)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EquipmentTable;
