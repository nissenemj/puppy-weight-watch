import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';

// Memoization utility for expensive calculations
export const useMemoizedFn = <T extends (...args: unknown[]) => unknown>(fn: T): T => {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  return useCallback(((...args: Parameters<T>) => fnRef.current(...args)) as T, []);
};

// Debounce utility for expensive operations
export const useDebounce = <T extends (...args: unknown[]) => unknown>(
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
export const useThrottle = <T extends (...args: unknown[]) => unknown>(
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
export const measurePerformance = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  name: string
): T => {
  return ((...args: Parameters<T>) => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();

    if (import.meta.env.DEV) {
      console.log(`${name} took ${end - start}ms`);
    }

    return result;
  }) as T;
};

// Lazy loading utility for components
export const lazyLoad = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
): React.ComponentType<React.ComponentProps<T>> => {
  const LazyComponent = React.lazy(importFn);

  const WrappedComponent = (props: React.ComponentProps<T>) => {
    const fallbackComponent = fallback
      ? React.createElement(fallback)
      : React.createElement('div', { children: 'Loading...' });

    return React.createElement(
      React.Suspense,
      { fallback: fallbackComponent },
      React.createElement(LazyComponent, props)
    );
  };

  return WrappedComponent;
};

// Intersection Observer utility for lazy loading
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
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