import React, { useEffect } from 'react';
import { useVirtualKeyboard } from '@/hooks/useVirtualKeyboard';
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
  const { isKeyboardOpen, keyboardHeight } = useVirtualKeyboard();

  useEffect(() => {
    // Enhanced mobile optimization CSS injection
    const style = document.createElement('style');
    style.id = 'mobile-optimization-styles';
    style.textContent = `
      /* Critical: Prevent horizontal scrolling */
      html, body {
        overflow-x: hidden !important;
        max-width: 100vw !important;
        position: relative !important;
      }
      
      /* Enhanced text wrapping */
      h1, h2, h3, h4, h5, h6, p, span, div {
        word-wrap: break-word !important;
        word-break: break-word !important;
        hyphens: auto !important;
        overflow-wrap: break-word !important;
      }
      
      /* Prevent zoom on input focus (iOS) */
      input, textarea, select {
        font-size: 16px !important;
        transform-origin: left top !important;
      }
      
      /* Better touch targets */
      button, a, input, select, textarea {
        min-height: 44px !important;
        min-width: 44px !important;
      }
      
      /* Mobile layout fixes */
      @media (max-width: 768px) {
        .lg\\:grid-cols-5 {
          grid-template-columns: 1fr !important;
        }
        
        .grid {
          grid-template-columns: 1fr !important;
        }
        
        .flex {
          flex-wrap: wrap !important;
        }
        
        img {
          max-width: 100% !important;
          height: auto !important;
        }
        
        .container {
          padding-left: 1rem !important;
          padding-right: 1rem !important;
        }
      }
    `;
    
    // Only add if not already present
    if (!document.getElementById('mobile-optimization-styles')) {
      document.head.appendChild(style);
    }

    // Prevent double-tap zoom on iOS
    let lastTouchEnd = 0;
    const handleTouchEnd = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Prevent pinch zoom
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div 
      className={cn(
        'mobile-optimized-container min-h-screen w-full max-w-full overflow-x-hidden prevent-overflow',
        isKeyboardOpen && 'keyboard-open',
        className
      )}
      style={{
        paddingBottom: isKeyboardOpen ? `${keyboardHeight}px` : undefined,
        transition: 'padding-bottom 0.3s ease-in-out'
      }}
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