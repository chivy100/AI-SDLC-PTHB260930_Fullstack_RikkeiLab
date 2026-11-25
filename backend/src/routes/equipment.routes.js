const express = require('express');
const equipmentController = require('../controllers/equipment.controller');

const router = express.Router();

router.get('/', equipmentController.listEquipments);
router.get('/:id', equipmentController.getEquipmentById);
router.post('/', equipmentController.createEquipment);
router.put('/:id', equipmentController.updateEquipment);
router.delete('/:id', equipmentController.deleteEquipment);

module.exports = router;
