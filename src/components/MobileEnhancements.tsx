import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TouchTargetProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// Enhanced touch targets for mobile
export const TouchTarget = ({ children, className, size = 'md' }: TouchTargetProps) => {
  const sizeClasses = {
    sm: 'min-h-[40px] min-w-[40px]',
    md: 'min-h-[44px] min-w-[44px]',
    lg: 'min-h-[48px] min-w-[48px]'
  };

  return (
    <div className={cn(
      'flex items-center justify-center',
      'touch-manipulation',
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  );
};

// Mobile navigation enhancements hook
export const useMobileEnhancements = () => {
  useEffect(() => {
    // Add haptic feedback for touch interactions
    const addHapticFeedback = (event: Event) => {
      if ('vibrate' in navigator) {
        navigator.vibrate(10); // Light haptic feedback
      }
    };

    // Apply to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, [role="button"]');
    interactiveElements.forEach(element => {
      element.addEventListener('touchstart', addHapticFeedback, { passive: true });
    });

    // Improve scroll performance
    document.body.style.overscrollBehavior = 'contain';

    return () => {
      interactiveElements.forEach(element => {
        element.removeEventListener('touchstart', addHapticFeedback);
      });
    };
  }, []);
};

// Accessibility improvements
export const AccessibilityEnhancer = () => {
  useEffect(() => {
    // Ensure focus visibility
    const style = document.createElement('style');
    style.textContent = `
      *:focus-visible {
        outline: 2px solid hsl(var(--primary)) !important;
        outline-offset: 2px !important;
        border-radius: 4px !important;
      }
      
      /* Enhanced contrast for better readability */
      @media (prefers-contrast: high) {
        .text-muted-foreground {
          color: hsl(var(--foreground)) !important;
        }
      }
      
      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return null;
};