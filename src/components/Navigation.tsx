import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Info, 
  Scale, 
  Dog, 
  ShieldCheck,
  Menu,
  X,
  MoreHorizontal,
  UtensilsCrossed,
  Database,
  Book,
  Calculator,
  Home,
  TrendingUp
} from '@/utils/iconImports'
import { Sparkles } from 'lucide-react'
import { componentAnimations, hoverAnimations } from '@/animations'

const Navigation = () => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Navigation items
  const navItems = [
    { href: '/', icon: Home, label: 'Koti' },
    { href: '/weight-tracker', icon: Scale, label: 'Paino' },
    { href: '/calculator', icon: Calculator, label: 'Laskuri' },
    { href: '/puppy-book', icon: Book, label: 'Kirja' },
    { href: '/info', icon: Info, label: 'Info' }
  ]

  return (
    <>
      {/* Skip to content link */}
      <a 
        href="#main-content"
        className="skip-link fixed left-[-9999px] top-4 z-[2000] glass px-4 py-2 rounded-xl focus:left-4 transition-all duration-300 text-gray-800 font-medium"
      >
        Siirry suoraan sisältöön
      </a>

      {/* Floating Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] transition-all duration-500 mobile-optimized mobile-touch-target ${
          scrolled ? 'top-2 scale-95' : 'top-4'
        }`}
      >
        <div className="glass-nav rounded-2xl px-3 py-3 shadow-xl">
          <div className="flex items-center gap-2">
            {/* Logo */}
            <motion.div
              whileHover={hoverAnimations.scale.whileHover}
              whileTap={hoverAnimations.scale.whileTap}
            >
              <Link 
                to="/" 
                className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-white/20 transition-all duration-200"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="w-10 h-10 bg-[var(--color-accent)] rounded-xl flex items-center justify-center shadow-md"
                >
                  <Dog className="w-5 h-5 text-white" />
                </motion.div>
                <span className="hidden sm:block text-h6 font-semibold text-[var(--color-text)]">Pentulaskuri</span>
              </Link>
            </motion.div>

            <div className="w-px h-6 bg-gray-300 mx-2 hidden sm:block"></div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.slice(1).map((item) => {
                const Icon = item.icon
                const isItemActive = isActive(item.href)
                return (
                  <motion.div
                    key={item.href}
                    whileHover={hoverAnimations.lift.whileHover}
                    whileTap={hoverAnimations.lift.whileTap}
                  >
                    <Link
                      to={item.href}
                      className={`relative px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                        isItemActive
                          ? 'bg-[var(--color-accent)] text-white shadow-lg'
                          : 'text-[var(--color-text)] hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-body-sm font-medium">{item.label}</span>
                      
                      {isItemActive && (
                        <motion.div
                          layoutId="activeNavItem"
                          className="absolute inset-0 bg-[var(--color-accent)] rounded-xl -z-10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(true)}
                className="rounded-xl"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150]"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white/95 backdrop-blur-xl border-l border-white/30 z-[151] p-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Dog className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">Pentulaskuri</h3>
                    <p className="text-gray-600 text-sm">Koiran kasvun seuranta</p>
                  </div>
                </div>
                
                <motion.button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5 text-gray-700" />
                </motion.button>
              </div>

              {/* Navigation Items */}
              <div className="space-y-2">
                {navItems.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl font-medium transition-all duration-300 ${
                          isActive(item.href)
                            ? 'bg-gradient-primary text-white shadow-lg'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-lg">{item.label}</span>
                        
                        {isActive(item.href) && (
                          <motion.div
                            className="ml-auto flex items-center gap-1"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Sparkles className="w-4 h-4" />
                          </motion.div>
                        )}
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              {/* Footer */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-gray-50 rounded-2xl p-4 text-center">
                  <p className="text-gray-600 text-sm">
                    Modernilla designilla
                  </p>
                  <p className="text-gray-800 font-medium">
                    Hellodani.co-inspiraatio
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile body lock */}
      {isMobileMenuOpen && (
        <style>{`
          body {
            overflow: hidden;
          }
        `}</style>
      )}
    </>
  )
}

export default Navigation