/**
 * Mobile Performance Analytics Hook
 * Tracks mobile-specific performance metrics and user interactions
 */
import { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  touchInteractions: number;
  scrollDepth: number;
  networkType: string;
  deviceMemory: number;
}

export function useMobileAnalytics() {
  const isMobile = useIsMobile();
  const metricsRef = useRef<Partial<PerformanceMetrics>>({});
  const touchCountRef = useRef(0);
  const maxScrollRef = useRef(0);

  useEffect(() => {
    if (!isMobile) return;

    // Track Core Web Vitals
    const trackWebVitals = () => {
      // Largest Contentful Paint
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        metricsRef.current.largestContentfulPaint = lastEntry.startTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          metricsRef.current.firstInputDelay = (entry as any).processingStart - entry.startTime;
        }
      }).observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            metricsRef.current.cumulativeLayoutShift = clsValue;
          }
        }
      }).observe({ entryTypes: ['layout-shift'] });
    };

    // Track touch interactions
    const trackTouchInteractions = () => {
      const handleTouchStart = () => {
        touchCountRef.current++;
        metricsRef.current.touchInteractions = touchCountRef.current;
      };

      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      return () => document.removeEventListener('touchstart', handleTouchStart);
    };

    // Track scroll depth
    const trackScrollDepth = () => {
      const handleScroll = () => {
        const scrolled = window.scrollY;
        const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrolled / maxHeight) * 100;
        
        if (scrollPercent > maxScrollRef.current) {
          maxScrollRef.current = scrollPercent;
          metricsRef.current.scrollDepth = scrollPercent;
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    };

    // Gather device information
    const gatherDeviceInfo = () => {
      // Network information
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (connection) {
        metricsRef.current.networkType = connection.effectiveType || 'unknown';
      }

      // Device memory
      if ('deviceMemory' in navigator) {
        metricsRef.current.deviceMemory = (navigator as any).deviceMemory;
      }

      // Page load time
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        metricsRef.current.loadTime = navigation.loadEventEnd - navigation.fetchStart;
      });
    };

    // Initialize tracking
    trackWebVitals();
    const cleanupTouch = trackTouchInteractions();
    const cleanupScroll = trackScrollDepth();
    gatherDeviceInfo();

    // Send metrics before page unload
    const handleBeforeUnload = () => {
      const metrics = {
        ...metricsRef.current,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        screenSize: `${screen.width}x${screen.height}`,
        pixelRatio: window.devicePixelRatio
      };

      // Send to analytics service
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/mobile', JSON.stringify(metrics));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      cleanupTouch?.();
      cleanupScroll?.();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isMobile]);

  return {
    getMetrics: () => ({ ...metricsRef.current }),
    isMobile
  };
}

/**
 * Mobile-specific error tracking
 */
export function useMobileErrorTracking() {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) return;

    const handleError = (event: ErrorEvent) => {
      const errorData = {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        isMobile: true
      };

      // Send error to monitoring service
      fetch('/api/errors/mobile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData)
      }).catch(() => {
        // Fallback: store in localStorage for later sync
        const errors = JSON.parse(localStorage.getItem('mobile_errors') || '[]');
        errors.push(errorData);
        localStorage.setItem('mobile_errors', JSON.stringify(errors.slice(-10))); // Keep last 10
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorData = {
        message: event.reason?.message || 'Unhandled Promise Rejection',
        reason: String(event.reason),
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        isMobile: true
      };

      fetch('/api/errors/mobile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorData)
      }).catch(() => {
        const errors = JSON.parse(localStorage.getItem('mobile_errors') || '[]');
        errors.push(errorData);
        localStorage.setItem('mobile_errors', JSON.stringify(errors.slice(-10)));
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [isMobile]);
}

/**
 * Battery-aware performance adjustments
 */
export function useBatteryOptimization() {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile || !('getBattery' in navigator)) return;

    (navigator as any).getBattery().then((battery: any) => {
      const updateBatteryOptimizations = () => {
        const isLowBattery = battery.level < 0.2;
        const isCharging = battery.charging;

        // Adjust performance based on battery
        if (isLowBattery && !isCharging) {
          // Reduce animations and background tasks
          document.body.classList.add('low-battery-mode');
          
          // Reduce animation frame rate
          document.documentElement.style.setProperty('--animation-duration', '0.1s');
          
          // Disable non-essential features
          document.querySelectorAll('[data-battery-optional]').forEach(el => {
            (el as HTMLElement).style.display = 'none';
          });
        } else {
          document.body.classList.remove('low-battery-mode');
          document.documentElement.style.removeProperty('--animation-duration');
          
          document.querySelectorAll('[data-battery-optional]').forEach(el => {
            (el as HTMLElement).style.display = '';
          });
        }
      };

      battery.addEventListener('levelchange', updateBatteryOptimizations);
      battery.addEventListener('chargingchange', updateBatteryOptimizations);
      
      // Initial check
      updateBatteryOptimizations();

      return () => {
        battery.removeEventListener('levelchange', updateBatteryOptimizations);
        battery.removeEventListener('chargingchange', updateBatteryOptimizations);
      };
    }).catch(() => {
      // Battery API not supported
    });
  }, [isMobile]);
}