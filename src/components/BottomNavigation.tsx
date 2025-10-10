import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Scale, Book, Calculator, Menu, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  ariaLabel: string;
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
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ onMenuClick }) => {
  const location = useLocation();

  const isActive = useMemo(
    () => (path: string) => {
      if (path === '/') {
        return location.pathname === '/';
      }
      return location.pathname === path || location.pathname.startsWith(`${path}/`);
    },
    [location.pathname],
  );

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-brand-orange/20 bg-white/95 backdrop-blur-md safe-area-padding-bottom md:hidden"
      role="navigation"
      aria-label="Päänavigaatio"
    >
      <div className="grid grid-cols-5 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex min-h-[56px] touch-target flex-col items-center justify-center gap-1 px-2 py-2 text-xs font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-inset',
                active
                  ? 'text-brand-orange'
                  : 'text-brand-ink/60 hover:text-brand-ink/80 active:scale-95',
              )}
              aria-label={item.ariaLabel}
              aria-current={active ? 'page' : undefined}
            >
              <Icon
                className={cn(
                  'h-5 w-5 transition-transform duration-200',
                  active && 'scale-110',
                )}
                aria-hidden={true}
              />
              <span className={cn('transition-colors', active && 'font-semibold')}>
                {item.label}
              </span>
            </Link>
          );
        })}
        <button
          onClick={onMenuClick}
          className="flex min-h-[56px] touch-target flex-col items-center justify-center gap-1 px-2 py-2 text-xs font-medium text-brand-ink/60 transition-all duration-200 hover:text-brand-ink/80 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-inset"
          aria-label="Avaa valikko"
        >
          <Menu className="h-5 w-5" aria-hidden={true} />
          <span>Valikko</span>
        </button>
      </div>
    </nav>
  );
};
