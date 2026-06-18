import * as React from 'react';
import { cn } from '@/lib/utils';

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