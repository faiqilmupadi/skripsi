import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db/db';
import { loginSchema } from '@/features/auth/schemas/loginSchema';
import { signSession } from '@/features/auth/utils/session';

export async function POST(req: Request) {
  const parsed = loginSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ message: parsed.error.flatten() }, { status: 400 });
  const { username, password } = parsed.data;

  const users = await query<{ userId: number; username: string; role: 'kepala_gudang' | 'admin_gudang'; password: string }>(
    'SELECT userId, username, role, password FROM users WHERE username=? OR email=? LIMIT 1', [username, username]
  );
  const user = users[0];
  if (!user) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });

  const isHashed = user.password.startsWith('$2');
  const valid = isHashed ? await bcrypt.compare(password, user.password) : password === user.password;
  if (!valid) return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  if (!isHashed) await query('UPDATE users SET password=? WHERE userId=?', [await bcrypt.hash(password, 10), user.userId]);

  const token = signSession({ userId: user.userId, username: user.username, role: user.role });
  const redirectTo = user.role === 'admin_gudang' ? '/admin/stok-barang' : '/kepala-gudang/dashboard-analisis';
  const res = NextResponse.json({ redirectTo });
  res.cookies.set('session', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/' });
  return res;
}
