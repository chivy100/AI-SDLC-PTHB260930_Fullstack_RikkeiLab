import { DAILY_FINE_RATE, formatCurrencyVND } from '../../utils/format';

function FineSummary({ summary }) {
  const dailyRate = summary?.dailyRate ?? DAILY_FINE_RATE;

  return (
    <div className="row g-3 mb-4">
      <div className="col-md-4">
        <div className="card h-100">
          <div className="card-body">
            <div className="text-muted small">Tiền phạt đã thu</div>
            <div className="fs-4 fw-bold text-success mt-1">
              {formatCurrencyVND(summary?.collectedAmount)}
            </div>
            <div className="small text-muted mt-2">
              Tổng tiền các khoản phạt đã thanh toán
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card h-100">
          <div className="card-body">
            <div className="text-muted small">Tiền phạt đang nợ</div>
            <div className="fs-4 fw-bold text-danger mt-1">
              {formatCurrencyVND(summary?.totalOwedAmount)}
            </div>
            <div className="small text-muted mt-2">
              <div>
                Đã chốt, chưa thu:{' '}
                <strong className="text-warning-emphasis">
                  {formatCurrencyVND(summary?.unpaidSettledAmount)}
                </strong>
              </div>
              <div>
                Tạm tính, chưa trả:{' '}
                <strong className="text-danger">
                  {formatCurrencyVND(summary?.provisionalAmount)}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card h-100">
          <div className="card-body">
            <div className="text-muted small">Mức phạt</div>
            <div className="fs-5 fw-bold text-dark mt-1">
              {formatCurrencyVND(dailyRate)} / thiết bị / ngày
            </div>
            <div className="small text-muted mt-2">
              Mức phạt cố định theo quy định hệ thống
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FineSummary;
