import { NextResponse } from 'next/server';
import { query } from '@/lib/db/db';
import { requireRole } from '@/lib/http/apiAuth';
import { itemSchema } from '@/features/itemCatalog/schemas/itemSchema';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = requireRole(['kepala_gudang']); if ('error' in auth) return auth.error;
  const parsed = itemSchema.omit({ partNumber: true }).safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ message: 'Invalid body' }, { status: 400 });
  await query('UPDATE material_master SET materialDescription=?, baseUnitOfMeasure=?, materialGroup=? WHERE partNumber=?', [parsed.data.materialDescription, parsed.data.baseUnitOfMeasure, parsed.data.materialGroup, params.id]);
  return NextResponse.json({ ok: true });
}
