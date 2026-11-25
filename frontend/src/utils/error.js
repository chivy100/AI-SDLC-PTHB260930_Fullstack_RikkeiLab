import axios from 'axios';

export function normalizeApiError(error) {
  if (axios.isCancel(error) || error?.code === 'ERR_CANCELED') {
    const canceledErr = new Error('Yêu cầu đã bị hủy.');
    canceledErr.code = 'REQUEST_CANCELED';
    canceledErr.isCanceled = true;
    return canceledErr;
  }

  if (error?.response) {
    const { status, data } = error.response;
    const apiError = data?.error;
    const err = new Error(
      apiError?.message || `Máy chủ phản hồi lỗi (HTTP ${status}).`
    );
    err.code = apiError?.code || `HTTP_${status}`;
    err.status = status;
    err.isNetworkError = false;
    return err;
  }

  if (error?.code === 'ECONNABORTED') {
    const err = new Error(
      'Kết nối tới máy chủ API bị quá thời gian. Vui lòng thử lại.'
    );
    err.code = 'REQUEST_TIMEOUT';
    err.status = null;
    err.isNetworkError = true;
    return err;
  }

  const err = new Error(
    'Không thể kết nối tới máy chủ API. Vui lòng kiểm tra Backend đã khởi động chưa.'
  );
  err.code = 'NETWORK_ERROR';
  err.status = null;
  err.isNetworkError = true;
  return err;
}

export function getErrorMessage(error, fallbackMessage = 'Đã xảy ra lỗi.') {
  return error?.message || fallbackMessage;
}
