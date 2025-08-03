/**
 * Enhanced Mobile Navigation Component
 * Optimized for touch interaction and mobile UX
 */
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  X, 
  Home,
  Scale,
  Book,
  Calculator,
  Info,
  Settings,
  User,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTouchGestures } from '@/utils/TouchGestureHandler';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  badge?: string;
}

const mainNavItems: NavigationItem[] = [
  { href: '/', label: 'Etusivu', icon: Home, description: 'Aloita tästä' },
  { href: '/weight-tracker', label: 'Painonseuranta', icon: Scale, description: 'Seuraa kasvua' },
  { href: '/puppy-book', label: 'Pentukirja', icon: Book, description: 'Muistoja ja virstanpylväitä' },
  { href: '/calculator', label: 'Ruokalaskuri', icon: Calculator, description: 'Laske ruokamäärä' },
  { href: '/info', label: 'Tietopankki', icon: Info, description: 'Hyödyllistä tietoa' },
];

const bottomNavItems: NavigationItem[] = [
  { href: '/', label: 'Koti', icon: Home },
  { href: '/weight-tracker', label: 'Paino', icon: Scale },
  { href: '/puppy-book', label: 'Kirja', icon: Book },
  { href: '/calculator', label: 'Laskuri', icon: Calculator },
];

export function EnhancedMobileNavigation() {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sheetContentRef = useRef<HTMLDivElement>(null);

  // Touch gesture support for navigation
  const gestureHandler = useTouchGestures(sheetContentRef, {
    swipeThreshold: 80,
    velocityThreshold: 0.5
  });

  useEffect(() => {
    if (gestureHandler) {
      gestureHandler.onSwipe = (gesture) => {
        if (gesture.direction === 'right' && isOpen) {
          setIsOpen(false);
        }
      };
    }
  }, [gestureHandler, isOpen]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (href: string) => {
    setIsOpen(false);
    setActiveSection(null);
  };

  // Desktop navigation (horizontal)
  if (!isMobile) {
    return (
      <nav className="hidden md:flex items-center space-x-1 bg-background/95 backdrop-blur-sm">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isActive(item.href)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground'
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  // Mobile navigation
  return (
    <>
      {/* Mobile hamburger navigation */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 h-auto touch-manipulation"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          
          <SheetContent 
            ref={sheetContentRef}
            side="left" 
            className="w-80 p-0 bg-background/95 backdrop-blur-sm"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">
                  {activeSection ? (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveSection(null)}
                        className="p-1 h-auto"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                      {activeSection}
                    </div>
                  ) : (
                    'Navigaatio'
                  )}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="p-1 h-auto"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Navigation content */}
              <div className="flex-1 overflow-y-auto">
                {!activeSection ? (
                  <div className="p-4 space-y-2">
                    {/* Main navigation */}
                    <div className="space-y-1">
                      {mainNavItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => handleNavigation(item.href)}
                            className={cn(
                              'flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors touch-manipulation',
                              'hover:bg-accent hover:text-accent-foreground',
                              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                              'min-h-[56px]', // Touch-friendly height
                              isActive(item.href)
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-foreground hover:bg-muted'
                            )}
                          >
                            <Icon className="w-5 h-5 shrink-0" />
                            <div className="flex-1">
                              <div className="font-medium">{item.label}</div>
                              {item.description && (
                                <div className="text-xs text-muted-foreground mt-0.5">
                                  {item.description}
                                </div>
                              )}
                            </div>
                            {item.badge && (
                              <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                                {item.badge}
                              </span>
                            )}
                            <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground" />
                          </Link>
                        );
                      })}
                    </div>

                    {/* Settings section */}
                    <div className="pt-4 mt-4 border-t border-border">
                      <button
                        onClick={() => setActiveSection('Asetukset')}
                        className="flex items-center gap-3 p-3 w-full rounded-xl text-sm font-medium transition-colors touch-manipulation hover:bg-muted min-h-[56px]"
                      >
                        <Settings className="w-5 h-5 shrink-0" />
                        <span className="flex-1 text-left">Asetukset</span>
                        <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground" />
                      </button>
                      
                      <button
                        onClick={() => setActiveSection('Profiili')}
                        className="flex items-center gap-3 p-3 w-full rounded-xl text-sm font-medium transition-colors touch-manipulation hover:bg-muted min-h-[56px]"
                      >
                        <User className="w-5 h-5 shrink-0" />
                        <span className="flex-1 text-left">Profiili</span>
                        <ChevronRight className="w-4 h-4 shrink-0 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="text-sm text-muted-foreground">
                      {activeSection} -osiossa ei ole vielä sisältöä.
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border">
                <div className="text-xs text-muted-foreground text-center">
                  Pentulaskuri v1.0
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Bottom navigation for mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border md:hidden">
        <div className="flex items-center justify-around px-2 py-2 safe-area-padding-bottom">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium transition-colors touch-manipulation',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  'min-h-[56px] min-w-[56px]', // Touch-friendly size
                  isActive(item.href)
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                <Icon className={cn(
                  'w-5 h-5 transition-transform',
                  isActive(item.href) && 'scale-110'
                )} />
                <span className={cn(
                  'transition-colors',
                  isActive(item.href) && 'font-semibold'
                )}>
                  {item.label}
                </span>
                {isActive(item.href) && (
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Spacer for bottom navigation */}
      <div className="h-20 md:hidden" />
    </>
  );
}