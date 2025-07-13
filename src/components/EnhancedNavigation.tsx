import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Calculator, 
  BookOpen, 
  Database, 
  AlertTriangle, 
  Menu, 
  X,
  ChevronRight,
  Settings,
  User,
  LogOut,
  Bell
} from 'lucide-react';
import { useResponsive } from './UXOptimizations';

interface NavigationItem {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
  description?: string;
}

const navigationItems: NavigationItem[] = [
  {
    path: '/',
    label: 'Etusivu',
    icon: Home,
    description: 'Aloita pentusi seuranta'
  },
  {
    path: '/calculator',
    label: 'Laskuri',
    icon: Calculator,
    description: 'Laske ruokamäärät'
  },
  {
    path: '/info',
    label: 'Tietoa',
    icon: BookOpen,
    description: 'Lue lisää pentujen hoidosta'
  },
  {
    path: '/info/feeding-data',
    label: 'Ruokinta',
    icon: Database,
    description: 'Ruokintatiedot ja ohjeet'
  },
  {
    path: '/info/safety',
    label: 'Turvallisuus',
    icon: AlertTriangle,
    description: 'Turvallisuusohjeet'
  }
];

export const EnhancedNavigation = () => {
  const location = useLocation();
  const { isMobile } = useResponsive();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeNotifications, setActiveNotifications] = useState(0);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Simulate notifications (in real app, this would come from API)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNotifications(Math.floor(Math.random() * 3));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const currentItem = navigationItems.find(item => item.path === location.pathname);

  return (
    <>
      {/* Desktop Navigation */}
      {!isMobile && (
        <motion.nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled 
              ? 'bg-white/95 backdrop-blur-md shadow-lg' 
              : 'bg-transparent'
          }`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center"
                >
                  <span className="text-white font-bold text-lg">🐾</span>
                </motion.div>
                <span className="font-heading font-bold text-xl text-foreground">
                  Pentulaskuri
                </span>
              </Link>

              {/* Navigation Items */}
              <div className="flex items-center space-x-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <motion.div
                      key={item.path}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        to={item.path}
                        className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                          isActive
                            ? 'bg-primary text-white shadow-md'
                            : 'text-muted-foreground hover:text-foreground hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{item.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-primary rounded-lg"
                            initial={false}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Right side actions */}
              <div className="flex items-center space-x-2">
                {/* Notifications */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  {activeNotifications > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      {activeNotifications}
                    </motion.div>
                  )}
                </motion.button>

                {/* User menu */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <User className="w-5 h-5 text-muted-foreground" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.nav>
      )}

      {/* Mobile Navigation */}
      {isMobile && (
        <>
          {/* Mobile Header */}
          <motion.nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
              isScrolled 
                ? 'bg-white/95 backdrop-blur-md shadow-lg' 
                : 'bg-transparent'
            }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">🐾</span>
                  </div>
                  <span className="font-heading font-bold text-lg text-foreground">
                    Pentulaskuri
                  </span>
                </Link>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {isMenuOpen ? (
                    <X className="w-6 h-6 text-foreground" />
                  ) : (
                    <Menu className="w-6 h-6 text-foreground" />
                  )}
                </motion.button>
              </div>
            </div>
          </motion.nav>

          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setIsMenuOpen(false)}
              />
            )}
          </AnimatePresence>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-foreground">Valikko</h2>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 rounded-lg hover:bg-gray-100"
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
                  </div>

                  <div className="space-y-2">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      
                      return (
                        <motion.div
                          key={item.path}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Link
                            to={item.path}
                            className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                              isActive
                                ? 'bg-primary text-white'
                                : 'text-muted-foreground hover:text-foreground hover:bg-gray-100'
                            }`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Icon className="w-5 h-5" />
                            <div className="flex-1">
                              <div className="font-medium">{item.label}</div>
                              {item.description && (
                                <div className="text-xs opacity-75">{item.description}</div>
                              )}
                            </div>
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="space-y-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center space-x-3 p-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-gray-100 w-full"
                      >
                        <Settings className="w-5 h-5" />
                        <span>Asetukset</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center space-x-3 p-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-gray-100 w-full"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Kirjaudu ulos</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Breadcrumbs */}
      {currentItem && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 py-2 mt-16"
        >
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Etusivu
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">{currentItem.label}</span>
          </nav>
        </motion.div>
      )}
    </>
  );
};