import { z } from 'zod';

export const stockActionSchema = z.object({
  partNumber: z.string().min(2),
  plant: z.string().min(1),
  qty: z.coerce.number().positive()
});

export const restockApprovalSchema = z.object({
  freeStockIn: z.coerce.number().min(0),
  blockedStockIn: z.coerce.number().min(0)
}).refine((v) => v.freeStockIn + v.blockedStockIn > 0, 'Total input wajib lebih dari 0');
