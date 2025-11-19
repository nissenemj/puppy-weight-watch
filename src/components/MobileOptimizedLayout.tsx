import { ReactNode, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MobileOptimizedLayoutProps {
  children: ReactNode
  className?: string
  showFloatingAction?: boolean
  onFloatingActionClick?: () => void
  floatingActionIcon?: ReactNode
  floatingActionLabel?: string
  enableKeyboardHandling?: boolean
  enableSafeAreas?: boolean
  withBottomNav?: boolean
}

// Hook for detecting virtual keyboard
function useVirtualKeyboard() {
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

  useEffect(() => {
    // Modern Keyboard API
    if ('visualViewport' in window && window.visualViewport) {
      const handleResize = () => {
        const viewport = window.visualViewport!
        const keyboardHeight = window.innerHeight - viewport.height

        setKeyboardHeight(keyboardHeight)
        setIsKeyboardVisible(keyboardHeight > 100) // Threshold for keyboard detection
      }

      window.visualViewport.addEventListener('resize', handleResize)
      window.visualViewport.addEventListener('scroll', handleResize)

      return () => {
        window.visualViewport?.removeEventListener('resize', handleResize)
        window.visualViewport?.removeEventListener('scroll', handleResize)
      }
    } else {
      // Fallback for older browsers
      const handleFocus = () => setIsKeyboardVisible(true)
      const handleBlur = () => setIsKeyboardVisible(false)

      window.addEventListener('focusin', handleFocus)
      window.addEventListener('focusout', handleBlur)

      return () => {
        window.removeEventListener('focusin', handleFocus)
        window.removeEventListener('focusout', handleBlur)
      }
    }
  }, [])

  return { keyboardHeight, isKeyboardVisible }
}

export function MobileOptimizedLayout({
  children,
  className = '',
  showFloatingAction = false,
  onFloatingActionClick,
  floatingActionIcon,
  floatingActionLabel = 'Lisää',
  enableKeyboardHandling = true,
  enableSafeAreas = true,
  withBottomNav = true // Default to true as most pages will have it
}: MobileOptimizedLayoutProps) {
  const { keyboardHeight, isKeyboardVisible } = useVirtualKeyboard()

  return (
    <div
      className={`
        min-h-screen bg-background 
        ${enableSafeAreas ? 'pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]' : ''}
        ${className}
      `}
      style={{
        paddingBottom: enableKeyboardHandling && isKeyboardVisible
          ? keyboardHeight
          : withBottomNav
            ? 'calc(4rem + env(safe-area-inset-bottom))' // 4rem (64px) for bottom nav + safe area
            : enableSafeAreas
              ? 'env(safe-area-inset-bottom)'
              : undefined
      }}
    >
      {children}

      {/* Floating Action Button for mobile */}
      <AnimatePresence>
        {showFloatingAction && !isKeyboardVisible && (
          <motion.button
            className="fixed w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center z-40 touch-manipulation"
            style={{
              bottom: withBottomNav
                ? `calc(4.5rem + env(safe-area-inset-bottom))` // Above bottom nav
                : `max(calc(env(safe-area-inset-bottom, 0px) + 1.5rem), 1.5rem)`,
              right: `max(env(safe-area-inset-right, 0px), 1.5rem)`
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onFloatingActionClick}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {floatingActionIcon}
            <span className="sr-only">{floatingActionLabel}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Bottom safe area spacer if no bottom nav but safe areas enabled */}
      {enableSafeAreas && !withBottomNav && (
        <div
          aria-hidden="true"
          className="h-[env(safe-area-inset-bottom)] w-full"
        />
      )}
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

// Export the hook for external use
export { useVirtualKeyboard }