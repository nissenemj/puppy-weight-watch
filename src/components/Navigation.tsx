import React, { createContext, useContext, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useInRouterContext } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Menu, PawPrint, Scale, Calculator, Book, Info, Home, LogOut, PlusCircle, Dog, ChevronDown, Check, Cloud } from 'lucide-react';
import { BottomNavigation } from './BottomNavigation';
import { useUser } from '@/contexts/UserContext';
import { useDog } from '@/contexts/DogContext';
import { useGuestAuth } from '@/contexts/GuestAuthContext';

const NavigationContext = createContext(false);

interface PrimaryLink {
  href: string;
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const primaryLinks: PrimaryLink[] = [
  {
    href: '/weight-tracker',
    title: 'Painonseuranta',
    description: 'Kirjaa mittaukset ja seuraa kasvua',
    icon: Scale,
  },
  {
    href: '/calculator',
    title: 'Ruokalaskuri',
    description: 'Laske sopivat annoskoot',
    icon: Calculator,
  },
  {
    href: '/puppy-book',
    title: 'Pentukirja',
    description: 'Tallenna muistot ja milestone-tapahtumat',
    icon: Book,
  },
  {
    href: '/guides',
    title: 'Tietopankki',
    description: 'Oppaat, artikkelit ja vinkit',
    icon: Info,
  },
];

const NavigationWithRouter: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Use global contexts instead of local state
  const { user, isAuthenticated } = useUser();
  const { activeDog, dogs, loading: dogLoading, setActiveDog } = useDog();
  const { isGuest, guestWeightEntries } = useGuestAuth();

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = useMemo(
    () => (path: string) => {
      if (path === '/') {
        return location.pathname === '/';
      }
      return location.pathname === path || location.pathname.startsWith(`${path}/`);
    },
    [location.pathname],
  );

