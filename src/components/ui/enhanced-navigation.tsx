import * as React from "react"
import { useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { AutoBreadcrumb, BreadcrumbMobile } from "./breadcrumb"
import Navigation from "../Navigation"

interface EnhancedNavigationProps {
  className?: string
  showBreadcrumbs?: boolean
  sticky?: boolean
  children?: React.ReactNode
}

export const EnhancedNavigation = React.forwardRef<
  HTMLDivElement,
  EnhancedNavigationProps
>(({ className, showBreadcrumbs = true, sticky = false, children, ...props }, ref) => {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const location = useLocation()

  // Track scroll position for sticky nav styling
  React.useEffect(() => {
    if (!sticky) return

    const handleScroll = () => {
      const scrolled = window.scrollY > 10
      setIsScrolled(scrolled)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sticky])

  // Don't show breadcrumbs on home page
  const showBreadcrumbsForRoute = showBreadcrumbs && location.pathname !== '/'

  return (
    <div
      ref={ref}
      className={cn(
        "w-full",
        className
      )}
      {...props}
    >
      {/* Main Navigation */}
      <div className={cn(
        "transition-all duration-200",
        sticky && "backdrop-blur-md bg-white/95 dark:bg-gray-900/95",
        sticky && isScrolled && "border-b border-gray-200 dark:border-gray-800"
      )}>
        <Navigation />
        {children}
      </div>

      {/* Breadcrumbs */}
      {showBreadcrumbsForRoute && (
        <div className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="container mx-auto px-4">
            {/* Desktop Breadcrumbs */}
            <div className="hidden md:block">
              <AutoBreadcrumb className="breadcrumb-desktop" />
            </div>

            {/* Mobile Breadcrumbs */}
            <BreadcrumbMobile className="breadcrumb-mobile" />
          </div>
        </div>
      )}
    </div>
  )
})

EnhancedNavigation.displayName = "EnhancedNavigation"

// Hook for enhanced navigation state
export const useNavigationState = () => {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const location = useLocation()

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  return {
    isScrolled,
    isMenuOpen,
    setIsMenuOpen,
    currentPath: location.pathname
  }
}

export default EnhancedNavigation