import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useInRouterContext } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabaseClient';
import { Menu, PawPrint, Scale, Calculator, Book, Info, Home, LogOut, PlusCircle } from 'lucide-react';

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

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [activeDogName, setActiveDogName] = useState<string | null>(null);
  const [isFetchingDog, setIsFetchingDog] = useState(false);

  const isActive = useMemo(
    () => (path: string) => {
      if (path === '/') {
        return location.pathname === '/';
      }
      return location.pathname === path || location.pathname.startsWith(`${path}/`);
    },
    [location.pathname],
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;
      setUser(data.session?.user ?? null);
    };
    loadSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchActiveDog = async () => {
      if (!user) {
        setActiveDogName(null);
        return;
      }
      setIsFetchingDog(true);
      const { data, error } = await supabase
        .from('dogs')
        .select('id,name')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!error && data) {
        setActiveDogName(data.name ?? null);
      } else {
        setActiveDogName(null);
      }
      setIsFetchingDog(false);
    };
    fetchActiveDog();
  }, [user]);

  const initials = user?.email?.slice(0, 1).toUpperCase() ?? 'P';

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: 'Uloskirjautuminen ep?onnistui', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Uloskirjauduttu', description: 'Tervetuloa takaisin milloin tahansa!' });
    navigate('/');
  };

  const renderPrimaryNav = (className?: string) => (
    <ul className={cn('flex items-center gap-2', className)}>
      <li>
        <Link
          to="/"
          className={cn(
            'rounded-xl px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/60 focus-visible:ring-offset-2',
            isActive('/') ? 'bg-brand-orange text-white shadow-soft' : 'text-brand-ink/80 hover:bg-brand-orange/10',
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
                'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/60 focus-visible:ring-offset-2',
                active ? 'bg-white text-brand-ink shadow-soft' : 'text-brand-ink/80 hover:bg-white/80',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="h-4 w-4 text-brand-orange" aria-hidden="true" />
              <span>{item.title}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const renderAuthActions = () => {
    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 px-2 text-sm font-medium">
              <Avatar className="h-9 w-9 border border-brand-orange/30">
                <AvatarFallback className="bg-brand-yellow/40 text-brand-ink">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-flex flex-col text-left">
                <span className="text-sm font-semibold text-brand-ink">{user.email}</span>
                <span className="text-xs text-muted-foreground">
                  {isFetchingDog ? 'Haetaan pentua?' : activeDogName ? `Pentu: ${activeDogName}` : 'Ei pentuprofiilia'}
                </span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Tilin asetukset</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/weight-tracker">Hallinnoi painonseurantaa</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/puppy-book">Pentukirja</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/onboarding">Lis??/valitse pentu</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleSignOut} className="text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Kirjaudu ulos
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    return (
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" className="hidden sm:inline-flex">
          <Link to="/guides" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Tutustu palveluun
          </Link>
        </Button>
        <Button asChild variant="outline" className="border-brand-orange text-brand-ink">
          <Link to="/login">Kirjaudu / Luo profiili</Link>
        </Button>
      </div>
    );
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      <div
        className={cn(
          'mx-auto flex w-full max-w-6xl items-center justify-between gap-4 rounded-2xl border border-white/40 bg-white/80 px-4 py-3 shadow-soft backdrop-blur-md transition-all duration-300 md:px-6',
          isScrolled ? 'mt-2' : 'mt-4',
        )}
      >
        <Link to="/" className="flex items-center gap-3 rounded-xl px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/60 focus-visible:ring-offset-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-orange text-white shadow-soft">
            <PawPrint className="h-5 w-5" />
          </span>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-semibold text-brand-ink">Pentulaskuri</span>
            <span className="text-xs text-muted-foreground">Kasvun ja hyvinvoinnin seurantaan</span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-4">
          {renderPrimaryNav()}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {renderAuthActions()}
          <Button asChild variant="secondary" className="hidden lg:inline-flex bg-brand-green/90 text-white hover:bg-brand-green">
            <Link to={user ? '/onboarding' : '/login'}>
              <PlusCircle className="mr-2 h-4 w-4" /> Luo profiili
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {user ? (
            <Button onClick={() => navigate('/login')} variant="ghost" className="px-2">
              <Dog className="h-5 w-5 text-brand-orange" />
            </Button>
          ) : null}
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-orange/30">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Avaa valikko</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-sm bg-white px-0">
              <SheetHeader className="px-6 pb-4 pt-8 text-left">
                <SheetTitle className="flex items-center gap-3 text-brand-ink">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-orange text-white">
                    <PawPrint className="h-5 w-5" />
                  </span>
                  Pentulaskuri
                </SheetTitle>
              </SheetHeader>
              <div className="space-y-4 px-6 pb-10">
                {user ? (
                  <div className="rounded-xl border border-brand-orange/30 bg-brand-orange/10 p-4">
                    <p className="text-sm font-medium text-brand-ink">{user.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {isFetchingDog ? 'Haetaan pentua?' : activeDogName ? `Viimeksi katsottu pentu: ${activeDogName}` : 'Lis?? pentuprofiili aloittaaksesi'}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-xl border border-brand-orange/20 bg-brand-yellow/20 p-4 text-sm text-brand-ink">
                    <p className="font-semibold">Uusi k?ytt?j??</p>
                    <p>Luo ilmainen profiili ja aloita pentusi kasvun seuranta.</p>
                  </div>
                )}

                <nav aria-label="P??valikko" className="space-y-2">
                  <Link
                    to="/"
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium',
                      isActive('/') ? 'bg-brand-orange text-white shadow-soft' : 'bg-brand-orange/10 text-brand-ink',
                    )}
                    aria-current={isActive('/') ? 'page' : undefined}
                  >
                    <Home className="h-4 w-4" /> Etusivu
                  </Link>
                  <Separator />
                  {primaryLinks.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={cn(
                          'flex flex-col gap-1 rounded-xl px-4 py-3 text-left transition-colors',
                          active ? 'bg-white text-brand-ink shadow-soft' : 'hover:bg-brand-orange/10',
                        )}
                        aria-current={active ? 'page' : undefined}
                      >
                        <span className="flex items-center gap-2 text-sm font-semibold">
                          <Icon className="h-4 w-4 text-brand-orange" aria-hidden="true" />
                          {item.title}
                        </span>
                        <span className="text-xs text-muted-foreground">{item.description}</span>
                      </Link>
                    );
                  })}
                </nav>

                <div className="space-y-3">
                  {user ? (
                    <>
                      <Button onClick={handleSignOut} variant="outline" className="w-full justify-start text-red-600">
                        <LogOut className="mr-2 h-4 w-4" /> Kirjaudu ulos
                      </Button>
                      <Button asChild variant="secondary" className="w-full justify-start bg-brand-green/90 text-white hover:bg-brand-green">
                        <Link to="/onboarding" onClick={() => setIsMobileOpen(false)}>
                          <PlusCircle className="mr-2 h-4 w-4" /> Lis?? pentu
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild className="w-full" onClick={() => setIsMobileOpen(false)}>
                        <Link to="/login">Kirjaudu / Luo profiili</Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full" onClick={() => setIsMobileOpen(false)}>
                        <Link to="/guides">Tutustu ominaisuuksiin</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

const NavigationStatic: React.FC = () => {
  return (
    <header className="bg-white/90 shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-orange text-white">
            <PawPrint className="h-5 w-5" />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-brand-ink">Pentulaskuri</span>
            <span className="text-xs text-muted-foreground">Kasvun ja hyvinvoinnin seurantaan</span>
          </div>
        </div>
        <Button asChild variant="outline">
          <a href="/">Siirry sovellukseen</a>
        </Button>
      </div>
    </header>
  );
};

const NavigationWrapper: React.FC = () => {
  const inRouter = useInRouterContext();
  return inRouter ? <NavigationWithRouter /> : <NavigationStatic />;
};

export default NavigationWrapper;
