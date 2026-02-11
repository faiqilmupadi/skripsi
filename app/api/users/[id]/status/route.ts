import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/http/apiAuth';
import { query } from '@/lib/db/db';

export async function PATCH(_: Request, { params }: { params: { id: string } }) {
  const auth = requireRole(['kepala_gudang']); if ('error' in auth) return auth.error;
  await query("UPDATE users SET status='inactive', lastChange=NOW() WHERE userId=?", [params.id]);
  return NextResponse.json({ ok: true });
}
