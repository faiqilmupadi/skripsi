'use client';

import { useMutation } from '@tanstack/react-query';
import { http } from '@/lib/http/client';

export function useLogin() {
  return useMutation({
    mutationFn: (payload: { username: string; password: string }) => http<{ redirectTo: string }>('/api/auth/login', {
      method: 'POST', body: JSON.stringify(payload)
    })
  });
}
