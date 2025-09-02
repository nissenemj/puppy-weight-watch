import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'elevated' | 'glass' | 'minimal' | 'gradient' | 'modern';
  }
>(({ className, variant = 'default', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Base styles
      "rounded-2xl transition-all duration-300 overflow-hidden group",
      // Variants
      {
        'default': "bg-card text-card-foreground border border-border shadow-md hover:shadow-lg transform hover:-translate-y-1",
        'elevated': "bg-card text-card-foreground shadow-2xl hover:shadow-3xl border-0 transform hover:-translate-y-2 hover:scale-105",
        'glass': "bg-white/10 backdrop-blur-md border border-white/20 text-foreground hover:bg-white/20 hover:shadow-2xl transform hover:-translate-y-1",
        'minimal': "bg-card text-card-foreground border-0 shadow-none hover:shadow-lg transform hover:-translate-y-1",
        'gradient': "bg-gradient-primary text-primary-foreground border-0 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105",
        'modern': "bg-card/80 backdrop-blur-sm text-card-foreground border border-border/50 shadow-lg hover:shadow-xl hover:bg-card transform hover:-translate-y-1 hover:border-primary/30"
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
    className={cn("flex flex-col space-y-3 p-6", className)}
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
      "text-h4 text-[var(--color-text)]",
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
    className={cn("text-body-sm text-[var(--color-text-muted)]", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
