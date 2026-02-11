'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const menus = [
  { href: '/kepala-gudang/dashboard-analisis', label: 'Dashboard Analisis' },
  { href: '/kepala-gudang/manajemen-akun', label: 'Manajemen Akun' },
  { href: '/kepala-gudang/katalog-barang', label: 'Katalog Barang' },
  { href: '/kepala-gudang/history-belanja', label: 'History Barang' }
];

export function ManagerLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 h-screen w-64 border-r border-border bg-white p-4">
        <h1 className="mb-6 text-lg font-semibold text-primary">Warehouse</h1>
        <nav className="space-y-2">{menus.map((m) => (
          <Link key={m.href} href={m.href} className={clsx('block rounded-lg px-3 py-2 text-sm', pathname === m.href ? 'bg-blue-50 text-primary' : 'hover:bg-slate-50')}>
            {m.label}
          </Link>
        ))}</nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
