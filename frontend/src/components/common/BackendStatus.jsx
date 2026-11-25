import { useCallback, useEffect, useState } from 'react';
import { checkHealth } from '../../services/healthService';
import { getErrorMessage } from '../../utils/error';

function BackendStatus() {
  const [state, setState] = useState({
    status: 'checking',
    message: 'Đang kiểm tra kết nối tới máy chủ Backend...',
  });

  const runHealthCheck = useCallback(async (signal) => {
    setState({
      status: 'checking',
      message: 'Đang kiểm tra kết nối tới máy chủ Backend...',
    });

    try {
      const data = await checkHealth(signal);
      if (data?.status === 'ok' && data?.database === 'connected') {
        setState({
          status: 'connected',
          message: 'Kết nối Backend API và cơ sở dữ liệu MySQL đang hoạt động.',
        });
      } else {
        setState({
          status: 'error',
          message: 'Máy chủ phản hồi trạng thái chưa sẵn sàng.',
        });
      }
    } catch (err) {
      if (err?.isCanceled) {
        return;
      }
      setState({
        status: 'error',
        message: getErrorMessage(
          err,
          'Không thể kiểm tra kết nối tới máy chủ Backend.'
        ),
      });
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    runHealthCheck(controller.signal);
    return () => controller.abort();
  }, [runHealthCheck]);

  const alertClass =
    state.status === 'connected'
      ? 'alert-success'
      : state.status === 'error'
        ? 'alert-danger'
        : 'alert-secondary';

  const buttonClass =
    state.status === 'error' ? 'btn-outline-danger' : 'btn-outline-secondary';

  return (
    <div
      className={`alert ${alertClass} d-flex flex-wrap justify-content-between align-items-center gap-2 py-2 mb-3`}
      role="status"
    >
      <span className="small mb-0">{state.message}</span>
      <button
        type="button"
        className={`btn btn-sm ${buttonClass}`}
        disabled={state.status === 'checking'}
        onClick={() => runHealthCheck()}
      >
        {state.status === 'checking' ? 'Đang kiểm tra...' : 'Kiểm tra lại'}
      </button>
    </div>
  );
}

export default BackendStatus;
