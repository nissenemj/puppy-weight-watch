// Production Analytics Utility
export interface AnalyticsEvent {
  name: string;
  category: string;
  value?: number;
  metadata?: Record<string, any>;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  url: string;
}

class Analytics {
  private isEnabled: boolean;
  private userId?: string;

  constructor() {
    this.isEnabled = typeof window !== 'undefined' && import.meta.env.PROD;
  }

  // Initialize analytics with user context
  init(userId?: string) {
    this.userId = userId;
    if (this.isEnabled) {
      console.log('Analytics initialized for user:', userId);
    }
  }

  // Track user events
  track(event: AnalyticsEvent) {
    if (!this.isEnabled) return;

    const payload = {
      ...event,
      userId: this.userId,
      timestamp: Date.now(),
      url: window.location.pathname,
      userAgent: navigator.userAgent,
      sessionId: this.getSessionId()
    };

    // Send to analytics endpoint
    this.sendEvent('track', payload);
  }

  // Track performance metrics
  trackPerformance(metric: PerformanceMetric) {
    if (!this.isEnabled) return;

    const payload = {
      ...metric,
      userId: this.userId,
      sessionId: this.getSessionId()
    };

    this.sendEvent('performance', payload);
  }

  // Track errors
  trackError(error: Error, context?: Record<string, any>) {
    if (!this.isEnabled) return;

    const payload = {
      name: error.name,
      message: error.message,
      stack: error.stack,
      url: window.location.pathname,
      userId: this.userId,
      timestamp: Date.now(),
      context
    };

    this.sendEvent('error', payload);
  }

  // Track page views
  trackPageView(path: string) {
    if (!this.isEnabled) return;

    this.track({
      name: 'page_view',
      category: 'navigation',
      metadata: { path }
    });
  }

  // Send event to backend
  private sendEvent(type: string, payload: any) {
    // Use sendBeacon for reliability
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        `/api/analytics/${type}`,
        JSON.stringify(payload)
      );
    } else {
      // Fallback to fetch
      fetch(`/api/analytics/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(console.error);
    }
  }

  // Get or create session ID
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('analytics_session', sessionId);
    }
    return sessionId;
  }
}

export const analytics = new Analytics();

// Auto-track performance metrics
if (typeof window !== 'undefined') {
  // Track Core Web Vitals
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      analytics.trackPerformance({
        name: entry.name,
        value: (entry as any).value || entry.duration,
        timestamp: entry.startTime,
        url: window.location.pathname
      });
    }
  }).observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });

  // Track unhandled errors
  window.addEventListener('error', (event) => {
    analytics.trackError(event.error, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });

  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    analytics.trackError(new Error(event.reason), {
      type: 'unhandled_promise_rejection'
    });
  });
}