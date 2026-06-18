import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    // Base styles
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold ' +
    'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ' +
    'focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
    {
        variants: {
            variant: {
                default:
                    'bg-[var(--accent)] text-white hover:bg-[#9428e8] shadow-sm active:scale-[.98]',
                destructive:
                    'bg-red-500 text-white hover:bg-red-600 shadow-sm active:scale-[.98]',
                outline:
                    'border border-[var(--border)] bg-transparent text-[var(--text-h)] ' +
                    'hover:bg-[var(--accent-bg)] hover:border-[var(--accent)]',
                ghost:
                    'bg-transparent text-[var(--text)] hover:bg-[var(--accent-bg)] hover:text-[var(--accent)]',
                link:
                    'text-[var(--accent)] underline-offset-4 hover:underline',
                success:
                    'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm active:scale-[.98]',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm:      'h-8  px-3 text-xs',
                lg:      'h-12 px-6 text-base',
                icon:    'h-10 w-10',
            },
        },
        defaultVariants: { variant: 'default', size: 'default' },
    }
);

const Button = React.forwardRef(function Button(
    { className, variant, size, asChild = false, ...props },
    ref
) {
    const Comp = asChild ? Slot : 'button';
    return (
        <Comp
            ref={ref}
            className={cn(buttonVariants({ variant, size }), className)}
            {...props}
        />
    );
});
Button.displayName = 'Button';

export { Button, buttonVariants };