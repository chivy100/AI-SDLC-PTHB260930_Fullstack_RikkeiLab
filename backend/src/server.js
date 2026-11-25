const env = require('./config/env');
const { pool } = require('./config/db');
const app = require('./app');

async function verifyInitialDbConnection() {
  try {
    const [rows] = await pool.query(
      'SELECT @@session.time_zone AS sessionTz, DATABASE() AS dbName'
    );
    const info = rows[0] || {};
    console.log(
      `[DB] Kết nối MySQL thành công (database: ${info.dbName}, session time_zone: ${info.sessionTz})`
    );
  } catch (err) {
    console.warn(
      `[DB WARN] Chưa kết nối được MySQL khi khởi động (${err.code || 'UNKNOWN'})`
    );
  }
}

const server = app.listen(env.PORT, async () => {
  console.log(`[API] Server Rikkei Lab đang chạy tại http://localhost:${env.PORT}`);
  await verifyInitialDbConnection();
});

async function shutdown(signal) {
  console.log(`[API] Nhận tín hiệu ${signal}, đang đóng server và MySQL pool...`);
  server.close(async () => {
    try {
      await pool.end();
    } catch (err) {
      console.error(`[DB] Lỗi khi đóng pool (${err.code || 'UNKNOWN'})`);
    }
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
