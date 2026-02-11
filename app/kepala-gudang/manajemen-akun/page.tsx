'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { Select } from '@/components/ui/Select';
import { Table } from '@/components/ui/Table';
import { useUsers } from '@/features/accountManagement/hooks/useUsers';
import { http } from '@/lib/http/client';

export default function ManajemenAkunPage() {
  const [page, setPage] = useState(1); const [q, setQ] = useState(''); const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'admin_gudang' });
  const { data, refetch } = useUsers(page, q);
  return <div className='space-y-3'><div className='card flex gap-2'><Input placeholder='Cari pengguna' value={q} onChange={(e) => setQ(e.target.value)} /><Button onClick={() => setOpen(true)}>Create</Button></div>
    <Table head={['Nama','Email','Role','createdOn','Aksi']}>{(data?.data || []).map((u: any) => <tr key={u.userId}><td className='px-3 py-2'>{u.username}</td><td>{u.email}</td><td>{u.role}</td><td>{String(u.createdOn || '')}</td><td className='space-x-2'><Button className='bg-red-600' onClick={async () => { if (confirm('Yakin untuk menghapus?')) { await http(`/api/users/${u.userId}`, { method: 'DELETE' }); refetch(); } }}>Delete</Button></td></tr>)}</Table>
    <Pagination page={page} total={data?.total || 1} onPage={setPage} /><Modal open={open} onClose={() => setOpen(false)}><div className='space-y-2'><h2>Tambah user</h2><Input placeholder='Username' onChange={(e) => setForm({ ...form, username: e.target.value })}/><Input placeholder='Email' onChange={(e) => setForm({ ...form, email: e.target.value })}/><Input type='password' placeholder='Password' onChange={(e) => setForm({ ...form, password: e.target.value })}/><Select onChange={(e) => setForm({ ...form, role: e.target.value })}><option value='admin_gudang'>admin_gudang</option><option value='kepala_gudang'>kepala_gudang</option></Select><Button onClick={async () => { await http('/api/users', { method: 'POST', body: JSON.stringify(form) }); setOpen(false); refetch(); }}>Simpan</Button></div></Modal>
  </div>;
}
