import React, { useEffect } from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { trackEmptyStateViewed, trackEmptyStateActionClicked } from '@/utils/analytics';

export interface EmptyStateProps {
  /** Icon to display */
  icon: LucideIcon;
  /** Main heading text */
  title: string;
  /** Supporting description text */
  description: string;
  /** Optional CTA button text */
  actionLabel?: string;
  /** Optional CTA button action */
  onAction?: () => void;
  /** Optional secondary action label */
  secondaryActionLabel?: string;
  /** Optional secondary action */
  onSecondaryAction?: () => void;
  /** Visual variant */
  variant?: 'default' | 'info' | 'warning' | 'success';
  /** Custom className for container */
  className?: string;
}

const variantStyles = {
  default: {
    iconBg: 'bg-neutral-100',
    iconColor: 'text-neutral-600',
  },
  info: {
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  warning: {
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  success: {
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
  },
};

/**
 * EmptyState component for displaying empty states with consistent UX
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={Scale}
 *   title="Ei painomittauksia"
 *   description="Aloita seuraamalla pentusi painoa ensimmäisen kerran."
 *   actionLabel="Lisää ensimmäinen paino"
 *   onAction={() => openWeightForm()}
 * />
 * ```
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  variant = 'default',
  className,
}) => {
  const styles = variantStyles[variant];

  // Track empty state view on mount
  useEffect(() => {
    trackEmptyStateViewed('EmptyState', title);
  }, [title]);

  const handleActionClick = () => {
    if (onAction) {
      trackEmptyStateActionClicked('EmptyState', actionLabel || 'primary');
      onAction();
    }
  };

  const handleSecondaryActionClick = () => {
    if (onSecondaryAction) {
      trackEmptyStateActionClicked('EmptyState', secondaryActionLabel || 'secondary');
      onSecondaryAction();
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center px-6 py-12 mobile-container-safe',
        className
      )}
      role="status"
      aria-live="polite"
    >
      {/* Icon container */}
      <div
        className={cn(
          'mb-6 flex h-16 w-16 items-center justify-center rounded-full',
          styles.iconBg
        )}
        aria-hidden="true"
      >
        <Icon className={cn('h-8 w-8', styles.iconColor)} />
      </div>

      {/* Title */}
      <h3 className="mb-2 text-xl font-semibold text-neutral-900 md:text-2xl">
        {title}
      </h3>

      {/* Description */}
      <p className="mb-6 max-w-md text-base text-neutral-600 mobile-text-wrap">
        {description}
      </p>

      {/* Action buttons */}
      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 mobile-button-wrapper">
          {actionLabel && onAction && (
            <Button
              onClick={handleActionClick}
              size="lg"
              className="touch-target"
              aria-label={actionLabel}
            >
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button
              onClick={handleSecondaryActionClick}
              variant="outline"
              size="lg"
              className="touch-target"
              aria-label={secondaryActionLabel}
            >
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

EmptyState.displayName = 'EmptyState';
