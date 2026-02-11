import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx('rounded-lg bg-primary px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-60', className)}
      {...props}
    />
  );
}
