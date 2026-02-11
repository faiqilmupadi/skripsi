import { NextResponse } from 'next/server';
import { stockActionSchema } from '@/features/stockBarang/schemas/stockActionSchema';
import { requireRole } from '@/lib/http/apiAuth';
import { pool, query } from '@/lib/db/db';

export async function POST(req: Request) {
  const auth = requireRole(['admin_gudang']); if ('error' in auth) return auth.error;
  const parsed = stockActionSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ message: 'Invalid body' }, { status: 400 });
  const { partNumber, plant, qty } = parsed.data; const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [stockRows]: any = await conn.execute('SELECT freeStock FROM material_stock WHERE partNumber=? AND plant=? FOR UPDATE', [partNumber, plant]);
    if (!stockRows[0] || Number(stockRows[0].freeStock) < qty) throw new Error('Insufficient free stock');
    await conn.execute('UPDATE material_stock SET freeStock = freeStock - ? WHERE partNumber=? AND plant=?', [qty, partNumber, plant]);
    await conn.execute("INSERT INTO material_movement(partNumber,plant,materialDescription,postingDate,movementType,orderNo,purchaseOrder,quantity,baseUnitOfMeasure,amtInLocCur,userName) SELECT ?,?,?,NOW(),'261','-','-',?,?,0,?", [partNumber, plant, '', -qty, 'EA', auth.session.username]);
    await conn.commit();
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    await conn.rollback(); return NextResponse.json({ message: e.message }, { status: 400 });
  } finally { conn.release(); }
}
