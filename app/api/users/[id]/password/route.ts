import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { requireRole } from '@/lib/http/apiAuth';
import { query } from '@/lib/db/db';

const schema = z.object({ password: z.string().min(4) });
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = requireRole(['kepala_gudang']); if ('error' in auth) return auth.error;
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ message: 'Invalid body' }, { status: 400 });
  await query('UPDATE users SET password=?, lastChange=NOW() WHERE userId=?', [await bcrypt.hash(parsed.data.password, 10), params.id]);
  return NextResponse.json({ ok: true });
}
