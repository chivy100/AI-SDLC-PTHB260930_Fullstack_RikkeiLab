const equipmentService = require('../services/equipment.service');
const {
  positiveIntParamSchema,
  listEquipmentsQuerySchema,
  equipmentBodySchema,
} = require('../validators/equipment.validator');

async function listEquipments(req, res, next) {
  try {
    const query = listEquipmentsQuerySchema.parse(req.query);
    const data = await equipmentService.listEquipments(query);
    return res.status(200).json(data);
  } catch (err) {
    return next(err);
  }
}

async function getEquipmentById(req, res, next) {
  try {
    const { id } = positiveIntParamSchema.parse(req.params);
    const data = await equipmentService.getEquipmentById(id);
    return res.status(200).json(data);
  } catch (err) {
    return next(err);
  }
}

async function createEquipment(req, res, next) {
  try {
    const payload = equipmentBodySchema.parse(req.body);
    const data = await equipmentService.createEquipment(payload);
    return res.status(201).json(data);
  } catch (err) {
    return next(err);
  }
}

async function updateEquipment(req, res, next) {
  try {
    const { id } = positiveIntParamSchema.parse(req.params);
    const payload = equipmentBodySchema.parse(req.body);
    const data = await equipmentService.updateEquipment(id, payload);
    return res.status(200).json(data);
  } catch (err) {
    return next(err);
  }
}

async function deleteEquipment(req, res, next) {
  try {
    const { id } = positiveIntParamSchema.parse(req.params);
    const data = await equipmentService.deleteEquipment(id);
    return res.status(200).json(data);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listEquipments,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
};
