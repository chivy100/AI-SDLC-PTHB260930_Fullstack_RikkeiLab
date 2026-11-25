const { z } = require('zod');

const fineIdParamSchema = z.object({
  id: z
    .string({ error: 'ID khoản phạt không hợp lệ.' })
    .regex(/^[1-9]\d*$/, 'ID khoản phạt phải là số nguyên dương.')
    .transform(Number),
});

const payFineBodySchema = z
  .unknown()
  .refine(
    (value) =>
      value === undefined ||
      (typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        Object.keys(value).length === 0),
    'Không được phép gửi dữ liệu chỉnh sửa số tiền, mức phạt hoặc ngày thu từ client.'
  );

module.exports = {
  fineIdParamSchema,
  payFineBodySchema,
};
