import { formatCurrencyVND, formatDateVN } from '../../utils/format';

function renderFineStatusBadge(fineStatus) {
  if (fineStatus === 'provisional') {
    return <span className="badge text-bg-danger">Tạm tính – Chưa trả</span>;
  }
  if (fineStatus === 'unpaid') {
    return <span className="badge text-bg-warning">Đã chốt – Chưa thu</span>;
  }
  if (fineStatus === 'paid') {
    return <span className="badge text-bg-success">Đã thu</span>;
  }
  return <span className="badge text-bg-secondary">{fineStatus}</span>;
}

function FineTable({ items, onRequestReturn, onRequestPay }) {
  return (
    <div className="card">
      <div className="card-header">Danh sách phiếu liên quan đến tiền phạt</div>
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
              <th className="text-end">Trễ</th>
              <th className="text-end">Tiền phạt</th>
              <th>Trạng thái</th>
              <th className="text-end">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isProvisional =
                item.fineStatus === 'provisional' &&
                item.fineId === null &&
                item.returnedAt === null;
              const isUnpaid =
                item.fineStatus === 'unpaid' &&
                item.fineId !== null &&
                item.returnedAt !== null;
              const isPaid =
                item.fineStatus === 'paid' && item.paidAt !== null;

              return (
                <tr key={item.borrowingId}>
                  <td className="text-nowrap fw-medium">{item.borrowingCode}</td>
                  <td>
                    <div className="fw-medium">{item.equipmentName}</div>
                    <div className="small text-muted">{item.equipmentCode}</div>
                  </td>
                  <td>{item.borrowerName}</td>
                  <td className="text-end">{item.quantity}</td>
                  <td className="text-nowrap">{formatDateVN(item.borrowedAt)}</td>
                  <td className="text-nowrap">{formatDateVN(item.dueDate)}</td>
                  <td className="text-nowrap">
                    {item.returnedAt ? formatDateVN(item.returnedAt) : '—'}
                  </td>
                  <td className="text-end text-nowrap">{item.lateDays} ngày</td>
                  <td className="text-end text-nowrap">
                    {isProvisional && (
                      <span className="text-danger">
                        tạm tính {formatCurrencyVND(item.fineAmount)}
                      </span>
                    )}
                    {isUnpaid && (
                      <span className="fw-semibold text-warning-emphasis">
                        {formatCurrencyVND(item.fineAmount)}
                      </span>
                    )}
                    {isPaid && (
                      <span className="fw-medium text-success">
                        {formatCurrencyVND(item.fineAmount)}
                      </span>
                    )}
                  </td>
                  <td className="text-nowrap">
                    {renderFineStatusBadge(item.fineStatus)}
                  </td>
                  <td className="text-end text-nowrap">
                    {isProvisional && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success"
                        onClick={() => onRequestReturn(item)}
                      >
                        Trả thiết bị
                      </button>
                    )}
                    {isUnpaid && (
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => onRequestPay(item)}
                      >
                        Thu tiền phạt
                      </button>
                    )}
                    {isPaid && (
                      <span className="small text-muted">
                        Ngày thu: {formatDateVN(item.paidAt)}
                      </span>
                    )}
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

export default FineTable;
