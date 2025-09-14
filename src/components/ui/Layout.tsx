import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { pageTransitions, entranceAnimations } from '@/animations'

// ===== MAIN LAYOUT WRAPPER =====
interface PageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'centered' | 'full-width'
  animated?: boolean
  className?: string
}

export const PageLayout = React.forwardRef<HTMLDivElement, PageLayoutProps>(
  ({ children, variant = 'default', animated = true, className, ...props }, ref) => {
    const layoutStyles = {
      'default': 'min-h-screen bg-surface-alt page-with-navigation pt-24 sm:pt-28',
      'centered': 'min-h-screen bg-surface-alt flex items-center justify-center p-4 pt-24 sm:pt-28',
      'full-width': 'min-h-screen bg-surface-alt pt-24 sm:pt-28'
    }

    const content = (
      <div
        ref={ref}
        className={cn(layoutStyles[variant], className)}
        {...props}
      >
        {children}
      </div>
    )

    if (animated) {
      return (
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageTransitions.fade}
          transition={{ duration: 0.45 }}
        >
          {content}
        </motion.div>
      )
    }

    return content
  }
)
PageLayout.displayName = 'PageLayout'

// ===== CONTAINER =====
interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  center?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'lg', center = true, padding = 'md', ...props }, ref) => {
    const sizeStyles = {
      'sm': 'max-w-3xl',
      'md': 'max-w-4xl', 
      'lg': 'max-w-6xl',
      'xl': 'max-w-7xl',
      'full': 'max-w-full'
    }

    const paddingStyles = {
      'none': '',
      'sm': 'px-4 py-6',
      'md': 'px-4 py-8 sm:px-6 sm:py-12',
      'lg': 'px-4 py-12 sm:px-6 sm:py-16',
      'xl': 'px-4 py-16 sm:px-6 sm:py-20'
    }

    return (
      <div
        ref={ref}
        className={cn(
          'w-full',
          sizeStyles[size],
          center && 'mx-auto',
          paddingStyles[padding],
          className
        )}
        {...props}
      />
    )
  }
)
Container.displayName = 'Container'

// ===== SECTION =====
interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  animated?: boolean
  delay?: number
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, animated = true, delay = 0, children, ...props }, ref) => {
    const content = (
      <section
        ref={ref}
        className={cn('relative', className)}
        {...props}
      >
        {children}
      </section>
    )

    if (animated) {
      return (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.35, delay }}
          variants={entranceAnimations.fadeInUp}
        >
          {content}
        </motion.div>
      )
    }

    return content
  }
)
Section.displayName = 'Section'

// ===== GRID =====
interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 6 | 12
  gap?: 'sm' | 'md' | 'lg' | 'xl'
  responsive?: boolean
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 1, gap = 'md', responsive = true, ...props }, ref) => {
    const colStyles = responsive ? {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
      6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
      12: 'grid-cols-12'
    } : {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      6: 'grid-cols-6',
      12: 'grid-cols-12'
    }

    const gapStyles = {
      'sm': 'gap-4',
      'md': 'gap-6',
      'lg': 'gap-8',
      'xl': 'gap-12'
    }

    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          colStyles[cols],
          gapStyles[gap],
          className
        )}
        {...props}
      />
    )
  }
)
Grid.displayName = 'Grid'

// ===== CARD GRID (ANIMATED) =====
interface CardGridProps extends GridProps {
  stagger?: boolean
}

export const CardGrid = React.forwardRef<HTMLDivElement, CardGridProps>(
  ({ stagger = true, children, ...props }, ref) => {
    if (stagger) {
      return (
        <motion.div
          ref={ref}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={entranceAnimations.staggerContainer}
        >
          <Grid {...props}>
            {React.Children.map(children, (child, index) => (
              <motion.div
                key={index}
                variants={entranceAnimations.staggerChild}
              >
                {child}
              </motion.div>
            ))}
          </Grid>
        </motion.div>
      )
    }

    return <Grid ref={ref} {...props}>{children}</Grid>
  }
)
CardGrid.displayName = 'CardGrid'

// ===== STACK (VERTICAL LAYOUT) =====
interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
  align?: 'start' | 'center' | 'end'
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, spacing = 'md', align = 'start', ...props }, ref) => {
    const spacingStyles = {
      'sm': 'space-y-4',
      'md': 'space-y-6',
      'lg': 'space-y-8',
      'xl': 'space-y-12'
    }

    const alignStyles = {
      'start': 'items-start',
      'center': 'items-center',
      'end': 'items-end'
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col',
          spacingStyles[spacing],
          alignStyles[align],
          className
        )}
        {...props}
      />
    )
  }
)
Stack.displayName = 'Stack'