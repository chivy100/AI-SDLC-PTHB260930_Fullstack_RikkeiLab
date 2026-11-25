const { pool } = require('../config/db');

async function checkHealth() {
  const [rows] = await pool.query(
    'SELECT 1 AS ok, @@session.time_zone AS sessionTz'
  );

  const row = rows[0];
  if (!row || row.ok !== 1 || row.sessionTz !== '+07:00') {
    const err = new Error('Trạng thái kết nối cơ sở dữ liệu chưa sẵn sàng.');
    err.code = 'DATABASE_UNHEALTHY';
    throw err;
  }

  return {
    status: 'ok',
    database: 'connected',
  };
}

module.exports = { checkHealth };
