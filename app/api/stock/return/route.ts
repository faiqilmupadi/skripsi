import { NextResponse } from 'next/server';
import { stockActionSchema } from '@/features/stockBarang/schemas/stockActionSchema';
import { requireRole } from '@/lib/http/apiAuth';
import { pool } from '@/lib/db/db';

export async function POST(req: Request) {
  const auth = requireRole(['admin_gudang']); if ('error' in auth) return auth.error;
  const parsed = stockActionSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ message: 'Invalid body' }, { status: 400 });
  const { partNumber, plant, qty } = parsed.data; const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [stockRows]: any = await conn.execute('SELECT blocked FROM material_stock WHERE partNumber=? AND plant=? FOR UPDATE', [partNumber, plant]);
    if (!stockRows[0] || Number(stockRows[0].blocked) < qty) throw new Error('Blocked stock insufficient');
    await conn.execute('UPDATE material_stock SET blocked = blocked - ? WHERE partNumber=? AND plant=?', [qty, partNumber, plant]);
    await conn.execute("INSERT INTO material_movement(partNumber,plant,materialDescription,postingDate,movementType,orderNo,purchaseOrder,quantity,baseUnitOfMeasure,amtInLocCur,userName) VALUES(?,?,?,NOW(),'Z48','-','-',?, 'EA',0,?)", [partNumber, plant, '', qty, auth.session.username]);
    await conn.commit();
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    await conn.rollback(); return NextResponse.json({ message: e.message }, { status: 400 });
  } finally { conn.release(); }
}
