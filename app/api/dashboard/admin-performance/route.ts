import { NextResponse } from 'next/server';
import { query } from '@/lib/db/db';
import { buildRange } from '@/lib/db/range';
import { requireRole } from '@/lib/http/apiAuth';

export async function GET(req: Request) {
  const auth = requireRole(['kepala_gudang']); if ('error' in auth) return auth.error;
  const url = new URL(req.url); const { start, end } = buildRange(url.searchParams.get('rangePreset') || undefined, url.searchParams.get('start') || undefined, url.searchParams.get('end') || undefined);
  const total = await query<{ total: number }>('SELECT COUNT(*) total FROM material_movement WHERE postingDate BETWEEN ? AND ?', [start, end]);
  const admins = await query<{ adminName: string; kontribusi_admin: number }>('SELECT userName adminName, COUNT(*) kontribusi_admin FROM material_movement WHERE postingDate BETWEEN ? AND ? GROUP BY userName', [start, end]);
  return NextResponse.json(admins.map((a) => ({ ...a, total_transaksi: total[0].total, ratio_kinerja: total[0].total ? a.kontribusi_admin / total[0].total : 0 })));
}
