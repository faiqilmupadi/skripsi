'use client';

import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http/client';

export function useDashboard(rangePreset: string, start?: string, end?: string, mode = 'fastest') {
  const p = new URLSearchParams({ rangePreset, ...(start ? { start } : {}), ...(end ? { end } : {}) });
  return {
    perf: useQuery({ queryKey: ['perf', p.toString()], queryFn: () => http<any[]>(`/api/dashboard/admin-performance?${p}`) }),
    fsn: useQuery({ queryKey: ['fsn', p.toString(), mode], queryFn: () => http<any>(`/api/dashboard/item-fsn?${p}&mode=${mode}`) }),
    trend: useQuery({ queryKey: ['trend', p.toString()], queryFn: () => http<any>(`/api/dashboard/asset-trend?${p}`) })
  };
}
