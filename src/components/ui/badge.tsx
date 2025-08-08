import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-600)]",
        secondary:
          "border-transparent bg-[var(--color-surface-alt)] text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]",
        destructive:
          "border-transparent bg-[var(--color-error)] text-white hover:bg-[var(--color-error)]/90",
        outline: "text-[var(--color-text)] border-[var(--color-border)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
