const fineService = require('../services/fine.service');
const {
  fineIdParamSchema,
  payFineBodySchema,
} = require('../validators/fine.validator');

async function listFines(req, res, next) {
  try {
    const data = await fineService.listFines();
    return res.status(200).json(data);
  } catch (err) {
    return next(err);
  }
}

async function payFine(req, res, next) {
  try {
    const { id } = fineIdParamSchema.parse(req.params);
    payFineBodySchema.parse(req.body);
    const data = await fineService.payFine(id);
    return res.status(200).json(data);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  listFines,
  payFine,
};
