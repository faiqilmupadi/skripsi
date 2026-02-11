import { NextResponse } from 'next/server';
import { stockActionSchema } from '@/features/stockBarang/schemas/stockActionSchema';
import { query } from '@/lib/db/db';
import { requireRole } from '@/lib/http/apiAuth';

export async function POST(req: Request) {
  const auth = requireRole(['admin_gudang']); if ('error' in auth) return auth.error;
  const parsed = stockActionSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ message: 'Invalid body' }, { status: 400 });
  const { partNumber, plant, qty } = parsed.data;
  await query('INSERT INTO restock_requests(partNumber,plant,qtyRequested,requestedByUserId,status,createdAt) VALUES(?,?,?,?,\'pending\',NOW())', [partNumber, plant, qty, auth.session.userId]);
  return NextResponse.json({ ok: true });
}
