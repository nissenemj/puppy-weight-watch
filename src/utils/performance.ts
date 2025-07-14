import React, { useMemo, useCallback } from 'react';

// Memoization utility for expensive calculations
export const memoize = <T extends (...args: any[]) => any>(
  fn: T,
  deps: any[] = []
): T => {
  return useMemo(() => fn, deps) as T;
};

// Debounce utility for expensive operations
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useMemo(() => ({ current: null as NodeJS.Timeout | null }), []);
  
  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    }) as T,
    [callback, delay, timeoutRef]
  );
};

// Throttle utility for frequent operations
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRun = useMemo(() => ({ current: 0 }), []);
  
  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      }
    }) as T,
    [callback, delay, lastRun]
  );
};

// Performance monitoring utility
export const measurePerformance = <T extends (...args: any[]) => any>(
  fn: T,
  name: string
): T => {
  return ((...args: Parameters<T>) => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${name} took ${end - start}ms`);
    }
    
    return result;
  }) as T;
};

// Lazy loading utility for components
export const lazyLoad = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) => {
  const LazyComponent = React.lazy(importFn);
  
  const WrappedComponent = (props: any) => {
    const fallbackComponent = fallback 
      ? React.createElement(fallback) 
      : React.createElement('div', { children: 'Loading...' });
    
    return React.createElement(
      React.Suspense,
      { fallback: fallbackComponent },
      React.createElement(LazyComponent, props)
    );
  };
  
  return WrappedComponent as T;
};

// Intersection Observer utility for lazy loading
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const [ref, setRef] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return [setRef, isIntersecting] as const;
};