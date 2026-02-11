import { NextResponse } from 'next/server';
import { query } from '@/lib/db/db';
import { requireRole } from '@/lib/http/apiAuth';
import { getPage } from '@/lib/http/pagination';
import { itemSchema } from '@/features/itemCatalog/schemas/itemSchema';

export async function GET(req: Request) {
  const auth = requireRole(['kepala_gudang']); if ('error' in auth) return auth.error;
  const url = new URL(req.url); const { page, limit, offset } = getPage(url.searchParams);
  const q = url.searchParams.get('q') || ''; const active = url.searchParams.get('active') ?? '1';
  const data = await query('SELECT partNumber, materialDescription, baseUnitOfMeasure, createdBy, materialGroup, isActive FROM material_master WHERE (partNumber LIKE ? OR materialDescription LIKE ?) AND isActive=? LIMIT 10 OFFSET ?', [`%${q}%`, `%${q}%`, Number(active), offset]);
  const total = await query<{ total: number }>('SELECT COUNT(*) total FROM material_master WHERE (partNumber LIKE ? OR materialDescription LIKE ?) AND isActive=?', [`%${q}%`, `%${q}%`, Number(active)]);
  return NextResponse.json({ data, page, total: Math.ceil(total[0].total / limit) || 1 });
}

export async function POST(req: Request) {
  const auth = requireRole(['kepala_gudang']); if ('error' in auth) return auth.error;
  const parsed = itemSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ message: 'Invalid body' }, { status: 400 });
  const d = parsed.data;
  await query('INSERT INTO material_master(partNumber, materialDescription, baseUnitOfMeasure, createdOn, createTime, createdBy, materialGroup, isActive) VALUES(?,?,?,CURDATE(),CURTIME(),?,?,1)', [d.partNumber, d.materialDescription, d.baseUnitOfMeasure, d.createdBy, d.materialGroup]);
  return NextResponse.json({ ok: true });
}
