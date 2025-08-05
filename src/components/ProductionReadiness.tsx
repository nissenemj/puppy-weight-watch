import { useEffect } from 'react';
import { analytics } from '@/utils/analytics';
import { performanceMonitor } from '@/utils/performanceMonitor';
import { errorTracker } from '@/utils/errorTracking';

export function ProductionReadiness() {
  useEffect(() => {
    // Initialize analytics
    analytics.init();

    // Track app initialization
    analytics.track({
      name: 'app_initialized',
      category: 'app_lifecycle'
    });

    // Set up CSP reporting if available
    if ('SecurityPolicyViolationEvent' in window) {
      document.addEventListener('securitypolicyviolation', (event) => {
        analytics.trackError(new Error('CSP Violation'), {
          blockedURI: event.blockedURI,
          violatedDirective: event.violatedDirective,
          originalPolicy: event.originalPolicy
        });
      });
    }

    // Monitor memory usage
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      analytics.trackPerformance({
        name: 'memory_usage',
        value: memoryInfo.usedJSHeapSize,
        timestamp: Date.now(),
        url: window.location.pathname
      });
    }

    // Monitor connection quality
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      analytics.track({
        name: 'connection_info',
        category: 'performance',
        metadata: {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt
        }
      });
    }

    // Start performance monitoring
    performanceMonitor.markStart('app_ready');
    
    // Track memory usage periodically
    const memoryInterval = setInterval(() => {
      performanceMonitor.trackMemoryUsage();
    }, 30000); // Every 30 seconds

    return () => {
      clearInterval(memoryInterval);
      performanceMonitor.markEnd('app_ready');
    };
  }, []);

  return null;
}