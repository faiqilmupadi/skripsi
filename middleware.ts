import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const ROLE_HOME = {
  admin_gudang: '/admin/stok-barang',
  kepala_gudang: '/kepala-gudang/dashboard-analisis'
} as const;

export function middleware(req: NextRequest) {
  const token = req.cookies.get('session')?.value;
  const { pathname } = req.nextUrl;
  const isPublic = pathname.startsWith('/login') || pathname.startsWith('/api/auth/login');
  if (!token && !isPublic) return NextResponse.redirect(new URL('/login', req.url));
  if (!token) return NextResponse.next();

  const payload = jwt.decode(token) as { role?: keyof typeof ROLE_HOME } | null;
  const role = payload?.role;
  if (!role) return NextResponse.redirect(new URL('/login', req.url));
  if (pathname === '/' || pathname === '/login') {
    return NextResponse.redirect(new URL(ROLE_HOME[role], req.url));
  }
  if (pathname.startsWith('/admin') && role !== 'admin_gudang') {
    return NextResponse.redirect(new URL(ROLE_HOME[role], req.url));
  }
  if (pathname.startsWith('/kepala-gudang') && role !== 'kepala_gudang') {
    return NextResponse.redirect(new URL(ROLE_HOME[role], req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
