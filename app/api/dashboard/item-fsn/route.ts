import { NextResponse } from 'next/server';
import { query } from '@/lib/db/db';
import { buildRange } from '@/lib/db/range';
import { requireRole } from '@/lib/http/apiAuth';

export async function GET(req: Request) {
  const auth = requireRole(['kepala_gudang']); if ('error' in auth) return auth.error;
  const url = new URL(req.url); const mode = url.searchParams.get('mode') || 'fastest';
  const { start, end } = buildRange(url.searchParams.get('rangePreset') || undefined, url.searchParams.get('start') || undefined, url.searchParams.get('end') || undefined);
  const rows = await query<any>(`SELECT m.partNumber, MAX(m.materialDescription) materialDescription, SUM(ABS(m.quantity)) outgoing_qty, MAX(s.freeStock) free_stock_now
    FROM material_movement m LEFT JOIN material_stock s ON s.partNumber=m.partNumber AND s.plant=m.plant
    WHERE m.postingDate BETWEEN ? AND ? AND m.movementType='261' GROUP BY m.partNumber ORDER BY outgoing_qty DESC`, [start, end]);
  const total = rows.reduce((a: number, r: any) => a + Number(r.outgoing_qty || 0), 0);
  const enriched = rows.map((r: any) => ({ ...r, ratio_fsn: Number(r.free_stock_now || 0) / (Number(r.outgoing_qty || 0) || 1), percent: total ? (Number(r.outgoing_qty) / total) * 100 : 0 }));
  const fastest = [...enriched].sort((a, b) => a.ratio_fsn - b.ratio_fsn).slice(0, 10);
  const slowest = [...enriched].sort((a, b) => b.ratio_fsn - a.ratio_fsn).slice(0, 10);
  return NextResponse.json({ chart: mode === 'slowest' ? slowest : fastest, fastest, slowest });
}
