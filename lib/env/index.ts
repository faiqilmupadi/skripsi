import { z } from 'zod';

const envSchema = z.object({
  DB_HOST: z.string().default('127.0.0.1'),
  DB_PORT: z.coerce.number().default(3306),
  DB_USER: z.string().default('root'),
  DB_PASSWORD: z.string().default(''),
  DB_NAME: z.string().default('warehouse_db'),
  JWT_SECRET: z.string().default('super-secret-key')
});

export const env = envSchema.parse(process.env);
