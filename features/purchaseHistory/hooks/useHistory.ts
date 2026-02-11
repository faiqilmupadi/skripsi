'use client';

import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http/client';

export function useHistory(page: number, q: string, rangePreset: string, start?: string, end?: string) {
  const qs = new URLSearchParams({ page: String(page), q, rangePreset, ...(start ? { start } : {}), ...(end ? { end } : {}) });
  return useQuery({ queryKey: ['history', page, q, rangePreset, start, end], queryFn: () => http<{ data: any[]; total: number }>(`/api/history?${qs}`) });
}
