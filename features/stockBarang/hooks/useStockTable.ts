'use client';

import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http/client';

export function useStockTable(page: number, q: string) {
  return useQuery({ queryKey: ['stock', page, q], queryFn: () => http<{ data: any[]; total: number }>(`/api/stock?page=${page}&q=${encodeURIComponent(q)}`) });
}
