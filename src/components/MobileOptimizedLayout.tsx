import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface MobileOptimizedLayoutProps {
  children: ReactNode
  className?: string
  showFloatingAction?: boolean
  onFloatingActionClick?: () => void
  floatingActionIcon?: ReactNode
  floatingActionLabel?: string
}

export function MobileOptimizedLayout({
  children,
  className = '',
  showFloatingAction = false,
  onFloatingActionClick,
  floatingActionIcon,
  floatingActionLabel = 'Lisää'
}: MobileOptimizedLayoutProps) {
  return (
    <div className={`min-h-screen bg-background ${className}`}>
      {/* Main content with safe area padding */}
      <main id="main-content" role="main" aria-label="Pääsisältö" tabIndex={-1} className="pb-20 pt-4 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      
      {/* Floating Action Button for mobile */}
      {showFloatingAction && (
        <motion.button
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center z-50 touch-manipulation"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onFloatingActionClick}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {floatingActionIcon}
          <span className="sr-only">{floatingActionLabel}</span>
        </motion.button>
      )}
      
      {/* Bottom safe area for devices with home indicators */}
      <footer role="contentinfo" aria-label="Alatunniste" className="h-8 bg-background" />
    </div>
  )
}

interface MobileCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
}

export function MobileCard({ children, className = '', onClick, disabled = false }: MobileCardProps) {
  return (
    <motion.div
      className={`
        bg-card border rounded-xl p-4 shadow-sm
        ${onClick ? 'cursor-pointer active:scale-95' : ''}
        ${disabled ? 'opacity-50 pointer-events-none' : ''}
        touch-manipulation
        ${className}
      `}
      whileHover={onClick && !disabled ? { scale: 1.02 } : {}}
      whileTap={onClick && !disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

interface MobileListProps {
  children: ReactNode
  className?: string
}

export function MobileList({ children, className = '' }: MobileListProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {children}
    </div>
  )
}

interface MobileListItemProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  showArrow?: boolean
}

export function MobileListItem({ 
  children, 
  className = '', 
  onClick, 
  showArrow = false 
}: MobileListItemProps) {
  return (
    <motion.div
      className={`
        bg-card border rounded-lg p-4
        ${onClick ? 'cursor-pointer active:scale-95' : ''}
        touch-manipulation
        ${className}
      `}
      whileHover={onClick ? { scale: 1.01 } : {}}
      whileTap={onClick ? { scale: 0.99 } : {}}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {children}
        </div>
        {showArrow && (
          <div className="text-muted-foreground ml-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>
    </motion.div>
  )
}

interface MobileSectionProps {
  title: string
  children: ReactNode
  className?: string
}

export function MobileSection({ title, children, className = '' }: MobileSectionProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="text-lg font-semibold text-foreground mb-3 px-1">
        {title}
      </h2>
      {children}
    </div>
  )
}