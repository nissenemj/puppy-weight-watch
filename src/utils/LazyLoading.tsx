/**
 * Advanced Lazy Loading Utilities
 * Optimized for mobile performance with intersection observer and native lazy loading
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import puppyLogo from '@/assets/puppy-logo.png';
import heroPuppy from '@/assets/hero-puppy.png';
import pawIcon from '@/assets/paw-icon.png';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  threshold?: number;
  rootMargin?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Lazy loading image component with placeholder and loading states
 */
export function LazyImage({
  src,
  alt,
  placeholder = '/placeholder.svg',
  threshold = 0.1,
  rootMargin = '50px',
  onLoad,
  onError,
  className,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // Use native lazy loading if supported
    if ('loading' in HTMLImageElement.prototype) {
      img.loading = 'lazy';
      setIsInView(true);
      return;
    }

    // Fallback to Intersection Observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(img);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  return (
    <div className="relative overflow-hidden">
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <img
          src={placeholder}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover blur-sm transition-opacity duration-300 ${
            isLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}
      
      {/* Actual image */}
      {isInView && (
        <img
          ref={imgRef}
          src={hasError ? placeholder : src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          {...props}
        />
      )}
      
      {/* Loading indicator */}
      {!isLoaded && !hasError && isInView && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

/**
 * Lazy loading hook for components
 */
export function useLazyLoading(threshold = 0.1, rootMargin = '100px') {
  const [isInView, setIsInView] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [elementRef, isInView] as const;
}

/**
 * Lazy component wrapper
 */
interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
}

export function LazyComponent({
  children,
  fallback = <div className="h-32 bg-muted animate-pulse rounded" />,
  threshold = 0.1,
  rootMargin = '100px'
}: LazyComponentProps) {
  const [elementRef, isInView] = useLazyLoading(threshold, rootMargin);

  return (
    <div ref={elementRef}>
      {isInView ? children : fallback}
    </div>
  );
}

/**
 * Progressive image loading with multiple sources
 */
interface ProgressiveImageProps {
  srcSet: string[];
  alt: string;
  className?: string;
  onLoad?: () => void;
}

export function ProgressiveImage({
  srcSet,
  alt,
  className,
  onLoad
}: ProgressiveImageProps) {
  const [currentSrc, setCurrentSrc] = useState(srcSet[0]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    
    const loadNextImage = () => {
      if (currentIndex < srcSet.length - 1) {
        const nextImage = new Image();
        nextImage.onload = () => {
          currentIndex++;
          setCurrentSrc(srcSet[currentIndex]);
          if (currentIndex === srcSet.length - 1) {
            setIsLoaded(true);
            onLoad?.();
          } else {
            loadNextImage();
          }
        };
        nextImage.src = srcSet[currentIndex + 1];
      }
    };

    const initialImage = new Image();
    initialImage.onload = () => {
      loadNextImage();
    };
    initialImage.src = srcSet[0];
  }, [srcSet, onLoad]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={`transition-all duration-500 ${isLoaded ? 'filter-none' : 'filter blur-sm'} ${className}`}
    />
  );
}

/**
 * Preload critical resources
 */
export function preloadCriticalResources() {
  const criticalImages = [
    puppyLogo,
    heroPuppy,
    pawIcon
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Record<string, number> = {};

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  measureStart(name: string): void {
    this.metrics[`${name}_start`] = performance.now();
  }

  measureEnd(name: string): number {
    const startTime = this.metrics[`${name}_start`];
    if (startTime) {
      const duration = performance.now() - startTime;
      this.metrics[name] = duration;
      
      if (import.meta.env.DEV) {
        console.log(`${name}: ${duration.toFixed(2)}ms`);
      }
      
      return duration;
    }
    return 0;
  }

  getMetrics(): Record<string, number> {
    return { ...this.metrics };
  }

  measureCoreWebVitals(): void {
    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        this.metrics.fid = (entry as any).processingStart - entry.startTime;
      }
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          this.metrics.cls = clsValue;
        }
      }
    }).observe({ entryTypes: ['layout-shift'] });
  }
}