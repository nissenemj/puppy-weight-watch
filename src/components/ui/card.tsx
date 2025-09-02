import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'elevated' | 'warm' | 'minimal' | 'puppy';
  }
>(({ className, variant = 'default', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Base styles with Anthropic-inspired design
      "rounded-[var(--radius-lg)] bg-[var(--color-background-primary)] text-[var(--color-text-primary)] transition-all duration-[var(--transition-base)] overflow-hidden relative",
      // Variants
      {
        'default': "border border-[var(--color-border-subtle)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:translate-y-[-2px]",
        'elevated': "shadow-[var(--shadow-lg)] hover:shadow-[var(--shadow-xl)] border-0 hover:translate-y-[-2px]",
        'warm': "border border-[var(--color-border-subtle)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:translate-y-[-2px] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-[var(--color-primary-400)] before:via-[var(--color-primary-500)] before:to-[var(--color-primary-600)]",
        'minimal': "border-0 shadow-none hover:shadow-[var(--shadow-sm)] hover:translate-y-[-1px] hover:bg-[var(--color-background-secondary)]",
        'puppy': "border border-[var(--color-border-subtle)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:translate-y-[-2px] overflow-visible"
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
