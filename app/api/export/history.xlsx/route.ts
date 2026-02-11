import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { query } from '@/lib/db/db';
import { buildRange } from '@/lib/db/range';
import { requireRole } from '@/lib/http/apiAuth';

export async function GET(req: Request) {
  const auth = requireRole(['kepala_gudang']); if ('error' in auth) return auth.error;
  const url = new URL(req.url); const q = url.searchParams.get('q') || ''; const { start, end } = buildRange(url.searchParams.get('rangePreset') || undefined, url.searchParams.get('start') || undefined, url.searchParams.get('end') || undefined);
  const s = `%${q}%`;
  const rows = await query('SELECT partNumber, plant, materialDescription, purchaseOrder, orderNo, movementType, quantity, userName FROM material_movement WHERE postingDate BETWEEN ? AND ? AND (partNumber LIKE ? OR materialDescription LIKE ? OR userName LIKE ? OR orderNo LIKE ? OR purchaseOrder LIKE ?)', [start, end, s, s, s, s, s]);
  const wb = new ExcelJS.Workbook(); const ws = wb.addWorksheet('History');
  ws.addRow(['partNumber', 'plant', 'materialDescription', 'purchaseOrder', 'orderNo', 'movementType', 'quantity', 'userName']);
  rows.forEach((r: any) => ws.addRow(Object.values(r)));
  const buffer = await wb.xlsx.writeBuffer();
  return new NextResponse(buffer, { headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Content-Disposition': 'attachment; filename="history.xlsx"' } });
}
