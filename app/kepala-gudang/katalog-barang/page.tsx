'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import { Pagination } from '@/components/ui/Pagination';
import { useItems } from '@/features/itemCatalog/hooks/useItems';
import { http } from '@/lib/http/client';

export default function KatalogBarangPage() {
  const [q, setQ] = useState(''); const [page, setPage] = useState(1); const { data, refetch } = useItems(page, q);
  return <div className='space-y-3'><div className='card flex gap-2'><Input placeholder='Cari material' value={q} onChange={(e) => setQ(e.target.value)} /></div>
    <Table head={['Nomor Part','Material','Satuan','Dibuat Oleh','Aksi']}>{(data?.data || []).map((i: any) => <tr key={i.partNumber}><td className='px-3 py-2'>{i.partNumber}</td><td>{i.materialDescription}</td><td>{i.baseUnitOfMeasure}</td><td>{i.createdBy}</td><td><Button className='bg-red-600' onClick={async () => { if(confirm('Yakin untuk menghapus?')) { await http(`/api/items/${i.partNumber}/active`, { method: 'PATCH', body: JSON.stringify({ active: 0 }) }); refetch(); }}}>Delete</Button></td></tr>)}</Table>
    <Pagination page={page} total={data?.total || 1} onPage={setPage} /></div>;
}
