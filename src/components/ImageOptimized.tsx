import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageOptimizedProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

const ImageOptimized: React.FC<ImageOptimizedProps> = ({
  src,
  alt,
  className,
  width,
  height,
  loading = 'lazy',
  priority = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  if (hasError) {
    return (
      <div 
        className={cn(
          "bg-muted flex items-center justify-center text-muted-foreground text-sm",
          className
        )}
        style={{ width, height }}
      >
        Kuva ei latautunut
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse"
          style={{ width, height }}
        />
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        decoding="async"
      />
    </div>
  );
};

export default ImageOptimized;