  const initials = user?.email?.slice(0, 1).toUpperCase() ?? 'P';
  const activeDogName = activeDog?.name ?? null;

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: 'Uloskirjautuminen epäonnistui', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Uloskirjauduttu', description: 'Tervetuloa takaisin milloin tahansa!' });
    navigate('/');
  };

  const renderPrimaryNav = (className?: string) => (
    <ul className={cn('flex shrink-0 items-center gap-1 whitespace-nowrap', className)}>
      <li>
        <Link
          to="/"
          className={cn(
            'flex min-h-11 items-center rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500/60 focus-visible:ring-offset-2',
            isActive('/') ? 'bg-terracotta-500 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900',
          )}
          aria-current={isActive('/') ? 'page' : undefined}
        >
          Koti
        </Link>
      </li>
      {primaryLinks.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <li key={item.href}>
            <Link
              to={item.href}
              className={cn(
                'flex min-h-11 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500/60 focus-visible:ring-offset-2',
                active ? 'bg-white text-stone-900 shadow-sm border border-stone-200' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className={cn("h-4 w-4 shrink-0", active ? "text-terracotta-500" : "text-stone-400")} aria-hidden="true" />
              <span>{item.title}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const renderDogSelector = () => {
    // Only show if authenticated and has dogs
    if (!isAuthenticated || dogs.length === 0) return null;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex max-w-40 items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-stone-100 rounded-xl"
            aria-label={`Aktiivinen koira: ${activeDog?.name || 'Ei valittu'}`}
          >
            <Dog className="h-4 w-4 shrink-0 text-terracotta-500" />
            <span className="min-w-0 max-w-24 truncate text-stone-700">
              {activeDog?.name || 'Valitse koira'}
            </span>
            <ChevronDown className="h-3 w-3 shrink-0 text-stone-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="z-[300] w-56 max-w-[calc(100vw-2rem)]">
          <DropdownMenuLabel>Koirat</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {dogs.map((dog) => (
            <DropdownMenuItem
              key={dog.id}
              onClick={() => setActiveDog(dog)}
              className="flex items-center justify-between cursor-pointer"
            >
              <span className="min-w-0 break-words">{dog.name}</span>
              {dog.id === activeDog?.id && (
                <Check className="h-4 w-4 text-terracotta-500" />
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/onboarding" className="flex items-center gap-2 cursor-pointer">
              <PlusCircle className="h-4 w-4" />
              <span>Lisää uusi koira</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // Guest mode indicator - shows when user has guest data but isn't logged in
  const renderGuestIndicator = () => {
    // Only show if guest mode with data
    if (!isGuest || guestWeightEntries.length === 0) return null;

    return (
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs">
        <Cloud className="h-3 w-3 text-amber-600" />
        <span className="text-amber-700 font-medium">Vierastila</span>
        <span className="text-amber-600">({guestWeightEntries.length} mittausta)</span>
        <Link
          to="/login"
          className="text-amber-700 hover:text-amber-900 font-semibold ml-1 hover:underline"
        >
          Tallenna →
        </Link>
      </div>
    );
  };

  const renderAuthActions = () => {
    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-11 w-11 shrink-0 rounded-xl p-0 hover:bg-stone-100"
              aria-label="Käyttäjävalikko - Avaa käyttäjän asetukset"
            >
              <Avatar className="h-9 w-9 border border-stone-200">
                <AvatarFallback className="bg-terracotta-100 text-terracotta-700">{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="z-[300] w-64 max-w-[calc(100vw-2rem)]" role="menu" aria-label="Käyttäjän valikko">
            <DropdownMenuLabel>
              Tilin asetukset
              <span className="block break-all text-xs font-normal text-stone-600">{user.email}</span>
              <span className="block break-words text-xs font-normal text-stone-500">
                {dogLoading ? 'Haetaan pentua...' : activeDogName ? `Pentu: ${activeDogName}` : 'Ei pentuprofiilia'}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/weight-tracker" role="menuitem">Hallinnoi painonseurantaa</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/puppy-book" role="menuitem">Pentukirja</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/onboarding" role="menuitem">Lisää/valitse pentu</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleSignOut} className="text-red-600 focus:text-red-600" role="menuitem">
              <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
              Kirjaudu ulos
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return (
      <Button asChild variant="outline" className="shrink-0 border-terracotta-500 text-terracotta-600 hover:bg-terracotta-50">
        <Link to="/login">{isGuest && guestWeightEntries.length > 0 ? 'Tallenna mittaukset' : 'Kirjaudu / Luo profiili'}</Link>
      </Button>
    );
  };

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[110] focus:rounded-xl focus:bg-terracotta-500 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:ring-offset-2"
      >
        Siirry sisältöön
      </a>

      <header
        className="fixed left-0 right-0 top-0 z-[100] h-16 md:h-20 md:px-4"
        role="banner"
        style={{ contain: 'layout' }}
      >
        <nav
          role="navigation"
          aria-label="Päänavigaatio"
          className={cn(
            'mx-auto flex h-16 w-full max-w-full items-center justify-between gap-2 rounded-b-2xl border-b border-white/40 bg-white/95 px-4 shadow-sm backdrop-blur-md md:mt-2 md:max-w-2xl md:rounded-2xl md:border lg:max-w-4xl xl:max-w-5xl',
          )}
        >
          <Link to="/" aria-label="Pentulaskuri, etusivu" className="flex min-h-11 shrink-0 items-center gap-2 rounded-xl py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500/60 focus-visible:ring-offset-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-terracotta-500 text-white shadow-sm" aria-hidden="true">
              <PawPrint className="h-5 w-5" />
            </span>
            <span className="whitespace-nowrap text-sm font-serif font-bold text-stone-900">Pentulaskuri</span>
          </Link>

          <div className="hidden min-w-0 xl:flex" role="navigation" aria-label="Sivulinkit">
            {renderPrimaryNav()}
          </div>

          <div className="hidden shrink-0 items-center gap-2 xl:flex">
            {renderDogSelector()}
            {renderAuthActions()}
          </div>

          <div className="flex shrink-0 items-center gap-2 xl:hidden">
            <div className="hidden sm:block">{renderAuthActions()}</div>
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-stone-200 p-0"
                  aria-expanded={isMobileOpen}
                  aria-controls="mobile-menu"
                >
                  <Menu className="h-5 w-5 text-stone-600" />
                  <span className="sr-only">Avaa valikko</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                overlayClassName="z-[200]"
                className="h-dvh w-full max-w-sm overflow-y-auto overscroll-contain bg-stone-50 px-0 pb-[max(1.5rem,env(safe-area-inset-bottom))] z-[250]"
                id="mobile-menu"
              >
                <SheetHeader className="px-6 pb-4 pt-8 text-left border-b border-stone-100">
                  <SheetTitle className="flex items-center gap-3 text-stone-900 font-serif">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-terracotta-500 text-white" aria-hidden="true">
                      <PawPrint className="h-5 w-5" />
                    </span>
                    Pentulaskuri
                  </SheetTitle>
                  <SheetDescription>Valitse sivu tai hallinnoi profiiliasi.</SheetDescription>
                </SheetHeader>
                <div className="space-y-4 px-6 py-6">
                  {renderGuestIndicator()}
                  {user ? (
                    <div className="rounded-xl border border-terracotta-200 bg-terracotta-50 p-4">
                      <p className="break-all text-sm font-medium text-stone-900">{user.email}</p>
                      <p className="break-words text-xs text-stone-500">
                        {dogLoading ? 'Haetaan pentua...' : activeDogName ? `Viimeksi katsottu pentu: ${activeDogName}` : 'Lisää pentuprofiili aloittaaksesi'}
                      </p>
                      {renderDogSelector()}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-stone-200 bg-white p-4 text-sm text-stone-600 shadow-sm">
                      <p className="font-semibold text-stone-900 mb-1">Uusi käyttäjä?</p>
                      <p>Luo ilmainen profiili ja aloita pentusi kasvun seuranta.</p>
                    </div>
                  )}

                  <nav aria-label="Päävalikko" className="space-y-2">
                    <Link
                      to="/"
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                        isActive('/') ? 'bg-terracotta-500 text-white shadow-sm' : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-100',
                      )}
                      aria-current={isActive('/') ? 'page' : undefined}
                    >
                      <Home className="h-4 w-4" /> Etusivu
                    </Link>
                    <Separator className="my-2" />
                    {primaryLinks.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setIsMobileOpen(false)}
                          className={cn(
                            'flex flex-col gap-1 rounded-xl px-4 py-3 text-left transition-all duration-200 border',
                            active ? 'bg-white text-stone-900 border-stone-200 shadow-sm' : 'bg-transparent border-transparent hover:bg-stone-100',
                          )}
                          aria-current={active ? 'page' : undefined}
                        >
                          <span className="flex items-center gap-2 text-sm font-semibold">
                            <Icon className={cn("h-4 w-4", active ? "text-terracotta-500" : "text-stone-400")} aria-hidden="true" />
                            {item.title}
                          </span>
                          <span className="text-xs text-stone-500">{item.description}</span>
                        </Link>
                      );
                    })}
                  </nav>

                  <div className="space-y-3 pt-4">
                    {user ? (
                      <>
                        <Button onClick={handleSignOut} variant="outline" className="w-full justify-start text-red-600 border-stone-200 hover:bg-red-50">
                          <LogOut className="mr-2 h-4 w-4" /> Kirjaudu ulos
                        </Button>
                        <Button asChild variant="secondary" className="w-full justify-start bg-sage-500 text-white hover:bg-sage-600">
                          <Link to="/onboarding" onClick={() => setIsMobileOpen(false)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Lisää pentu
                          </Link>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button asChild className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white" onClick={() => setIsMobileOpen(false)}>
                          <Link to="/login">Kirjaudu / Luo profiili</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full border-stone-200" onClick={() => setIsMobileOpen(false)}>
                          <Link to="/guides">Tutustu ominaisuuksiin</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>

      {/* Bottom Navigation for Mobile */}
      <BottomNavigation onMenuClick={() => setIsMobileOpen(true)} />

    </>
  );
};

const NavigationStatic: React.FC = () => {
  return (
    <header className="bg-white/90 shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-terracotta-500 text-white">
            <PawPrint className="h-5 w-5" />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-serif font-bold text-stone-900">Pentulaskuri</span>
            <span className="text-xs text-stone-500">Kasvun ja hyvinvoinnin seurantaan</span>
          </div>
        </div>
        <Button asChild variant="outline">
          <a href="/">Siirry sovellukseen</a>
        </Button>
      </div>
    </header>
  );
};

export const Navigation: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const hasParentNavigation = useContext(NavigationContext);
  const inRouter = useInRouterContext();

  // The shared layout owns navigation, including on pages with a legacy Navigation call.
  if (hasParentNavigation) return <>{children}</>;

  return (
    <>
      {inRouter ? <NavigationWithRouter /> : <NavigationStatic />}
      <NavigationContext.Provider value={true}>{children}</NavigationContext.Provider>
    </>
  );
};
