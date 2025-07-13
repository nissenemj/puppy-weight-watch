import { ReactNode, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SkipLinkProps {
  href: string
  children: ReactNode
  className?: string
}

export function SkipLink({ href, children, className = '' }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={`
        absolute -top-10 left-6 z-50 px-4 py-2 bg-primary text-primary-foreground rounded-md
        focus:top-4 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        transition-all duration-200
        ${className}
      `}
    >
      {children}
    </a>
  )
}

interface FocusTrapProps {
  children: ReactNode
  isActive?: boolean
}

export function FocusTrap({ children, isActive = false }: FocusTrapProps) {
  useEffect(() => {
    if (!isActive) return

    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    const firstFocusableElement = document.querySelector(focusableElements) as HTMLElement
    const focusableContent = document.querySelectorAll(focusableElements)
    const lastFocusableElement = focusableContent[focusableContent.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus()
            e.preventDefault()
          }
        }
      }
    }

    document.addEventListener('keydown', handleTabKey)
    return () => document.removeEventListener('keydown', handleTabKey)
  }, [isActive])

  return <>{children}</>
}

interface ScreenReaderOnlyProps {
  children: ReactNode
}

export function ScreenReaderOnly({ children }: ScreenReaderOnlyProps) {
  return (
    <span className="sr-only">
      {children}
    </span>
  )
}

interface LiveRegionProps {
  children: ReactNode
  ariaLive?: 'polite' | 'assertive' | 'off'
  className?: string
}

export function LiveRegion({ children, ariaLive = 'polite', className = '' }: LiveRegionProps) {
  return (
    <div
      aria-live={ariaLive}
      aria-atomic="true"
      className={`sr-only ${className}`}
    >
      {children}
    </div>
  )
}

interface HighContrastToggleProps {
  isEnabled: boolean
  onToggle: (enabled: boolean) => void
}

export function HighContrastToggle({ isEnabled, onToggle }: HighContrastToggleProps) {
  return (
    <button
      onClick={() => onToggle(!isEnabled)}
      className={`
        p-2 rounded-md border transition-colors
        ${isEnabled 
          ? 'bg-primary text-primary-foreground border-primary' 
          : 'bg-background text-foreground border-border hover:bg-muted'
        }
      `}
      aria-pressed={isEnabled}
      aria-label="Vaihda korkea kontrasti"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
      </svg>
    </button>
  )
}

interface FontSizeToggleProps {
  currentSize: 'small' | 'medium' | 'large'
  onSizeChange: (size: 'small' | 'medium' | 'large') => void
}

export function FontSizeToggle({ currentSize, onSizeChange }: FontSizeToggleProps) {
  const sizes = [
    { key: 'small' as const, label: 'Pieni', icon: 'A' },
    { key: 'medium' as const, label: 'Normaali', icon: 'A' },
    { key: 'large' as const, label: 'Suuri', icon: 'A' }
  ]

  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-md">
      {sizes.map((size) => (
        <button
          key={size.key}
          onClick={() => onSizeChange(size.key)}
          className={`
            px-2 py-1 rounded text-xs font-medium transition-colors
            ${currentSize === size.key
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
            }
          `}
          aria-label={`Vaihda fonttikoko: ${size.label}`}
          aria-pressed={currentSize === size.key}
        >
          <span className={`
            ${size.key === 'small' ? 'text-xs' : ''}
            ${size.key === 'medium' ? 'text-sm' : ''}
            ${size.key === 'large' ? 'text-base' : ''}
          `}>
            {size.icon}
          </span>
        </button>
      ))}
    </div>
  )
}

interface AccessibilityMenuProps {
  isOpen: boolean
  onClose: () => void
  onHighContrastToggle: (enabled: boolean) => void
  onFontSizeChange: (size: 'small' | 'medium' | 'large') => void
  highContrastEnabled: boolean
  currentFontSize: 'small' | 'medium' | 'large'
}

export function AccessibilityMenu({
  isOpen,
  onClose,
  onHighContrastToggle,
  onFontSizeChange,
  highContrastEnabled,
  currentFontSize
}: AccessibilityMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          
          {/* Menu */}
          <motion.div
            className="relative bg-background border rounded-t-xl sm:rounded-xl p-6 w-full max-w-sm mx-4 mb-4 sm:mb-0"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Saavutettavuus</h2>
              <button
                onClick={onClose}
                className="p-1 rounded-md hover:bg-muted"
                aria-label="Sulje saavutettavuusvalikko"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Fonttikoko</label>
                <FontSizeToggle
                  currentSize={currentFontSize}
                  onSizeChange={onFontSizeChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Korkea kontrasti</label>
                <HighContrastToggle
                  isEnabled={highContrastEnabled}
                  onToggle={onHighContrastToggle}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}