import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
    {
        variants: {
            variant: {
                default:     'bg-[var(--accent-bg)] text-[var(--accent)] border border-[var(--accent-border)]',
                available:   'bg-emerald-50 text-emerald-700 border border-emerald-200',
                borrowed:    'bg-amber-50 text-amber-700 border border-amber-200',
                maintenance: 'bg-red-50 text-red-700 border border-red-200',
                secondary:   'bg-[var(--code-bg)] text-[var(--text)] border border-[var(--border)]',
            },
        },
        defaultVariants: { variant: 'default' },
    }
);

function Badge({ className, variant, ...props }) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };