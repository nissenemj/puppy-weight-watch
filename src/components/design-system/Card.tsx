import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Card component built on top of shadcn/ui styles.
 *
 * Usage:
 * ```tsx
 * <Card>
 *   <CardHeader>Title</CardHeader>
 *   <CardContent>Some content</CardContent>
 * </Card>
 * ```
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border bg-card text-card-foreground shadow-sm",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Card.displayName = "Card";

export interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader: React.FC<CardHeaderProps> = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 p-6 border-b bg-muted/50 text-muted-foreground",
      className,
    )}
    {...props}
  />
);

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle: React.FC<CardTitleProps> = ({ className, ...props }) => (
  <h3
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
);

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent: React.FC<CardContentProps> = ({ className, ...props }) => (
  <div
    className={cn("p-6 pt-0", className)}
    {...props}
  />
);

export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter: React.FC<CardFooterProps> = ({ className, ...props }) => (
  <div
    className={cn(
      "flex items-center p-6 pt-0 border-t bg-muted/50",
      className,
    )}
    {...props}
  />
);