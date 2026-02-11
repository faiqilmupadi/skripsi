import { z } from 'zod';

export const itemSchema = z.object({
  partNumber: z.string().min(2),
  materialDescription: z.string().min(3),
  baseUnitOfMeasure: z.string().min(1),
  materialGroup: z.string().min(1),
  createdBy: z.string().min(1)
});
