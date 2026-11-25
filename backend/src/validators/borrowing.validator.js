const { z } = require('zod');
const { isValidIsoDate } = require('../utils/date');

const BORROWING_STATUS_FILTERS = ['all', 'borrowed', 'overdue', 'returned'];

const borrowingIdParamSchema = z.object({
  id: z
    .string({ error: 'ID phiếu mượn không hợp lệ.' })
    .regex(/^[1-9]\d*$/, 'ID phiếu mượn phải là số nguyên dương.')
    .transform(Number),
});

const listBorrowingsQuerySchema = z.object({
  status: z
    .enum(BORROWING_STATUS_FILTERS, {
      error: 'Trạng thái lọc phiếu mượn không hợp lệ.',
    })
    .optional()
    .default('all'),
});

const createBorrowingBodySchema = z.object({
  equipmentId: z
    .number({ error: 'Vui lòng chọn thiết bị hợp lệ.' })
    .int('ID thiết bị phải là số nguyên dương.')
    .positive('Vui lòng chọn thiết bị hợp lệ.'),
  borrowerName: z
    .string({ error: 'Vui lòng nhập tên người mượn.' })
    .trim()
    .min(1, 'Tên người mượn không được để trống.')
    .max(120, 'Tên người mượn tối đa 120 ký tự.'),
  quantity: z
    .number({ error: 'Số lượng mượn phải là số nguyên.' })
    .int('Số lượng mượn phải là số nguyên.')
    .positive('Số lượng mượn phải lớn hơn 0.'),
  dueDate: z
    .string({ error: 'Vui lòng chọn hạn trả.' })
    .trim()
    .refine(isValidIsoDate, 'Hạn trả phải đúng định dạng YYYY-MM-DD và là ngày hợp lệ.'),
  note: z
    .union([z.string({ error: 'Ghi chú phải là chuỗi ký tự.' }), z.null()])
    .optional()
    .transform((value) => {
      if (value === undefined || value === null) {
        return null;
      }
      const trimmed = value.trim();
      return trimmed.length === 0 ? null : trimmed;
    })
    .refine((value) => value === null || value.length <= 255, 'Ghi chú tối đa 255 ký tự.'),
});

module.exports = {
  BORROWING_STATUS_FILTERS,
  borrowingIdParamSchema,
  listBorrowingsQuerySchema,
  createBorrowingBodySchema,
};
