import clsx from 'clsx';

export function Badge({ text, tone = 'neutral' }: { text: string; tone?: 'neutral' | 'success' | 'danger' }) {
  const toneClass = tone === 'success' ? 'bg-green-100 text-green-700' : tone === 'danger' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700';
  return <span className={clsx('rounded-full px-2 py-1 text-xs', toneClass)}>{text}</span>;
}
