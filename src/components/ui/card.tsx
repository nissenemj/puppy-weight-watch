import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'elevated';
  }
>(({ className, variant = 'default', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Base styles - simplified
      "rounded-[var(--radius-lg)] bg-white text-[var(--color-text-primary)] transition-all duration-200",
      // Variants - only 2
      {
        'default': "border border-[var(--color-border)] shadow-sm hover:shadow-md",
        'elevated': "shadow-md hover:shadow-lg border-0"
      }[variant],
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-[var(--spacing-3)] p-[var(--spacing-6)]", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-[var(--font-family-heading)] text-[var(--font-size-xl)] font-[var(--font-weight-semibold)] text-[var(--color-text-primary)] line-height-[var(--line-height-tight)]",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("font-[var(--font-family-body)] text-[var(--font-size-sm)] text-[var(--color-text-secondary)] mt-[var(--spacing-1)]", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-[var(--spacing-6)] pt-0 font-[var(--font-family-body)] text-[var(--font-size-base)] line-height-[var(--line-height-relaxed)] text-[var(--color-text-primary)]", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between p-[var(--spacing-6)] pt-0 mt-[var(--spacing-5)] border-t border-[var(--color-border-subtle)]", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
