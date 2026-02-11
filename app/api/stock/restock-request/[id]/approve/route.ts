import { NextResponse } from 'next/server';
import { restockApprovalSchema } from '@/features/stockBarang/schemas/stockActionSchema';
import { pool } from '@/lib/db/db';
import { requireRole } from '@/lib/http/apiAuth';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = requireRole(['kepala_gudang']); if ('error' in auth) return auth.error;
  const parsed = restockApprovalSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ message: 'Invalid body' }, { status: 400 });
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [reqRows]: any = await conn.execute('SELECT * FROM restock_requests WHERE id=? FOR UPDATE', [params.id]);
    const reqRow = reqRows[0];
    if (!reqRow || reqRow.status !== 'pending') throw new Error('Request not pending');
    if (parsed.data.freeStockIn + parsed.data.blockedStockIn !== Number(reqRow.qtyRequested)) throw new Error('Qty mismatch');
    await conn.execute('UPDATE material_stock SET freeStock=freeStock+?, blocked=blocked+? WHERE partNumber=? AND plant=?', [parsed.data.freeStockIn, parsed.data.blockedStockIn, reqRow.partNumber, reqRow.plant]);
    await conn.execute("UPDATE restock_requests SET status='approved', approvedByUserId=?, approvedAt=NOW(), freeStockIn=?, blockedStockIn=? WHERE id=?", [auth.session.userId, parsed.data.freeStockIn, parsed.data.blockedStockIn, params.id]);
    await conn.execute("INSERT INTO notifications(userId,title,message,isRead,createdAt) VALUES(?,?,?,0,NOW())", [reqRow.requestedByUserId, 'Restock approved', `Request #${params.id} approved`]);
    await conn.execute("INSERT INTO material_movement(partNumber,plant,materialDescription,postingDate,movementType,orderNo,purchaseOrder,quantity,baseUnitOfMeasure,amtInLocCur,userName) VALUES(?,?,?,NOW(),'101','-','-',?,'EA',0,?)", [reqRow.partNumber, reqRow.plant, '', Number(reqRow.qtyRequested), auth.session.username]);
    await conn.commit();
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    await conn.rollback(); return NextResponse.json({ message: e.message }, { status: 400 });
  } finally { conn.release(); }
}
