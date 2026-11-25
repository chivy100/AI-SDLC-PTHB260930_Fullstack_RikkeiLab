const express = require('express');
const healthRoutes = require('./health.routes');
const equipmentRoutes = require('./equipment.routes');
const borrowingRoutes = require('./borrowing.routes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/equipments', equipmentRoutes);
router.use('/borrowings', borrowingRoutes);

module.exports = router;
