import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type FeedbackState = 'idle' | 'loading' | 'success' | 'error';
type LoadingVariant = 'inline' | 'overlay' | 'skeleton' | 'button';

interface UnifiedFeedbackProps {
  state: FeedbackState;
  loadingVariant?: LoadingVariant;
  errorMessage?: string;
  successMessage?: string;
  onRetry?: () => void;
  children: ReactNode;
  className?: string;
}

/**
 * UnifiedFeedback - Standardized feedback states for the application
 *
 * Use this component to wrap content that has loading, success, or error states.
 * It provides consistent feedback patterns across the application.
 *
 * @example
 * <UnifiedFeedback
 *   state={isLoading ? 'loading' : error ? 'error' : 'idle'}
 *   loadingVariant="skeleton"
 *   errorMessage={error?.message}
 *   onRetry={() => refetch()}
 * >
 *   <YourContent />
 * </UnifiedFeedback>
 */
export function UnifiedFeedback({
  state,
  loadingVariant = 'inline',
  errorMessage = 'Jokin meni pieleen. Yritä uudelleen.',
  successMessage = 'Toiminto onnistui!',
  onRetry,
  children,
  className
}: UnifiedFeedbackProps) {

  // Loading states
  if (state === 'loading') {
    switch (loadingVariant) {
      case 'skeleton':
        return (
          <div className={cn('space-y-4', className)}>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        );

      case 'overlay':
        return (
          <div className={cn('relative', className)}>
            {children}
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="h-8 w-8 text-terracotta-500" />
              </motion.div>
            </div>
          </div>
        );

      case 'button':
        return (
          <Button disabled className={cn('opacity-70', className)}>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Ladataan...
          </Button>
        );

      case 'inline':
      default:
        return (
          <div className={cn('flex items-center justify-center py-8', className)}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className="h-8 w-8 text-terracotta-500" />
            </motion.div>
            <span className="ml-3 text-stone-600">Ladataan...</span>
          </div>
        );
    }
  }

  // Error state
  if (state === 'error') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('text-center p-6 rounded-lg bg-red-50 border border-red-200', className)}
      >
        <AlertCircle className="mx-auto h-10 w-10 text-red-500 mb-3" />
        <p className="text-red-700 font-medium mb-2">Virhe</p>
        <p className="text-red-600 text-sm mb-4">{errorMessage}</p>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Yritä uudelleen
          </Button>
        )}
      </motion.div>
    );
  }

  // Success state
  if (state === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn('flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200', className)}
      >
        <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
        <span className="text-green-700 font-medium">{successMessage}</span>
      </motion.div>
    );
  }

  // Idle state - render children
  return <>{children}</>;
}

/**
 * Inline loading spinner for buttons and small elements
 */
export function InlineSpinner({ className }: { className?: string }) {
  return (
    <Loader2 className={cn('h-4 w-4 animate-spin', className)} />
  );
}

/**
 * Full-page loading state
 */
export function PageLoading({ message = 'Ladataan...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 className="h-12 w-12 text-terracotta-500" />
      </motion.div>
      <p className="mt-4 text-stone-600">{message}</p>
    </div>
  );
}

export default UnifiedFeedback;
