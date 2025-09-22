// Production Error Tracking System
import { analytics } from './analytics';

export interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  userAgent: string;
  timestamp: number;
  userId?: string;
  sessionId: string;
  errorBoundary?: boolean;
  componentStack?: string;
  line?: number;
  column?: number;
  type?: string;
}

class ErrorTracker {
  private errorQueue: ErrorReport[] = [];
  private isOnline = navigator.onLine;

  constructor() {
    this.setupGlobalErrorHandlers();
    this.setupNetworkListeners();
  }

  private setupGlobalErrorHandlers() {
    // Catch JavaScript errors
    window.addEventListener('error', (event) => {
      this.captureError({
        message: event.message,
        stack: event.error?.stack,
        url: event.filename || window.location.href,
        line: event.lineno,
        column: event.colno
      });
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        url: window.location.href,
        type: 'promise'
      });
    });
  }

  private setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushErrorQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  captureError(errorData: Partial<ErrorReport>) {
    const report: ErrorReport = {
      message: errorData.message || 'Unknown error',
      stack: errorData.stack,
      url: errorData.url || window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
      ...errorData
    };

    if (this.isOnline) {
      this.sendError(report);
    } else {
      this.errorQueue.push(report);
      this.storeErrorLocally(report);
    }

    // Also send to analytics
    analytics.trackError(new Error(report.message), {
      stack: report.stack,
      url: report.url,
      componentStack: report.componentStack
    });
  }

  private async sendError(report: ErrorReport) {
    try {
      // For production, log to console for debugging
      if (import.meta.env.PROD) {
        console.error('🚨 Production Error:', {
          message: report.message,
          stack: report.stack,
          url: report.url,
          timestamp: new Date(report.timestamp).toISOString(),
          userAgent: report.userAgent
        });
      }
      
      // Try to send to error endpoint (if available)
      await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(report)
      }).catch(() => {
        // Fail silently if endpoint doesn't exist
      });
    } catch (error) {
      // If sending fails, store locally
      this.storeErrorLocally(report);
    }
  }

  private storeErrorLocally(report: ErrorReport) {
    try {
      const storedErrors = JSON.parse(localStorage.getItem('errorReports') || '[]');
      storedErrors.push(report);
      
      // Keep only last 50 errors
      if (storedErrors.length > 50) {
        storedErrors.splice(0, storedErrors.length - 50);
      }
      
      localStorage.setItem('errorReports', JSON.stringify(storedErrors));
    } catch (error) {
      console.error('Failed to store error locally:', error);
    }
  }

  private async flushErrorQueue() {
    if (this.errorQueue.length === 0) return;

    const errors = [...this.errorQueue];
    this.errorQueue = [];

    for (const error of errors) {
      await this.sendError(error);
    }

    // Also try to send any locally stored errors
    this.flushLocalErrors();
  }

  private async flushLocalErrors() {
    try {
      const storedErrors = JSON.parse(localStorage.getItem('errorReports') || '[]');
      if (storedErrors.length === 0) return;

      for (const error of storedErrors) {
        await this.sendError(error);
      }

      localStorage.removeItem('errorReports');
    } catch (error) {
      console.error('Failed to flush local errors:', error);
    }
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('error_session');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('error_session', sessionId);
    }
    return sessionId;
  }
}

// React Error Boundary integration
export function captureComponentError(error: Error, errorInfo: any) {
  errorTracker.captureError({
    message: error.message,
    stack: error.stack,
    url: window.location.href,
    errorBoundary: true,
    componentStack: errorInfo.componentStack
  });
}

export const errorTracker = new ErrorTracker();
