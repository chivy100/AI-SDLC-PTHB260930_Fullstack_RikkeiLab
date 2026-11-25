const { pool } = require('../config/db');

const SETTLED_FINE_SELECT = `
  SELECT
    f.id AS fine_id,
    f.borrowing_id,
    b.equipment_id,
    e.code AS equipment_code,
    e.name AS equipment_name,
    b.borrower_name,
    b.quantity,
    DATE_FORMAT(b.borrowed_at, '%Y-%m-%d') AS borrowed_at,
    DATE_FORMAT(b.due_date, '%Y-%m-%d') AS due_date,
    DATE_FORMAT(b.returned_at, '%Y-%m-%d') AS returned_at,
    f.late_days,
    f.daily_rate,
    f.amount,
    f.status AS fine_status,
    DATE_FORMAT(f.paid_at, '%Y-%m-%d') AS paid_at
  FROM fines f
  INNER JOIN borrowings b ON b.id = f.borrowing_id
  INNER JOIN equipments e ON e.id = b.equipment_id
`;

async function create({ borrowingId, lateDays, dailyRate, amount }, conn) {
  const [result] = await conn.query(
    `INSERT INTO fines (borrowing_id, late_days, daily_rate, amount, status, paid_at)
     VALUES (?, ?, ?, ?, 'unpaid', NULL)`,
    [borrowingId, lateDays, dailyRate, amount]
  );
  return result.insertId;
}

async function findByIdForUpdate(id, conn) {
  const [rows] = await conn.query(
    `SELECT
      id,
      borrowing_id,
      late_days,
      daily_rate,
      amount,
      status,
      DATE_FORMAT(paid_at, '%Y-%m-%d') AS paid_at
    FROM fines
    WHERE id = ?
    FOR UPDATE`,
    [id]
  );
  return rows[0] || null;
}

async function markAsPaid(id, paidAt, conn) {
  const [result] = await conn.query(
    "UPDATE fines SET status = 'paid', paid_at = ? WHERE id = ? AND status = 'unpaid'",
    [paidAt, id]
  );
  return result.affectedRows;
}

async function findDetailedById(id, conn = pool) {
  const [rows] = await conn.query(
    `${SETTLED_FINE_SELECT} WHERE f.id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function findAllSettled(conn = pool) {
  const [rows] = await conn.query(
    `${SETTLED_FINE_SELECT} ORDER BY f.borrowing_id DESC`
  );
  return rows;
}

async function findAllProvisionalOverdue(todayVN, dailyRate, conn = pool) {
  const [rows] = await conn.query(
    `SELECT
      NULL AS fine_id,
      b.id AS borrowing_id,
      b.equipment_id,
      e.code AS equipment_code,
      e.name AS equipment_name,
      b.borrower_name,
      b.quantity,
      DATE_FORMAT(b.borrowed_at, '%Y-%m-%d') AS borrowed_at,
      DATE_FORMAT(b.due_date, '%Y-%m-%d') AS due_date,
      NULL AS returned_at,
      CAST(DATEDIFF(?, b.due_date) AS SIGNED) AS late_days,
      CAST(? AS SIGNED) AS daily_rate,
      CAST((DATEDIFF(?, b.due_date) * b.quantity * ?) AS SIGNED) AS amount,
      'provisional' AS fine_status,
      NULL AS paid_at
    FROM borrowings b
    INNER JOIN equipments e ON e.id = b.equipment_id
    LEFT JOIN fines f ON f.borrowing_id = b.id
    WHERE b.returned_at IS NULL
      AND b.due_date < ?
      AND f.id IS NULL
    ORDER BY b.id DESC`,
    [todayVN, dailyRate, todayVN, dailyRate, todayVN]
  );
  return rows;
}

async function getSummaryTotals(todayVN, dailyRate, conn = pool) {
  const [settledRows] = await conn.query(
    `SELECT
      CAST(COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) AS SIGNED) AS collected_amount,
      CAST(COALESCE(SUM(CASE WHEN status = 'unpaid' THEN amount ELSE 0 END), 0) AS SIGNED) AS unpaid_settled_amount
    FROM fines`
  );

  const [provisionalRows] = await conn.query(
    `SELECT
      CAST(COALESCE(SUM(DATEDIFF(?, b.due_date) * b.quantity * ?), 0) AS SIGNED) AS provisional_amount
    FROM borrowings b
    LEFT JOIN fines f ON f.borrowing_id = b.id
    WHERE b.returned_at IS NULL
      AND b.due_date < ?
      AND f.id IS NULL`,
    [todayVN, dailyRate, todayVN]
  );

  const settled = settledRows[0] || {};
  const provisional = provisionalRows[0] || {};

  return {
    collectedAmount: Number(settled.collected_amount || 0),
    unpaidSettledAmount: Number(settled.unpaid_settled_amount || 0),
    provisionalAmount: Number(provisional.provisional_amount || 0),
  };
}

module.exports = {
  create,
  findByIdForUpdate,
  markAsPaid,
  findDetailedById,
  findAllSettled,
  findAllProvisionalOverdue,
  getSummaryTotals,
};
