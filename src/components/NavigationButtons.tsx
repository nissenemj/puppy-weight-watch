import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Info, 
  Scale, 
  Dog, 
  Menu,
  X,
  Book,
  Calculator,
  Home
} from 'lucide-react'

const NavigationButtons: React.FC = () => {
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
      {/* Floating Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 mobile-optimized mobile-touch-target ${
          scrolled ? 'top-2 scale-95' : 'top-4'
        }`}
      >
        <div className="glass rounded-full px-2 py-2 shadow-lg">
          <div className="flex items-center gap-1">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-300"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center"
              >
                <Dog className="w-4 h-4 text-white" />
              </motion.div>
              <span className="hidden sm:block font-bold text-gray-800">Pentulaskuri</span>
            </Link>

            <div className="w-px h-6 bg-white/30 mx-2 hidden sm:block"></div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.slice(1).map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`relative px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 hover-3d ${
                      isActive(item.href)
                        ? 'bg-gradient-primary text-white shadow-lg'
                        : 'text-gray-700 hover:bg-white/20'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    
                    {isActive(item.href) && (
                      <motion.div
                        layoutId="activeNavItem"
                        className="absolute inset-0 bg-gradient-primary rounded-full -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <motion.button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-full hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </motion.button>
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
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] mobile-menu-panel border-l border-white/20 shadow-2xl z-[101]"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Dog className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-white">Pentulaskuri</h2>
                      <p className="text-xs text-gray-300">Pentukoiran seuranta</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5 text-gray-300" />
                  </motion.button>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-2">
                    {navItems.map((item, index) => {
                      const Icon = item.icon
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                        >
                          <Link
                            to={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${
                              isActive(item.href)
                                ? 'bg-gradient-primary text-white shadow-lg hover:shadow-xl'
                                : 'hover:bg-white/10 text-white'
                            }`}
                          >
                            <div className={`p-2 rounded-xl ${
                              isActive(item.href) 
                                ? 'bg-white/20' 
                                : 'bg-white/10'
                            }`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="font-medium">{item.label}</span>
                            </div>
                          </Link>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default NavigationButtons