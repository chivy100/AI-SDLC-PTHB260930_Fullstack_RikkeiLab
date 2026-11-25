const { z } = require('zod');

const EQUIPMENT_CATEGORIES = ['laptop', 'man_hinh', 'mach_dien_tu', 'phu_kien'];

const positiveIntParamSchema = z.object({
  id: z
    .string({ error: 'ID thiết bị không hợp lệ.' })
    .regex(/^[1-9]\d*$/, 'ID thiết bị phải là số nguyên dương.')
    .transform(Number),
});

const listEquipmentsQuerySchema = z.object({
  search: z
    .string()
    .optional()
    .default('')
    .transform((value) => value.trim()),
  category: z
    .enum(['all', ...EQUIPMENT_CATEGORIES], {
      error: 'Loại thiết bị lọc không hợp lệ.',
    })
    .optional()
    .default('all'),
  page: z
    .string()
    .regex(/^[1-9]\d*$/, 'Số trang phải là số nguyên dương.')
    .transform(Number)
    .optional()
    .default(1),
  limit: z
    .string()
    .regex(/^[1-9]\d*$/, 'Số lượng mỗi trang phải là số nguyên dương.')
    .transform(Number)
    .refine((value) => value >= 1 && value <= 100, 'Số lượng mỗi trang phải từ 1 đến 100.')
    .optional()
    .default(8),
});

const equipmentBodySchema = z.object({
  code: z
    .string({ error: 'Vui lòng nhập mã thiết bị.' })
    .trim()
    .min(1, 'Mã thiết bị không được để trống.')
    .max(20, 'Mã thiết bị tối đa 20 ký tự.'),
  name: z
    .string({ error: 'Vui lòng nhập tên thiết bị.' })
    .trim()
    .min(1, 'Tên thiết bị không được để trống.')
    .max(150, 'Tên thiết bị tối đa 150 ký tự.'),
  category: z.enum(EQUIPMENT_CATEGORIES, {
    error: 'Loại thiết bị không hợp lệ.',
  }),
  totalQuantity: z
    .number({ error: 'Tổng số lượng phải là số nguyên.' })
    .int('Tổng số lượng phải là số nguyên.')
    .min(0, 'Tổng số lượng không được âm.'),
});

module.exports = {
  EQUIPMENT_CATEGORIES,
  positiveIntParamSchema,
  listEquipmentsQuerySchema,
  equipmentBodySchema,
};
