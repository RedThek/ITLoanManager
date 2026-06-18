import * as React from 'react';
import { cn } from '@/lib/utils';

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