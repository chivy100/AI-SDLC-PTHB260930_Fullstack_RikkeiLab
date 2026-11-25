const { pool } = require('../config/db');

const BORROWING_DETAIL_SELECT = `
  SELECT
    b.id,
    b.equipment_id,
    e.code AS equipment_code,
    e.name AS equipment_name,
    b.borrower_name,
    b.quantity,
    DATE_FORMAT(b.borrowed_at, '%Y-%m-%d') AS borrowed_at,
    DATE_FORMAT(b.due_date, '%Y-%m-%d') AS due_date,
    DATE_FORMAT(b.returned_at, '%Y-%m-%d') AS returned_at,
    b.note,
    f.id AS fine_id,
    f.late_days AS fine_late_days,
    f.amount AS fine_amount,
    f.status AS fine_status,
    DATE_FORMAT(f.paid_at, '%Y-%m-%d') AS fine_paid_at
  FROM borrowings b
  INNER JOIN equipments e ON e.id = b.equipment_id
  LEFT JOIN fines f ON f.borrowing_id = b.id
`;

async function findAll({ status, todayVN }, conn = pool) {
  const conditions = [];
  const params = [];

  if (status === 'borrowed') {
    conditions.push('b.returned_at IS NULL AND b.due_date >= ?');
    params.push(todayVN);
  } else if (status === 'overdue') {
    conditions.push('b.returned_at IS NULL AND b.due_date < ?');
    params.push(todayVN);
  } else if (status === 'returned') {
    conditions.push('b.returned_at IS NOT NULL');
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const [rows] = await conn.query(
    `${BORROWING_DETAIL_SELECT} ${whereClause} ORDER BY b.id DESC`,
    params
  );
  return rows;
}

async function findDetailedById(id, conn = pool) {
  const [rows] = await conn.query(
    `${BORROWING_DETAIL_SELECT} WHERE b.id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function findByIdForUpdate(id, conn) {
  const [rows] = await conn.query(
    `SELECT
      id,
      equipment_id,
      borrower_name,
      quantity,
      DATE_FORMAT(borrowed_at, '%Y-%m-%d') AS borrowed_at,
      DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date,
      DATE_FORMAT(returned_at, '%Y-%m-%d') AS returned_at,
      note
    FROM borrowings
    WHERE id = ?
    FOR UPDATE`,
    [id]
  );
  return rows[0] || null;
}

async function create({ equipmentId, borrowerName, quantity, borrowedAt, dueDate, note }, conn) {
  const [result] = await conn.query(
    `INSERT INTO borrowings (equipment_id, borrower_name, quantity, borrowed_at, due_date, returned_at, note)
     VALUES (?, ?, ?, ?, ?, NULL, ?)`,
    [equipmentId, borrowerName, quantity, borrowedAt, dueDate, note]
  );
  return result.insertId;
}

async function markReturned(id, returnedAt, conn) {
  const [result] = await conn.query(
    'UPDATE borrowings SET returned_at = ? WHERE id = ? AND returned_at IS NULL',
    [returnedAt, id]
  );
  return result.affectedRows;
}

module.exports = {
  findAll,
  findDetailedById,
  findByIdForUpdate,
  create,
  markReturned,
};
