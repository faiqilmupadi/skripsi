import { ManagerLayoutShell } from '@/components/layout/ManagerLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ManagerLayoutShell>{children}</ManagerLayoutShell>;
}
