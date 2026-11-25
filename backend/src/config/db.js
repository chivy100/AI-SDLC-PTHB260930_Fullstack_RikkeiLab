const mysql = require('mysql2/promise');
const env = require('./env');

const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  timezone: '+07:00',
  dateStrings: true,
});

// Thiet lap session time_zone +07:00 cho tung ket noi moi duoc tao trong Pool
pool.on('connection', (connection) => {
  connection.query("SET time_zone = '+07:00'", (err) => {
    if (err) {
      console.error(`[DB POOL] Không thể thiết lập session time_zone +07:00 (${err.code || 'UNKNOWN'})`);
      connection.destroy();
    }
  });
});

module.exports = { pool };
