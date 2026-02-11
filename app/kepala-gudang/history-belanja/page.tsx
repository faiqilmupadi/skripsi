'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/ui/Pagination';
import { Select } from '@/components/ui/Select';
import { Table } from '@/components/ui/Table';
import { useHistory } from '@/features/purchaseHistory/hooks/useHistory';

export default function HistoryBelanjaPage() {
  const [page, setPage] = useState(1); const [q, setQ] = useState(''); const [rangePreset, setPreset] = useState('7d'); const [start, setStart] = useState(''); const [end, setEnd] = useState('');
  const { data } = useHistory(page, q, rangePreset, start || undefined, end || undefined);
  const qs = new URLSearchParams({ q, rangePreset, ...(start ? { start } : {}), ...(end ? { end } : {}) }).toString();
  return <div className='space-y-3'><div className='card flex flex-wrap gap-2'><Select value={rangePreset} onChange={(e) => setPreset(e.target.value)}><option value='24h'>24 jam</option><option value='7d'>7 hari</option><option value='1m'>1 bulan</option><option value='custom'>Custom</option></Select>{rangePreset==='custom' && <DateRangePicker start={start} end={end} onStart={setStart} onEnd={setEnd}/>}<Input placeholder='search' value={q} onChange={(e) => setQ(e.target.value)} /><a href={`/api/export/history.xlsx?${qs}`}><Button>Export XLSX</Button></a></div>
    <Table head={['Nomor Part','Cabang','Material','Nomor PO','Nomor Order','Jenis Transaksi','Jumlah','Nama']}>{(data?.data || []).map((r: any, idx: number) => <tr key={idx}><td className='px-3 py-2'>{r.partNumber}</td><td>{r.plant}</td><td>{r.materialDescription}</td><td>{r.purchaseOrder}</td><td>{r.orderNo}</td><td>{r.movementType}</td><td>{r.quantity}</td><td>{r.userName}</td></tr>)}</Table>
    <Pagination page={page} total={data?.total || 1} onPage={setPage} /></div>;
}
