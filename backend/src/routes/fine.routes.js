const express = require('express');
const fineController = require('../controllers/fine.controller');

const router = express.Router();

router.get('/', fineController.listFines);
router.patch('/:id/pay', fineController.payFine);

module.exports = router;
