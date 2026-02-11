'use client';

import { useQuery } from '@tanstack/react-query';
import { http } from '@/lib/http/client';

export function useUsers(page: number, q: string) {
  return useQuery({ queryKey: ['users', page, q], queryFn: () => http<{ data: any[]; total: number }>(`/api/users?page=${page}&q=${encodeURIComponent(q)}`) });
}
