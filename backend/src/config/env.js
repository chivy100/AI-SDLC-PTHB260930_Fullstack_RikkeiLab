const path = require('path');
const dotenv = require('dotenv');
const { z } = require('zod');

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
  quiet: true,
});

const envSchema = z.object({
  PORT: z.coerce
    .number({ error: 'PORT phải là số nguyên hợp lệ.' })
    .int('PORT phải là số nguyên.')
    .min(1, 'PORT phải từ 1 đến 65535.')
    .max(65535, 'PORT phải từ 1 đến 65535.')
    .default(5000),
  DB_HOST: z.string({ error: 'Thiếu biến môi trường DB_HOST.' }).trim().min(1, 'Thiếu biến môi trường DB_HOST.'),
  DB_PORT: z.coerce
    .number({ error: 'DB_PORT phải là số nguyên hợp lệ.' })
    .int('DB_PORT phải là số nguyên.')
    .min(1, 'DB_PORT phải từ 1 đến 65535.')
    .max(65535, 'DB_PORT phải từ 1 đến 65535.')
    .default(3306),
  DB_USER: z.string({ error: 'Thiếu biến môi trường DB_USER.' }).trim().min(1, 'Thiếu biến môi trường DB_USER.'),
  DB_PASSWORD: z
    .string({ error: 'Thiếu biến môi trường DB_PASSWORD.' })
    .min(1, 'DB_PASSWORD không được để trống.'),
  DB_NAME: z.string({ error: 'Thiếu biến môi trường DB_NAME.' }).trim().min(1, 'Thiếu biến môi trường DB_NAME.'),
  CORS_ORIGIN: z
    .string({ error: 'CORS_ORIGIN không được để trống.' })
    .trim()
    .min(1, 'CORS_ORIGIN không được để trống.')
    .default('http://localhost:5173'),
});

function parseEnv(rawEnv = process.env) {
  const parsed = envSchema.safeParse(rawEnv);
  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join('.') || 'ENV'}: ${issue.message}`)
      .join('; ');
    throw new Error(`Cấu hình biến môi trường không hợp lệ: ${details}`);
  }
  return Object.freeze(parsed.data);
}

let env;
try {
  env = parseEnv(process.env);
} catch (error) {
  console.error(`[ENV ERROR] ${error.message}`);
  process.exit(1);
}

module.exports = env;
