import { ReactNode } from 'react';

export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <table className="w-full border-collapse overflow-hidden rounded-xl border border-border bg-white text-sm">
      <thead className="bg-slate-50">
        <tr>{head.map((h) => <th key={h} className="border-b border-border px-3 py-2 text-left font-medium">{h}</th>)}</tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}
