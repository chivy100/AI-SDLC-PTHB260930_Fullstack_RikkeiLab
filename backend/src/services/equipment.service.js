const equipmentRepo = require('../repositories/equipment.repository');
const AppError = require('../utils/AppError');
const { runInTransaction } = require('../utils/transaction');

function toEquipmentDto(row) {
  return {
    id: Number(row.id),
    code: row.code,
    name: row.name,
    category: row.category,
    totalQuantity: Number(row.total_quantity),
    borrowedQuantity: Number(row.borrowed_quantity),
    availableQuantity: Number(row.available_quantity),
    createdAt: row.created_at,
  };
}

async function listEquipments({ search, category, page, limit }) {
  const { rows, totalItems } = await equipmentRepo.findPaginated({
    search,
    category,
    page,
    limit,
  });

  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / limit);

  return {
    items: rows.map(toEquipmentDto),
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
    },
  };
}

async function getEquipmentById(id) {
  const row = await equipmentRepo.findById(id);
  if (!row) {
    throw new AppError(404, 'EQUIPMENT_NOT_FOUND', 'Không tìm thấy thiết bị.');
  }

  return {
    equipment: toEquipmentDto(row),
  };
}

async function createEquipment(payload) {
  const existing = await equipmentRepo.findByCode(payload.code);
  if (existing) {
    throw new AppError(409, 'DUPLICATE_EQUIPMENT_CODE', 'Mã thiết bị đã tồn tại trong hệ thống.');
  }

  try {
    const insertedId = await equipmentRepo.create(payload);
    const created = await equipmentRepo.findById(insertedId);
    return {
      equipment: toEquipmentDto(created),
    };
  } catch (err) {
    if (err && err.code === 'ER_DUP_ENTRY') {
      throw new AppError(409, 'DUPLICATE_EQUIPMENT_CODE', 'Mã thiết bị đã tồn tại trong hệ thống.');
    }
    throw err;
  }
}

async function updateEquipment(id, payload) {
  try {
    const updated = await runInTransaction(async (conn) => {
      const existing = await equipmentRepo.findByIdForUpdate(id, conn);
      if (!existing) {
        throw new AppError(404, 'EQUIPMENT_NOT_FOUND', 'Không tìm thấy thiết bị.');
      }

      const duplicate = await equipmentRepo.findByCodeExcludingId(payload.code, id, conn);
      if (duplicate) {
        throw new AppError(409, 'DUPLICATE_EQUIPMENT_CODE', 'Mã thiết bị đã tồn tại trong hệ thống.');
      }

      const currentBorrowed = await equipmentRepo.getBorrowedQuantityById(id, conn);
      if (payload.totalQuantity < currentBorrowed) {
        throw new AppError(
          409,
          'TOTAL_QUANTITY_LESS_THAN_BORROWED',
          `Tổng số lượng không được nhỏ hơn số lượng đang được mượn (${currentBorrowed}).`
        );
      }

      await equipmentRepo.updateById(id, payload, conn);
      return equipmentRepo.findById(id, conn);
    });

    return {
      equipment: toEquipmentDto(updated),
    };
  } catch (err) {
    if (err && err.code === 'ER_DUP_ENTRY') {
      throw new AppError(409, 'DUPLICATE_EQUIPMENT_CODE', 'Mã thiết bị đã tồn tại trong hệ thống.');
    }
    throw err;
  }
}

async function deleteEquipment(id) {
  try {
    await runInTransaction(async (conn) => {
      const existing = await equipmentRepo.findByIdForUpdate(id, conn);
      if (!existing) {
        throw new AppError(404, 'EQUIPMENT_NOT_FOUND', 'Không tìm thấy thiết bị.');
      }

      const borrowingCount = await equipmentRepo.countBorrowingsByEquipmentId(id, conn);
      if (borrowingCount > 0) {
        throw new AppError(
          409,
          'EQUIPMENT_HAS_BORROWINGS',
          'Không thể xóa thiết bị đã phát sinh phiếu mượn.'
        );
      }

      await equipmentRepo.deleteById(id, conn);
    });

    return {
      message: 'Xóa thiết bị thành công.',
    };
  } catch (err) {
    if (err && err.code === 'ER_ROW_IS_REFERENCED_2') {
      throw new AppError(
        409,
        'EQUIPMENT_HAS_BORROWINGS',
        'Không thể xóa thiết bị đã phát sinh phiếu mượn.'
      );
    }
    throw err;
  }
}

module.exports = {
  listEquipments,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
};
