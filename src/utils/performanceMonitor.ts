// Production Performance Monitoring
import { analytics } from './analytics';

export interface PerformanceEntry {
  name: string;
  startTime: number;
  duration: number;
  timestamp: number;
}

export interface WebVital {
  name: 'FCP' | 'LCP' | 'FID' | 'CLS' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

class PerformanceMonitor {
  private entries: Map<string, number> = new Map();
  private vitals: WebVital[] = [];
  private observer?: PerformanceObserver;

  constructor() {
    this.initializeObserver();
  }

  private initializeObserver() {
    if (!('PerformanceObserver' in window)) return;

    try {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.processEntry(entry);
        }
      });

      // Observe different types of performance entries
      this.observer.observe({ 
        entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] 
      });
    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }
  }

  private processEntry(entry: any) {
    const timestamp = Date.now();

    switch (entry.entryType) {
      case 'navigation':
        this.trackNavigationTiming(entry, timestamp);
        break;
      case 'paint':
        if (entry.name === 'first-contentful-paint') {
          this.addVital('FCP', entry.startTime, timestamp);
        }
        break;
      case 'largest-contentful-paint':
        this.addVital('LCP', entry.startTime, timestamp);
        break;
      case 'first-input':
        this.addVital('FID', entry.processingStart - entry.startTime, timestamp);
        break;
      case 'layout-shift':
        if (!entry.hadRecentInput) {
          this.addVital('CLS', entry.value, timestamp);
        }
        break;
    }
  }

  private trackNavigationTiming(entry: any, timestamp: number) {
    // Track TTFB (Time to First Byte)
    const ttfb = entry.responseStart - entry.fetchStart;
    this.addVital('TTFB', ttfb, timestamp);

    // Track other navigation metrics
    analytics.trackPerformance({
      name: 'page_load_time',
      value: entry.loadEventEnd - entry.fetchStart,
      timestamp,
      url: window.location.pathname
    });

    analytics.trackPerformance({
      name: 'dom_content_loaded',
      value: entry.domContentLoadedEventEnd - entry.fetchStart,
      timestamp,
      url: window.location.pathname
    });
  }

  private addVital(name: WebVital['name'], value: number, timestamp: number) {
    const rating = this.getRating(name, value);
    
    const vital: WebVital = {
      name,
      value,
      rating,
      timestamp
    };

    this.vitals.push(vital);

    // Send to analytics
    analytics.trackPerformance({
      name: `web_vital_${name.toLowerCase()}`,
      value,
      timestamp,
      url: window.location.pathname
    });

    // Log poor performance
    if (rating === 'poor') {
      console.warn(`Poor ${name} performance:`, value);
    }
  }

  private getRating(name: WebVital['name'], value: number): WebVital['rating'] {
    const thresholds = {
      FCP: { good: 1800, poor: 3000 },
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      TTFB: { good: 800, poor: 1800 }
    };

    const threshold = thresholds[name];
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  // Manual performance tracking
  markStart(name: string) {
    this.entries.set(name, performance.now());
  }

  markEnd(name: string) {
    const startTime = this.entries.get(name);
    if (startTime === undefined) {
      console.warn(`No start mark found for: ${name}`);
      return;
    }

    const duration = performance.now() - startTime;
    this.entries.delete(name);

    analytics.trackPerformance({
      name,
      value: duration,
      timestamp: Date.now(),
      url: window.location.pathname
    });

    return duration;
  }

  // Get performance summary
  getPerformanceSummary() {
    const summary = {
      vitals: this.vitals,
      score: this.calculateScore(),
      lastUpdate: Date.now()
    };

    return summary;
  }

  private calculateScore(): number {
    if (this.vitals.length === 0) return 0;

    const scores = this.vitals.map(vital => {
      switch (vital.rating) {
        case 'good': return 100;
        case 'needs-improvement': return 50;
        case 'poor': return 0;
        default: return 0;
      }
    });

    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }

  // Memory monitoring
  trackMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      
      analytics.trackPerformance({
        name: 'memory_used',
        value: memory.usedJSHeapSize,
        timestamp: Date.now(),
        url: window.location.pathname
      });

      analytics.trackPerformance({
        name: 'memory_total',
        value: memory.totalJSHeapSize,
        timestamp: Date.now(),
        url: window.location.pathname
      });
    }
  }

  // Resource loading monitoring
  trackResourceLoading() {
    const resources = performance.getEntriesByType('resource');
    
    resources.forEach(resource => {
      if (resource.duration > 1000) { // Resources taking more than 1s
        analytics.trackPerformance({
          name: 'slow_resource',
          value: resource.duration,
          timestamp: Date.now(),
          url: resource.name
        });
      }
    });
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();