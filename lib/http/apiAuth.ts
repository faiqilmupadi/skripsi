import { NextResponse } from 'next/server';
import { getSession } from '@/features/auth/utils/session';
import { Role } from '@/types/auth';

export function requireRole(roles: Role[]) {
  const session = getSession();
  if (!session || !roles.includes(session.role)) {
    return { error: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }) };
  }
  return { session };
}
