const { ZodError } = require('zod');
const AppError = require('../utils/AppError');

const DB_UNAVAILABLE_CODES = new Set([
  'ECONNREFUSED',
  'PROTOCOL_CONNECTION_LOST',
  'ETIMEDOUT',
  'ENOTFOUND',
  'ER_ACCESS_DENIED_ERROR',
  'ER_BAD_DB_ERROR',
]);

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'Dữ liệu JSON gửi lên không đúng định dạng.',
      },
    });
  }

  if (err instanceof ZodError) {
    const firstIssue = err.issues && err.issues[0];
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: firstIssue ? firstIssue.message : 'Dữ liệu đầu vào không hợp lệ.',
      },
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  if (err && DB_UNAVAILABLE_CODES.has(err.code)) {
    console.error(`[DB ERROR] ${err.code}`);
    return res.status(503).json({
      error: {
        code: 'DATABASE_UNAVAILABLE',
        message: 'Không thể kết nối cơ sở dữ liệu. Vui lòng thử lại sau.',
      },
    });
  }

  const safeCode = err && err.code ? err.code : 'UNKNOWN';
  const safeMessage = err && err.message ? err.message : 'Unknown error';
  console.error(`[UNHANDLED ERROR] code=${safeCode} message=${safeMessage}`);

  return res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.',
    },
  });
}

module.exports = errorHandler;
