import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/http/apiAuth';
import { query } from '@/lib/db/db';

export async function PATCH(_: Request, { params }: { params: { id: string } }) {
  const auth = requireRole(['kepala_gudang']); if ('error' in auth) return auth.error;
  await query("UPDATE restock_requests SET status='rejected', approvedByUserId=?, approvedAt=NOW() WHERE id=?", [auth.session.userId, params.id]);
  return NextResponse.json({ ok: true });
}
