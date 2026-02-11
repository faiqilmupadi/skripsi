import { NextResponse } from 'next/server';
import { query } from '@/lib/db/db';
import { buildRange } from '@/lib/db/range';
import { getPage } from '@/lib/http/pagination';
import { requireRole } from '@/lib/http/apiAuth';

export async function GET(req: Request) {
  const auth = requireRole(['kepala_gudang']); if ('error' in auth) return auth.error;
  const url = new URL(req.url); const { page, limit, offset } = getPage(url.searchParams); const q = url.searchParams.get('q') || '';
  const { start, end } = buildRange(url.searchParams.get('rangePreset') || undefined, url.searchParams.get('start') || undefined, url.searchParams.get('end') || undefined);
  const search = `%${q}%`;
  const base = 'FROM material_movement WHERE postingDate BETWEEN ? AND ? AND (partNumber LIKE ? OR materialDescription LIKE ? OR userName LIKE ? OR orderNo LIKE ? OR purchaseOrder LIKE ?)';
  const data = await query(`SELECT partNumber, plant, materialDescription, purchaseOrder, orderNo, movementType, quantity, userName ${base} ORDER BY postingDate DESC LIMIT 10 OFFSET ?`, [start, end, search, search, search, search, search, offset]);
  const total = await query<{ total: number }>(`SELECT COUNT(*) total ${base}`, [start, end, search, search, search, search, search]);
  return NextResponse.json({ data, page, total: Math.ceil(total[0].total / limit) || 1 });
}
