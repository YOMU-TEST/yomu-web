import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { getTierColor, formatTierBadge } from '@/lib/formatters/tier';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'tier' | 'status';
  tier?: string;
  status?: 'active' | 'inactive' | 'completed' | 'pending';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', tier, status, children, ...props }, ref) => {
    const baseStyles = 'px-2 py-1 rounded text-xs font-medium';

    const variantStyles = {
      default: 'bg-slate-100 text-slate-700',
      tier: getTierColor(tier || 'bronze').bg + ' ' + getTierColor(tier || 'bronze').text,
      status: {
        active: 'bg-green-100 text-green-700',
        inactive: 'bg-slate-100 text-slate-500',
        completed: 'bg-green-100 text-green-700',
        pending: 'bg-amber-100 text-amber-700',
      }[status || 'inactive'],
    };

    const displayText = variant === 'tier' && tier ? formatTierBadge(tier) : children;

    return (
      <span ref={ref} className={cn(baseStyles, variantStyles[variant], className)} {...props}>
        {displayText}
      </span>
    );
  }
);

Badge.displayName = 'Badge';