'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useLogin } from '@/features/auth/hooks/useLogin';

export default function LoginPage() {
  const { register, handleSubmit } = useForm<{ username: string; password: string }>();
  const { mutateAsync, isPending } = useLogin();
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center">
      <form className="card w-full max-w-md space-y-3" onSubmit={handleSubmit(async (v) => router.push((await mutateAsync(v)).redirectTo))}>
        <h1 className="text-xl font-semibold">Login Gudang</h1>
        <Input placeholder="Username" {...register('username')} />
        <Input type="password" placeholder="Password" {...register('password')} />
        <Button disabled={isPending}>{isPending ? 'Loading...' : 'Masuk'}</Button>
      </form>
    </div>
  );
}
