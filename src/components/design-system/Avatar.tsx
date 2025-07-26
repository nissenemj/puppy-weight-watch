import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Avatar component for displaying user or puppy profile images.
 *
 * Props:
 * - size: controls the size ("sm", "md", "lg")
 * - src: image source URL
 * - alt: alt text for accessibility
 * - fallback: fallback text/content when image is not available
 */
export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = "md", src, alt, fallback, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);
    
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full bg-muted",
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt}
            className="aspect-square h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
            {fallback || alt?.[0]?.toUpperCase() || "?"}
          </div>
        )}
      </div>
    );
  },
);
Avatar.displayName = "Avatar";