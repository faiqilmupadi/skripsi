'use client';

import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http/client';

export function useItems(page: number, q: string) {
  return useQuery({ queryKey: ['items', page, q], queryFn: () => http<{ data: any[]; total: number }>(`/api/items?page=${page}&q=${encodeURIComponent(q)}&active=1`) });
}
