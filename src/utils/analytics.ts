// Production Analytics Utility

// ===== EVENT SCHEMA =====
// Standardized event names and categories for consistent tracking

export type EventCategory =
  | 'weight_tracking'
  | 'authentication'
  | 'navigation'
  | 'cta_interaction'
  | 'empty_state'
  | 'user_engagement'
  | 'error';

export type EventName =
  // Weight tracking events
  | 'weight_entry_started'
  | 'weight_entry_completed'
  | 'weight_entry_deleted'
  // Auth events
  | 'login_started'
  | 'login_completed'
  | 'signup_started'
  | 'signup_completed'
  // Navigation events
  | 'page_viewed'
  | 'tab_changed'
  // CTA interaction events
  | 'hero_cta_clicked'
  | 'secondary_cta_clicked'
  | 'feature_card_clicked'
  // Empty state events
  | 'empty_state_viewed'
  | 'empty_state_action_clicked'
  // Engagement events
  | 'form_validation_error';

export interface AnalyticsEvent {
  name: EventName | string;
  category: EventCategory | string;
  value?: number;
  metadata?: Record<string, unknown>;
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
    // Enable analytics only when explicitly allowed in production builds
    this.isEnabled = typeof window !== 'undefined' && import.meta.env.PROD && import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
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
  trackError(error: Error, context?: Record<string, unknown>) {
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
  private sendEvent(type: string, payload: Record<string, unknown>) {
    // Use sendBeacon for reliability
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        `${import.meta.env.VITE_ANALYTICS_BASE_URL || '/api/analytics'}/${type}`,
        JSON.stringify(payload)
      );
    } else {
      // Fallback to fetch
      fetch(`${import.meta.env.VITE_ANALYTICS_BASE_URL || '/api/analytics'}/${type}`, {
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

// ===== HELPER FUNCTIONS FOR 15 CORE EVENTS =====

// Weight Tracking Events
export const trackWeightEntryStarted = (metadata?: Record<string, unknown>) => {
  analytics.track({
    name: 'weight_entry_started',
    category: 'weight_tracking',
    metadata,
  });
};

export const trackWeightEntryCompleted = (weightKg: number, metadata?: Record<string, unknown>) => {
  analytics.track({
    name: 'weight_entry_completed',
    category: 'weight_tracking',
    value: weightKg,
    metadata: {
      ...metadata,
      weightKg,
    },
  });
};

export const trackWeightEntryDeleted = (entryId: string, metadata?: Record<string, unknown>) => {
  analytics.track({
    name: 'weight_entry_deleted',
    category: 'weight_tracking',
    metadata: {
      ...metadata,
      entryId,
    },
  });
};

// Authentication Events
export const trackLoginStarted = (method: 'email' | 'google' | 'github' = 'email') => {
  analytics.track({
    name: 'login_started',
    category: 'authentication',
    metadata: { method },
  });
};

export const trackLoginCompleted = (method: 'email' | 'google' | 'github' = 'email', userId?: string) => {
  analytics.track({
    name: 'login_completed',
    category: 'authentication',
    metadata: { method, userId },
  });
};

export const trackSignupStarted = (method: 'email' | 'google' | 'github' = 'email') => {
  analytics.track({
    name: 'signup_started',
    category: 'authentication',
    metadata: { method },
  });
};

export const trackSignupCompleted = (method: 'email' | 'google' | 'github' = 'email', userId?: string) => {
  analytics.track({
    name: 'signup_completed',
    category: 'authentication',
    metadata: { method, userId },
  });
};

// Navigation Events
export const trackPageViewed = (pageName: string, path: string) => {
  analytics.track({
    name: 'page_viewed',
    category: 'navigation',
    metadata: { pageName, path },
  });
};

export const trackTabChanged = (tabName: string, previousTab?: string) => {
  analytics.track({
    name: 'tab_changed',
    category: 'navigation',
    metadata: { tabName, previousTab },
  });
};

// CTA Interaction Events
export const trackHeroCTAClicked = (ctaText: string, destination: string) => {
  analytics.track({
    name: 'hero_cta_clicked',
    category: 'cta_interaction',
    metadata: { ctaText, destination },
  });
};

export const trackSecondaryCTAClicked = (ctaText: string, destination: string, location: string) => {
  analytics.track({
    name: 'secondary_cta_clicked',
    category: 'cta_interaction',
    metadata: { ctaText, destination, location },
  });
};

export const trackFeatureCardClicked = (featureName: string, destination: string) => {
  analytics.track({
    name: 'feature_card_clicked',
    category: 'cta_interaction',
    metadata: { featureName, destination },
  });
};

// Empty State Events
export const trackEmptyStateViewed = (componentName: string, emptyStateType: string) => {
  analytics.track({
    name: 'empty_state_viewed',
    category: 'empty_state',
    metadata: { componentName, emptyStateType },
  });
};

export const trackEmptyStateActionClicked = (componentName: string, actionLabel: string) => {
  analytics.track({
    name: 'empty_state_action_clicked',
    category: 'empty_state',
    metadata: { componentName, actionLabel },
  });
};

// User Engagement Events
export const trackFormValidationError = (formName: string, fieldName: string, errorType: string) => {
  analytics.track({
    name: 'form_validation_error',
    category: 'user_engagement',
    metadata: { formName, fieldName, errorType },
  });
};

// Footer Events
export const trackNewsletterSubscription = (email: string, success: boolean) => {
  analytics.track({
    name: 'newsletter_subscribed',
    category: 'user_engagement',
    metadata: {
      email: email.split('@')[1], // Only track domain for privacy
      success
    },
  });
};

export const trackFooterLinkClicked = (category: string, label: string, destination: string) => {
  analytics.track({
    name: 'footer_link_clicked',
    category: 'navigation',
    metadata: { category, label, destination },
  });
};

// Auto-track performance metrics
if (typeof window !== 'undefined') {
  // Track Core Web Vitals
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Type assertion for PerformanceEntry with value property
      const perfEntry = entry as PerformanceEntry & { value?: number };
      analytics.trackPerformance({
        name: entry.name,
        value: perfEntry.value || entry.duration,
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