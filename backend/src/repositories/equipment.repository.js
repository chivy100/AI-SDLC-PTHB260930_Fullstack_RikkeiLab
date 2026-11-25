const { pool } = require('../config/db');

const EQUIPMENT_BASE_SELECT = `
  SELECT
    e.id,
    e.code,
    e.name,
    e.category,
    e.total_quantity,
    DATE_FORMAT(e.created_at, '%Y-%m-%d') AS created_at,
    CAST(COALESCE(b_agg.borrowed_quantity, 0) AS SIGNED) AS borrowed_quantity,
    CAST((e.total_quantity - COALESCE(b_agg.borrowed_quantity, 0)) AS SIGNED) AS available_quantity
  FROM equipments e
  LEFT JOIN (
    SELECT equipment_id, SUM(quantity) AS borrowed_quantity
    FROM borrowings
    WHERE returned_at IS NULL
    GROUP BY equipment_id
  ) b_agg ON b_agg.equipment_id = e.id
`;

function escapeLikePattern(keyword) {
  return keyword.replace(/[\\%_]/g, '\\$&');
}

async function findPaginated({ search, category, page, limit }, conn = pool) {
  const conditions = [];
  const params = [];

  if (search) {
    const pattern = `%${escapeLikePattern(search)}%`;
    conditions.push("(e.code LIKE ? ESCAPE '\\\\' OR e.name LIKE ? ESCAPE '\\\\')");
    params.push(pattern, pattern);
  }

  if (category && category !== 'all') {
    conditions.push('e.category = ?');
    params.push(category);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * limit;

  const [countRows] = await conn.query(
    `SELECT COUNT(*) AS total FROM equipments e ${whereClause}`,
    params
  );
  const totalItems = Number(countRows[0].total);

  const [rows] = await conn.query(
    `${EQUIPMENT_BASE_SELECT} ${whereClause} ORDER BY e.id ASC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return { rows, totalItems };
}

async function findById(id, conn = pool) {
  const [rows] = await conn.query(
    `${EQUIPMENT_BASE_SELECT} WHERE e.id = ? LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function findByIdForUpdate(id, conn) {
  const [rows] = await conn.query(
    'SELECT id, code, name, category, total_quantity FROM equipments WHERE id = ? FOR UPDATE',
    [id]
  );
  return rows[0] || null;
}

async function findByCode(code, conn = pool) {
  const [rows] = await conn.query(
    'SELECT id, code FROM equipments WHERE code = ? LIMIT 1',
    [code]
  );
  return rows[0] || null;
}

async function findByCodeExcludingId(code, excludeId, conn = pool) {
  const [rows] = await conn.query(
    'SELECT id, code FROM equipments WHERE code = ? AND id <> ? LIMIT 1',
    [code, excludeId]
  );
  return rows[0] || null;
}

async function getBorrowedQuantityById(equipmentId, conn) {
  const [rows] = await conn.query(
    'SELECT CAST(COALESCE(SUM(quantity), 0) AS SIGNED) AS borrowed_quantity FROM borrowings WHERE equipment_id = ? AND returned_at IS NULL',
    [equipmentId]
  );
  return Number(rows[0].borrowed_quantity);
}

async function countBorrowingsByEquipmentId(equipmentId, conn) {
  const [rows] = await conn.query(
    'SELECT COUNT(*) AS total FROM borrowings WHERE equipment_id = ?',
    [equipmentId]
  );
  return Number(rows[0].total);
}

async function create({ code, name, category, totalQuantity }, conn = pool) {
  const [result] = await conn.query(
    'INSERT INTO equipments (code, name, category, total_quantity) VALUES (?, ?, ?, ?)',
    [code, name, category, totalQuantity]
  );
  return result.insertId;
}

async function updateById(id, { code, name, category, totalQuantity }, conn) {
  const [result] = await conn.query(
    'UPDATE equipments SET code = ?, name = ?, category = ?, total_quantity = ? WHERE id = ?',
    [code, name, category, totalQuantity, id]
  );
  return result.affectedRows;
}

async function deleteById(id, conn) {
  const [result] = await conn.query('DELETE FROM equipments WHERE id = ?', [id]);
  return result.affectedRows;
}

module.exports = {
  findPaginated,
  findById,
  findByIdForUpdate,
  findByCode,
  findByCodeExcludingId,
  getBorrowedQuantityById,
  countBorrowingsByEquipmentId,
  create,
  updateById,
  deleteById,
};
