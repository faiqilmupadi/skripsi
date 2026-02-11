'use client';

import { useState } from 'react';
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Select } from '@/components/ui/Select';
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { Table } from '@/components/ui/Table';
import { useDashboard } from '@/features/managerDashboard/hooks/useDashboard';

export default function DashboardAnalisisPage() {
  const [rangePreset, setRangePreset] = useState('7d'); const [start, setStart] = useState(''); const [end, setEnd] = useState(''); const [mode, setMode] = useState('fastest');
  const { perf, fsn, trend } = useDashboard(rangePreset, start || undefined, end || undefined, mode);
  return <div className="space-y-4">
    <div className="card flex items-center gap-2"><Select value={rangePreset} onChange={(e) => setRangePreset(e.target.value)}><option value='24h'>24 jam</option><option value='7d'>7 hari</option><option value='1m'>1 bulan</option><option value='custom'>custom</option></Select>{rangePreset === 'custom' && <DateRangePicker start={start} end={end} onStart={setStart} onEnd={setEnd} />}<Select value={mode} onChange={(e) => setMode(e.target.value)}><option value='fastest'>Fastest 10</option><option value='slowest'>Slowest 10</option></Select></div>
    <div className="grid gap-4 lg:grid-cols-2"><div className="card h-72"><h3>Kinerja Admin</h3><ResponsiveContainer width="100%" height="90%"><BarChart data={perf.data || []}><XAxis dataKey="adminName"/><YAxis/><Tooltip/><Bar dataKey="ratio_kinerja" fill="#1D4ED8"/></BarChart></ResponsiveContainer></div><div className="card h-72"><h3>FSN Barang</h3><ResponsiveContainer width="100%" height="90%"><BarChart data={fsn.data?.chart || []}><XAxis dataKey="partNumber"/><YAxis/><Tooltip/><Bar dataKey="percent" fill="#ef4444"/></BarChart></ResponsiveContainer></div></div>
    <div className="card"><Table head={['Admin', 'Kontribusi', 'Total', 'Rasio %']}>{(perf.data || []).map((r: any) => <tr key={r.adminName}><td className='px-3 py-2'>{r.adminName}</td><td>{r.kontribusi_admin}</td><td>{r.total_transaksi}</td><td>{(r.ratio_kinerja * 100).toFixed(2)}</td></tr>)}</Table></div>
    <div className="card h-72"><h3>Nilai Gudang</h3><ResponsiveContainer width="100%" height="90%"><LineChart data={trend.data?.series || []}><XAxis dataKey="date"/><YAxis/><Tooltip/><Line dataKey="sumAmt" stroke="#1D4ED8"/></LineChart></ResponsiveContainer></div>
  </div>;
}
