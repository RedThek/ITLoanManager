// ─────────────────────────────────────────────────────────────
// client/src/components/ui/button.jsx
// ─────────────────────────────────────────────────────────────
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


// ─────────────────────────────────────────────────────────────
// client/src/components/ui/input.jsx
// ─────────────────────────────────────────────────────────────
const Input = React.forwardRef(function Input({ className, type, ...props }, ref) {
    return (
        <input
            type={type}
            ref={ref}
            className={cn(
                'flex h-10 w-full rounded-md border border-[var(--border)] ' +
                'bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text-h)] ' +
                'placeholder:text-[var(--text)] ' +
                'focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent ' +
                'transition-all duration-200 ' +
                'disabled:cursor-not-allowed disabled:opacity-50',
                className
            )}
            {...props}
        />
    );
});
Input.displayName = 'Input';

export { Input };


// ─────────────────────────────────────────────────────────────
// client/src/components/ui/label.jsx
// ─────────────────────────────────────────────────────────────
import * as LabelPrimitive from '@radix-ui/react-label';

const Label = React.forwardRef(function Label({ className, ...props }, ref) {
    return (
        <LabelPrimitive.Root
            ref={ref}
            className={cn(
                'text-sm font-medium leading-none text-[var(--text-h)] ' +
                'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                className
            )}
            {...props}
        />
    );
});
Label.displayName = 'Label';

export { Label };


// ─────────────────────────────────────────────────────────────
// client/src/components/ui/card.jsx
// ─────────────────────────────────────────────────────────────
const Card = React.forwardRef(function Card({ className, ...props }, ref) {
    return (
        <div
            ref={ref}
            className={cn(
                'rounded-xl border border-[var(--border)] bg-[var(--bg)] ' +
                'shadow-card text-[var(--text-h)]',
                className
            )}
            {...props}
        />
    );
});
Card.displayName = 'Card';

const CardHeader = React.forwardRef(function CardHeader({ className, ...props }, ref) {
    return (
        <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
    );
});
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(function CardTitle({ className, ...props }, ref) {
    return (
        <h3
            ref={ref}
            className={cn('text-xl font-semibold leading-tight tracking-tight text-[var(--text-h)]', className)}
            {...props}
        />
    );
});
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef(function CardDescription({ className, ...props }, ref) {
    return (
        <p ref={ref} className={cn('text-sm text-[var(--text)]', className)} {...props} />
    );
});
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef(function CardContent({ className, ...props }, ref) {
    return <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />;
});
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef(function CardFooter({ className, ...props }, ref) {
    return (
        <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
    );
});
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };


// ─────────────────────────────────────────────────────────────
// client/src/components/ui/badge.jsx
// ─────────────────────────────────────────────────────────────
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


// ─────────────────────────────────────────────────────────────
// client/src/components/ui/alert.jsx
// ─────────────────────────────────────────────────────────────
const Alert = React.forwardRef(function Alert({ className, variant = 'default', ...props }, ref) {
    return (
        <div
            ref={ref}
            role="alert"
            className={cn(
                'relative w-full rounded-lg border p-4 text-sm',
                variant === 'destructive'
                    ? 'border-red-200 bg-red-50 text-red-800'
                    : 'border-[var(--border)] bg-[var(--accent-bg)] text-[var(--text-h)]',
                className
            )}
            {...props}
        />
    );
});
Alert.displayName = 'Alert';

const AlertDescription = React.forwardRef(function AlertDescription({ className, ...props }, ref) {
    return <div ref={ref} className={cn('text-sm leading-relaxed', className)} {...props} />;
});
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertDescription };