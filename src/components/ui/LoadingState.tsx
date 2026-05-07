import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface LoadingStateProps extends HTMLAttributes<HTMLDivElement> {
  message?: string;
}

export const LoadingState = forwardRef<HTMLDivElement, LoadingStateProps>(
  ({ className, message = 'Memuat...', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'min-h-screen flex items-center justify-center',
          className
        )}
        {...props}
      >
        <p className="text-slate-500">{message}</p>
      </div>
    );
  }
);

LoadingState.displayName = 'LoadingState';

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('animate-spin h-5 w-5 text-slate-400', className)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}