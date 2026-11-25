const express = require('express');
const healthRoutes = require('./health.routes');
const equipmentRoutes = require('./equipment.routes');
const borrowingRoutes = require('./borrowing.routes');
const fineRoutes = require('./fine.routes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/equipments', equipmentRoutes);
router.use('/borrowings', borrowingRoutes);
router.use('/fines', fineRoutes);

module.exports = router;
