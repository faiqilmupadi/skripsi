export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-white px-6 py-4 text-lg font-semibold text-primary">Admin Gudang</header>
      <main className="p-6">{children}</main>
    </div>
  );
}
