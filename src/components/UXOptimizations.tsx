import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

// Loading Spinner Component
export const LoadingSpinner = ({ size = 'default', text = 'Ladataan...' }: { size?: 'small' | 'default' | 'large', text?: string }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    default: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      {text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
    </div>
  );
};

// Skeleton Loading Component
export const Skeleton = ({ className = '', lines = 1 }: { className?: string, lines?: number }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded mb-2 last:mb-0"></div>
      ))}
    </div>
  );
};

// Success/Error Feedback Component
export const FeedbackMessage = ({ 
  type, 
  message, 
  onClose 
}: { 
  type: 'success' | 'error' | 'info', 
  message: string, 
  onClose?: () => void 
}) => {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info
  };

  const colors = {
    success: 'text-green-600 bg-green-50 border-green-200',
    error: 'text-red-600 bg-red-50 border-red-200',
    info: 'text-blue-600 bg-blue-50 border-blue-200'
  };

  const Icon = icons[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex items-center gap-2 p-3 rounded-lg border ${colors[type]}`}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <p className="text-sm font-medium">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </motion.div>
  );
};

// Progressive Loading Component
export const ProgressiveLoader = ({ 
  steps, 
  currentStep, 
  onComplete 
}: { 
  steps: string[], 
  currentStep: number, 
  onComplete?: () => void 
}) => {
  useEffect(() => {
    if (currentStep >= steps.length && onComplete) {
      onComplete();
    }
  }, [currentStep, steps.length, onComplete]);

  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ 
            opacity: index <= currentStep ? 1 : 0.5,
            x: index <= currentStep ? 0 : -20
          }}
          className={`flex items-center gap-3 p-3 rounded-lg ${
            index <= currentStep 
              ? 'bg-primary/10 border border-primary/20' 
              : 'bg-gray-100 border border-gray-200'
          }`}
        >
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
            index < currentStep 
              ? 'bg-green-500 text-white' 
              : index === currentStep 
                ? 'bg-primary text-white' 
                : 'bg-gray-300 text-gray-600'
          }`}>
            {index < currentStep ? '✓' : index + 1}
          </div>
          <span className={`text-sm ${
            index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
          }`}>
            {step}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

// Accessibility Focus Trap
export const FocusTrap = ({ children }: { children: React.ReactNode }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, []);

  return <div ref={containerRef}>{children}</div>;
};

// Keyboard Navigation Hook
export const useKeyboardNavigation = (items: any[], onSelect: (item: any) => void) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          onSelect(items[selectedIndex]);
        }
        break;
      case 'Escape':
        setSelectedIndex(-1);
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [items, onSelect]);

  return { selectedIndex, setSelectedIndex };
};

// Auto-save Hook
export const useAutoSave = <T,>(
  data: T,
  saveFunction: (data: T) => Promise<void>,
  delay: number = 2000
) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      setIsSaving(true);
      try {
        await saveFunction(data);
        setLastSaved(new Date());
        toast.success('Tiedot tallennettu automaattisesti');
      } catch (error) {
        toast.error('Tallennus epäonnistui');
      } finally {
        setIsSaving(false);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [data, saveFunction, delay]);

  return { isSaving, lastSaved };
};

// Offline Detection Hook
export const useOfflineDetection = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Yhteys palautettu');
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('Yhteys katkaistu - toimii offline-tilassa');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

// Performance Monitoring Hook
export const usePerformanceMonitor = (componentName: string) => {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (duration > 100) {
        console.warn(`${componentName} took ${duration.toFixed(2)}ms to render`);
      }
    };
  });
};

// User Activity Tracking
export const useUserActivity = () => {
  const [lastActivity, setLastActivity] = useState(new Date());
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const updateActivity = () => {
      setLastActivity(new Date());
      setIsActive(true);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, []);

  return { lastActivity, isActive };
};

// Responsive Design Hook
export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return { isMobile, isTablet, isDesktop };
};

// Error Boundary with UX
export const UXErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Jokin meni pieleen
          </h2>
          <p className="text-gray-600 mb-6">
            Pahoittelut häiriöstä. Yritä päivittää sivu tai ota yhteyttä tukeen.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
            >
              Päivitä sivu
            </button>
            <button
              onClick={() => setHasError(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Yritä uudelleen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};