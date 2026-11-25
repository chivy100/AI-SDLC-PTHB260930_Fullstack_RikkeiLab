const borrowingService = require('../services/borrowing.service');
const {
  borrowingIdParamSchema,
  listBorrowingsQuerySchema,
  createBorrowingBodySchema,
} = require('../validators/borrowing.validator');

async function listBorrowings(req, res, next) {
  try {
    const query = listBorrowingsQuerySchema.parse(req.query);
    const data = await borrowingService.listBorrowings(query);
    return res.status(200).json(data);
  } catch (err) {
    return next(err);
  }
}

async function createBorrowing(req, res, next) {
  try {
    const payload = createBorrowingBodySchema.parse(req.body);
    const data = await borrowingService.createBorrowing(payload);
    return res.status(201).json(data);
  } catch (err) {
    return next(err);
  }
}

async function returnBorrowing(req, res, next) {
  try {
    const { id } = borrowingIdParamSchema.parse(req.params);
    const data = await borrowingService.returnBorrowing(id);
    return res.status(200).json(data);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listBorrowings,
  createBorrowing,
  returnBorrowing,
};
