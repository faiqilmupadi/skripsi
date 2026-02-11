'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { Select } from '@/components/ui/Select';
import { Table } from '@/components/ui/Table';
import { useStockTable } from '@/features/stockBarang/hooks/useStockTable';
import { http } from '@/lib/http/client';

export default function StokBarangPage() {
  const [q, setQ] = useState(''); const [page, setPage] = useState(1); const [rangePreset, setPreset] = useState('7d'); const [start, setStart] = useState(''); const [end, setEnd] = useState('');
  const [open, setOpen] = useState(false); const [action, setAction] = useState<'withdraw'|'return'|'restock-request'>('withdraw'); const [selected, setSelected] = useState<any>(null); const [qty, setQty] = useState(1);
  const { data, refetch } = useStockTable(page, q);
  return <div className='space-y-3'><div className='card flex flex-wrap gap-2'><Select value={rangePreset} onChange={(e) => setPreset(e.target.value)}><option value='24h'>24 jam</option><option value='7d'>7 hari</option><option value='1m'>1 bulan</option><option value='custom'>Custom</option></Select>{rangePreset==='custom' && <DateRangePicker start={start} end={end} onStart={setStart} onEnd={setEnd}/>}<Input placeholder='search' value={q} onChange={(e) => setQ(e.target.value)} /></div>
  <Table head={['Nomor Part','Cabang','Material','Stok siap di gudang','Stok di stok cacat','Stok di ROP','Aksi']}>{(data?.data || []).map((r: any) => <tr key={`${r.partNumber}${r.plant}`}><td className='px-3 py-2'>{r.partNumber}</td><td>{r.plant}</td><td>{r.materialDescription}</td><td>{r.freeStock}</td><td>{r.blocked}</td><td>{r.reorderPoint}</td><td className='space-x-1'><Button onClick={() => { setAction('restock-request'); setSelected(r); setOpen(true); }}>↻</Button><Button className='bg-emerald-600' onClick={() => { setAction('return'); setSelected(r); setOpen(true); }}>⌂</Button><Button className='bg-amber-500' onClick={() => { setAction('withdraw'); setSelected(r); setOpen(true); }}>✋</Button></td></tr>)}</Table>
  <Pagination page={page} total={data?.total || 1} onPage={setPage} />
  <Modal open={open} onClose={() => setOpen(false)}><div className='space-y-2'><h2>Aksi stok: {action}</h2><Input type='number' value={qty} onChange={(e) => setQty(Number(e.target.value))}/><Button onClick={async () => { await http(`/api/stock/${action}`, { method: 'POST', body: JSON.stringify({ partNumber: selected.partNumber, plant: selected.plant, qty }) }); setOpen(false); refetch(); }}>Submit</Button></div></Modal>
  </div>;
}
