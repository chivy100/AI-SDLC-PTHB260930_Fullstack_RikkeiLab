import {
  BORROWING_STATUS_META,
  formatCurrencyVND,
  formatDateVN,
} from '../../utils/format';

function FineStatusNote({ item }) {
  if (item.fineStatus === 'provisional') {
    return (
      <div className="small text-danger mt-1">
        Tạm tính phạt: {item.lateDays} ngày · {formatCurrencyVND(item.fineAmount)}
      </div>
    );
  }

  if (item.fineStatus === 'unpaid' && item.fineId !== null) {
    return (
      <div className="small text-warning-emphasis fw-medium mt-1">
        Đã chốt phạt: {formatCurrencyVND(item.fineAmount)} (Chưa thu)
      </div>
    );
  }

  if (item.fineStatus === 'paid' && item.fineId !== null) {
    return (
      <div className="small text-success mt-1">
        Đã thu phạt: {formatCurrencyVND(item.fineAmount)}
        {item.finePaidAt ? ` (${formatDateVN(item.finePaidAt)})` : ''}
      </div>
    );
  }

  return null;
}

function BorrowTable({ items, onRequestReturn }) {
  return (
    <div className="card">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Mã phiếu</th>
              <th>Thiết bị</th>
              <th>Người mượn</th>
              <th className="text-end">SL</th>
              <th>Ngày mượn</th>
              <th>Hạn trả</th>
              <th>Ngày trả</th>
              <th>Trạng thái</th>
              <th className="text-end">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const statusMeta = BORROWING_STATUS_META[item.status] || {
                label: item.status,
                badgeClass: 'text-bg-secondary',
              };
              const canReturn = item.status !== 'returned' && item.returnedAt === null;

              return (
                <tr key={item.id}>
                  <td className="text-nowrap fw-medium">{item.code}</td>
                  <td>
                    <div className="fw-medium">{item.equipmentName}</div>
                    <div className="small text-muted">
                      {item.equipmentCode}
                      {item.note ? ` · ${item.note}` : ''}
                    </div>
                  </td>
                  <td>{item.borrowerName}</td>
                  <td className="text-end">{item.quantity}</td>
                  <td className="text-nowrap">{formatDateVN(item.borrowedAt)}</td>
                  <td className="text-nowrap">{formatDateVN(item.dueDate)}</td>
                  <td className="text-nowrap">
                    {item.returnedAt ? formatDateVN(item.returnedAt) : '—'}
                  </td>
                  <td className="text-nowrap">
                    <span className={`badge ${statusMeta.badgeClass}`}>
                      {statusMeta.label}
                    </span>
                    <FineStatusNote item={item} />
                  </td>
                  <td className="text-end text-nowrap">
                    {canReturn ? (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success"
                        onClick={() => onRequestReturn(item)}
                      >
                        Trả
                      </button>
                    ) : null}
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

export default BorrowTable;
