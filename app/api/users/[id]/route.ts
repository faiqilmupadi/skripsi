import { NextResponse } from 'next/server';
import { query } from '@/lib/db/db';
import { requireRole } from '@/lib/http/apiAuth';
import { userSchema } from '@/features/accountManagement/schemas/userSchema';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = requireRole(['kepala_gudang']); if ('error' in auth) return auth.error;
  const parsed = userSchema.omit({ password: true }).safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ message: 'Invalid body' }, { status: 400 });
  await query('UPDATE users SET username=?, email=?, role=?, lastChange=NOW() WHERE userId=?', [parsed.data.username, parsed.data.email, parsed.data.role, params.id]);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const auth = requireRole(['kepala_gudang']); if ('error' in auth) return auth.error;
  await query('DELETE FROM users WHERE userId=?', [params.id]);
  return NextResponse.json({ ok: true });
}
