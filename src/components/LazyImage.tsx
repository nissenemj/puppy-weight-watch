import React, { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
  // WebP and responsive support
  webpSrc?: string;
  srcSet?: string;
  webpSrcSet?: string;
  sizes?: string;
  // Performance optimizations
  priority?: boolean; // For above-the-fold images
  quality?: number; // Image quality hint
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxhdGFhdGFhbi4uLjwvdGV4dD48L3N2Zz4=',
  onLoad,
  onError,
  webpSrc,
  srcSet,
  webpSrcSet,
  sizes = '100vw',
  priority = false,
  quality = 80
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // Priority images (above fold) should load immediately
    if (priority) {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px' // Start loading 100px before the image enters viewport
      }
    );

    observer.observe(img);

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setIsError(true);
    onError?.();
  };

  // Helper function to check WebP support
  const supportsWebP = () => {
    if (typeof window === 'undefined') return false;
    const elem = document.createElement('canvas');
    return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      {!isLoaded && !isError && (
        <img
          src={placeholder}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          aria-hidden="true"
        />
      )}
      
      {/* Actual image with WebP support and responsive images */}
      {isIntersecting && !isError && (
        <>
          {(webpSrc || webpSrcSet) ? (
            <picture>
              {/* WebP sources */}
              {webpSrcSet && (
                <source 
                  srcSet={webpSrcSet} 
                  sizes={sizes} 
                  type="image/webp" 
                />
              )}
              {webpSrc && !webpSrcSet && (
                <source 
                  srcSet={webpSrc} 
                  type="image/webp" 
                />
              )}
              
              {/* Fallback sources */}
              {srcSet && (
                <source 
                  srcSet={srcSet} 
                  sizes={sizes} 
                  type="image/jpeg" 
                />
              )}
              
              {/* Final fallback */}
              <img
                ref={imgRef}
                src={src}
                alt={alt}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={handleLoad}
                onError={handleError}
                loading={priority ? "eager" : "lazy"}
                decoding="async"
                sizes={sizes}
              />
            </picture>
          ) : (
            <img
              ref={imgRef}
              src={src}
              alt={alt}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={handleLoad}
              onError={handleError}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              srcSet={srcSet}
              sizes={sizes}
            />
          )}
        </>
      )}
      
      {/* Error state */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
          <div className="text-center">
            <div className="text-2xl mb-2">⚠️</div>
            <div className="text-sm">Kuvan lataus epäonnistui</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;