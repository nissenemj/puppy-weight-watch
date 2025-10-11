import React, { useMemo, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Scale, Book, Calculator, Menu, type LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  ariaLabel: string;
  badge?: number | string;
}

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Koti',
    icon: Home,
    ariaLabel: 'Siirry etusivulle',
  },
  {
    href: '/weight-tracker',
    label: 'Paino',
    icon: Scale,
    ariaLabel: 'Siirry painonseurantaan',
  },
  {
    href: '/puppy-book',
    label: 'Kirja',
    icon: Book,
    ariaLabel: 'Siirry pentukirjaan',
  },
  {
    href: '/calculator',
    label: 'Laskuri',
    icon: Calculator,
    ariaLabel: 'Siirry ruokalaskuriin',
  },
];

interface BottomNavigationProps {
  onMenuClick?: () => void;
  badges?: Record<string, number | string>;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ onMenuClick, badges = {} }) => {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  const isActive = useMemo(
    () => (path: string) => {
      if (path === '/') {
        return location.pathname === '/';
      }
      return location.pathname === path || location.pathname.startsWith(`${path}/`);
    },
    [location.pathname],
  );

  // Update active index for indicator animation
  useEffect(() => {
    setMounted(true);
    const index = navItems.findIndex((item) => isActive(item.href));
    if (index !== -1) {
      setActiveIndex(index);
    }
  }, [location.pathname, isActive]);

  // Haptic feedback on tab change
  const handleTabClick = (e: React.MouseEvent) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const indicatorWidth = 100 / 5; // 5 items total (4 nav items + 1 menu button)
  const indicatorOffset = activeIndex * indicatorWidth;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-brand-orange/20 bg-white/95 backdrop-blur-md safe-area-padding-bottom md:hidden"
      role="navigation"
      aria-label="Päänavigaatio"
    >
      {/* Active indicator bar */}
      {mounted && (
        <motion.div
          className="absolute top-0 h-0.5 bg-brand-orange"
          initial={false}
          animate={{
            left: `${indicatorOffset}%`,
            width: `${indicatorWidth}%`,
          }}
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 30
          }}
        />
      )}

      <div className="grid grid-cols-5 items-center">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          const badge = badges[item.href];

          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={handleTabClick}
              className={cn(
                'relative flex min-h-[56px] touch-target flex-col items-center justify-center gap-1 px-2 py-2 text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/60 focus-visible:ring-offset-2',
                active
                  ? 'text-brand-orange scale-105'
                  : 'text-brand-ink/60 hover:text-brand-orange/80 hover:scale-105 active:scale-95',
              )}
              aria-label={item.ariaLabel}
              aria-current={active ? 'page' : undefined}
            >
              <div className="relative">
                <motion.div
                  animate={{
                    scale: active ? 1.1 : 1,
                    rotate: active ? [0, -10, 10, 0] : 0,
                  }}
                  transition={{
                    scale: { type: "spring", stiffness: 400, damping: 17 },
                    rotate: { duration: 0.3 }
                  }}
                >
                  <Icon
                    className="h-5 w-5 transition-all duration-200"
                    aria-hidden={true}
                  />
                </motion.div>

                {/* Badge indicator */}
                <AnimatePresence>
                  {badge && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                      className="absolute -right-2 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--color-error)] px-1 text-[10px] font-bold text-white shadow-md"
                      aria-label={`${badge} uutta`}
                    >
                      {typeof badge === 'number' && badge > 99 ? '99+' : badge}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <motion.span
                className="transition-all"
                animate={{
                  fontWeight: active ? 600 : 500,
                  scale: active ? 1.05 : 1
                }}
                transition={{ duration: 0.2 }}
              >
                {item.label}
              </motion.span>
            </Link>
          );
        })}
        <button
          onClick={(e) => {
            handleTabClick(e);
            onMenuClick?.();
          }}
          className="flex min-h-[56px] touch-target flex-col items-center justify-center gap-1 px-2 py-2 text-xs font-medium text-brand-ink/60 transition-all duration-200 hover:text-brand-orange/80 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/60 focus-visible:ring-offset-2"
          aria-label="Avaa valikko"
        >
          <Menu className="h-5 w-5" aria-hidden={true} />
          <span>Valikko</span>
        </button>
      </div>
    </nav>
  );
};
