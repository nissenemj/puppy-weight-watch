import { useEffect, useState } from 'react';

interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

interface CoreWebVitals {
  lcp?: WebVitalsMetric;
  fid?: WebVitalsMetric;
  cls?: WebVitalsMetric;
  fcp?: WebVitalsMetric;
  ttfb?: WebVitalsMetric;
}

export function useCoreWebVitals() {
  const [vitals, setVitals] = useState<CoreWebVitals>({});

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          
          // First Contentful Paint
          const fcp = navEntry.responseStart - navEntry.fetchStart;
          setVitals(prev => ({
            ...prev,
            fcp: {
              name: 'FCP',
              value: fcp,
              rating: fcp < 1800 ? 'good' : fcp < 3000 ? 'needs-improvement' : 'poor',
              timestamp: Date.now()
            }
          }));

          // Time to First Byte
          const ttfb = navEntry.responseStart - navEntry.requestStart;
          setVitals(prev => ({
            ...prev,
            ttfb: {
              name: 'TTFB',
              value: ttfb,
              rating: ttfb < 800 ? 'good' : ttfb < 1800 ? 'needs-improvement' : 'poor',
              timestamp: Date.now()
            }
          }));
        }

        if (entry.entryType === 'largest-contentful-paint') {
          const lcpEntry = entry as any;
          setVitals(prev => ({
            ...prev,
            lcp: {
              name: 'LCP',
              value: lcpEntry.startTime,
              rating: lcpEntry.startTime < 2500 ? 'good' : lcpEntry.startTime < 4000 ? 'needs-improvement' : 'poor',
              timestamp: Date.now()
            }
          }));
        }

        if (entry.entryType === 'first-input') {
          const fidEntry = entry as any;
          setVitals(prev => ({
            ...prev,
            fid: {
              name: 'FID',
              value: fidEntry.processingStart - fidEntry.startTime,
              rating: (fidEntry.processingStart - fidEntry.startTime) < 100 ? 'good' : 
                     (fidEntry.processingStart - fidEntry.startTime) < 300 ? 'needs-improvement' : 'poor',
              timestamp: Date.now()
            }
          }));
        }

        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          const clsEntry = entry as any;
          setVitals(prev => {
            const currentCLS = prev.cls?.value || 0;
            const newCLS = currentCLS + clsEntry.value;
            return {
              ...prev,
              cls: {
                name: 'CLS',
                value: newCLS,
                rating: newCLS < 0.1 ? 'good' : newCLS < 0.25 ? 'needs-improvement' : 'poor',
                timestamp: Date.now()
              }
            };
          });
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['navigation', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (e) {
      // Fallback for browsers that don't support all entry types
      console.warn('Some Performance Observer entry types not supported');
    }

    return () => observer.disconnect();
  }, []);

  const getOverallScore = () => {
    const metrics = Object.values(vitals);
    if (metrics.length === 0) return null;

    const goodCount = metrics.filter(m => m.rating === 'good').length;
    const totalCount = metrics.length;
    const percentage = (goodCount / totalCount) * 100;

    if (percentage >= 75) return 'good';
    if (percentage >= 50) return 'needs-improvement';
    return 'poor';
  };

  return {
    vitals,
    overallScore: getOverallScore(),
    isLoading: Object.keys(vitals).length === 0
  };
}