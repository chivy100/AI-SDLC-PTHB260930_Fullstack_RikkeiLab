const { pool } = require('../config/db');

async function runInTransaction(work) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const result = await work(conn);
    await conn.commit();
    return result;
  } catch (err) {
    try {
      await conn.rollback();
    } catch (_) {
      // Bo qua loi rollback neu ket noi da bi ngat truoc do
    }
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = { runInTransaction };
