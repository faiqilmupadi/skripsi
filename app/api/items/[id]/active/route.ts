import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/http/apiAuth';
import { query } from '@/lib/db/db';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = requireRole(['kepala_gudang']); if ('error' in auth) return auth.error;
  const body = await req.json().catch(() => ({}));
  const active = body.active === 0 ? 0 : 1;
  await query('UPDATE material_master SET isActive=? WHERE partNumber=?', [active, params.id]);
  return NextResponse.json({ ok: true });
}
