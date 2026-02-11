import { NextResponse } from 'next/server';
import { query } from '@/lib/db/db';
import { buildRange } from '@/lib/db/range';
import { requireRole } from '@/lib/http/apiAuth';

export async function GET(req: Request) {
  const auth = requireRole(['kepala_gudang']); if ('error' in auth) return auth.error;
  const url = new URL(req.url); const { start, end } = buildRange(url.searchParams.get('rangePreset') || undefined, url.searchParams.get('start') || undefined, url.searchParams.get('end') || undefined);
  const series = await query<{ date: string; sumAmt: number }>("SELECT DATE(postingDate) date, SUM(amtInLocCur) sumAmt FROM material_movement WHERE postingDate BETWEEN ? AND ? GROUP BY DATE(postingDate) ORDER BY date", [start, end]);
  const bucketed = series.reduce((acc, cur, i) => {
    const key = Math.floor(i / 5) + 1;
    acc[key] = (acc[key] || 0) + Number(cur.sumAmt || 0);
    return acc;
  }, {} as Record<number, number>);
  return NextResponse.json({ series, bucketed: Object.entries(bucketed).map(([bucket, value]) => ({ bucket, value })) });
}
