import { Input } from '@/components/ui/Input';

export function DateRangePicker({ start, end, onStart, onEnd }: {
  start?: string; end?: string; onStart: (v: string) => void; onEnd: (v: string) => void;
}) {
  return (
    <div className="flex gap-2">
      <Input type="date" value={start || ''} onChange={(e) => onStart(e.target.value)} />
      <Input type="date" value={end || ''} onChange={(e) => onEnd(e.target.value)} />
    </div>
  );
}
