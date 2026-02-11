import { NextResponse } from 'next/server';
import { query } from '@/lib/db/db';
import { getPage } from '@/lib/http/pagination';
import { requireRole } from '@/lib/http/apiAuth';

export async function GET(req: Request) {
  const auth = requireRole(['admin_gudang', 'kepala_gudang']); if ('error' in auth) return auth.error;
  const url = new URL(req.url); const { page, limit, offset } = getPage(url.searchParams); const q = url.searchParams.get('q') || '';
  const s = `%${q}%`;
  const data = await query(`SELECT s.partNumber, s.plant, m.materialDescription, s.freeStock, s.blocked, p.reorderPoint
    FROM material_stock s
    LEFT JOIN material_master m ON m.partNumber=s.partNumber
    LEFT JOIN material_plant_data p ON p.partNumber=s.partNumber AND p.plant=s.plant
    WHERE s.partNumber LIKE ? OR m.materialDescription LIKE ? LIMIT 10 OFFSET ?`, [s, s, offset]);
  const total = await query<{ total: number }>(`SELECT COUNT(*) total FROM material_stock s LEFT JOIN material_master m ON m.partNumber=s.partNumber WHERE s.partNumber LIKE ? OR m.materialDescription LIKE ?`, [s, s]);
  return NextResponse.json({ data, page, total: Math.ceil(total[0].total / limit) || 1 });
}
