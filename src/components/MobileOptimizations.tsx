import React from 'react';
import { cn } from '@/lib/utils';

interface MobileOptimizationsProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Mobile Optimizations wrapper component
 * Handles virtual keyboard, touch gestures, and mobile-specific optimizations
 */
export function MobileOptimizations({ children, className }: MobileOptimizationsProps) {
  // Keep component lightweight; globals live in index.css
  return (
    <div 
      className={cn(
        'min-h-screen w-full max-w-full overflow-x-hidden',
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Hook to detect if user is on a mobile device
 */
export function useIsMobileDevice() {
  const [isMobile, setIsMobile] = React.useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent;
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      setIsMobile(isMobileDevice || (isTouchDevice && window.innerWidth < 768));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

/**
 * Enhanced mobile-friendly button component
 */
interface MobileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  touchFeedback?: boolean;
}

export function MobileButton({ 
  children, 
  className,
  variant = 'primary',
  size = 'md',
  touchFeedback = true,
  ...props 
}: MobileButtonProps) {
  const [isPressed, setIsPressed] = React.useState(false);

  const handleTouchStart = () => {
    if (touchFeedback) {
      setIsPressed(true);
    }
  };

  const handleTouchEnd = () => {
    if (touchFeedback) {
      setIsPressed(false);
    }
  };

  return (
    <button
      className={cn(
        // Base mobile-friendly styles
        'relative min-h-[44px] min-w-[44px] touch-manipulation',
        'transition-all duration-150 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        
        // Variant styles
        variant === 'primary' && 'bg-primary text-primary-foreground hover:bg-primary/90',
        variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        variant === 'outline' && 'border border-border bg-background hover:bg-accent hover:text-accent-foreground',
        
        // Size styles
        size === 'sm' && 'px-3 py-2 text-sm rounded-md',
        size === 'md' && 'px-4 py-2 text-base rounded-lg',
        size === 'lg' && 'px-6 py-3 text-lg rounded-xl',
        
        // Touch feedback
        isPressed && touchFeedback && 'scale-95 brightness-95',
        
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseLeave={() => setIsPressed(false)}
      {...props}
    >
      {children}
      
      {/* Ripple effect overlay */}
      {touchFeedback && (
        <span 
          className={cn(
            'absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-150',
            'bg-white/20 pointer-events-none',
            isPressed && 'opacity-100'
          )}
        />
      )}
    </button>
  );
}