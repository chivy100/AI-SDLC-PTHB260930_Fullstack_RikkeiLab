const express = require('express');
const borrowingController = require('../controllers/borrowing.controller');

const router = express.Router();

router.get('/', borrowingController.listBorrowings);
router.post('/', borrowingController.createBorrowing);
router.patch('/:id/return', borrowingController.returnBorrowing);

module.exports = router;
