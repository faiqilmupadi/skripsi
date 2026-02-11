import { Button } from '@/components/ui/Button';

interface Props { page: number; total: number; onPage: (p: number) => void; }

export function Pagination({ page, total, onPage }: Props) {
  return (
    <div className="mt-4 flex items-center gap-2">
      <Button disabled={page <= 1} onClick={() => onPage(page - 1)}>Prev</Button>
      <span className="text-sm">Page {page} / {total}</span>
      <Button disabled={page >= total} onClick={() => onPage(page + 1)}>Next</Button>
    </div>
  );
}
