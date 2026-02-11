import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db/db';
import { requireRole } from '@/lib/http/apiAuth';
import { getPage } from '@/lib/http/pagination';
import { userSchema } from '@/features/accountManagement/schemas/userSchema';

export async function GET(req: Request) {
  const auth = requireRole(['kepala_gudang']); if ('error' in auth) return auth.error;
  const url = new URL(req.url); const { page, limit, offset } = getPage(url.searchParams); const q = url.searchParams.get('q') || '';
  const rows = await query('SELECT userId, username, email, role, createdOn, status FROM users WHERE (username LIKE ? OR email LIKE ?) LIMIT 10 OFFSET ?', [`%${q}%`, `%${q}%`, offset]);
  const total = await query<{ total: number }>('SELECT COUNT(*) total FROM users WHERE (username LIKE ? OR email LIKE ?)', [`%${q}%`, `%${q}%`]);
  return NextResponse.json({ data: rows, page, total: Math.ceil(total[0].total / limit) || 1 });
}

export async function POST(req: Request) {
  const auth = requireRole(['kepala_gudang']); if ('error' in auth) return auth.error;
  const parsed = userSchema.safeParse(await req.json());
  if (!parsed.success || !parsed.data.password) return NextResponse.json({ message: 'Invalid body' }, { status: 400 });
  const { username, email, role, password } = parsed.data;
  await query('INSERT INTO users(username,email,password,role,createdOn,lastChange,status) VALUES(?,?,?,?,NOW(),NOW(),?)', [username, email, await bcrypt.hash(password, 10), role, 'active']);
  return NextResponse.json({ ok: true });
}
