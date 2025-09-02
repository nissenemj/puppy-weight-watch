/**
 * Simplified Navigation Structure for Pentulaskuri.com
 * Reorganized from 11 pages to 5 main categories for better UX
 */

export interface NavigationItem {
  label: string;
  href: string;
  icon: string;
  description: string;
  category: 'primary' | 'secondary';
  children?: NavigationItem[];
}

export const MAIN_NAVIGATION: NavigationItem[] = [
  {
    label: 'Koti',
    href: '/',
    icon: 'Home',
    description: 'Aloitussivu ja yleiskatsaus',
    category: 'primary'
  },
  {
    label: 'Seuranta',
    href: '/weight-tracker',
    icon: 'Scale',
    description: 'Painonseuranta ja kasvukäyrät',
    category: 'primary'
  },
  {
    label: 'Laskurit',
    href: '/calculator',
    icon: 'Calculator',
    description: 'Ruokamäärä- ja muut laskurit',
    category: 'primary'
  },
  {
    label: 'Oppaat',
    href: '/guides',
    icon: 'BookOpen',
    description: 'Koiranpennun hoito-oppaat ja vinkit',
    category: 'primary',
    children: [
      {
        label: 'Pentuopas',
        href: '/guides/puppy-guide',
        icon: 'Dog',
        description: 'Perustiedot pennun hoitamiseen',
        category: 'secondary'
      },
      {
        label: 'Sosialisaatio',
        href: '/guides/socialization',
        icon: 'Users',
        description: 'Pennun sosialisaation opas',
        category: 'secondary'
      },
      {
        label: 'Turvallisuus',
        href: '/guides/safety',
        icon: 'Shield',
        description: 'Kodin turvalliseksi tekeminen',
        category: 'secondary'
      },
      {
        label: 'Ruokintaohjeet',
        href: '/guides/feeding',
        icon: 'Utensils',
        description: 'Ruokamäärät ja ruokintatips',
        category: 'secondary'
      }
    ]
  },
  {
    label: 'Pentukirja',
    href: '/puppy-book',
    icon: 'Book',
    description: 'Tallenna pennun tärkeimmät hetket',
    category: 'primary'
  }
];

export const BREADCRUMB_CONFIG = {
  '/': { name: 'Koti' },
  '/weight-tracker': { name: 'Seuranta' },
  '/calculator': { name: 'Laskurit' },
  '/guides': { name: 'Oppaat' },
  '/guides/puppy-guide': { name: 'Pentuopas', parent: '/guides' },
  '/guides/socialization': { name: 'Sosialisaatio', parent: '/guides' },
  '/guides/safety': { name: 'Turvallisuus', parent: '/guides' },
  '/guides/feeding': { name: 'Ruokintaohjeet', parent: '/guides' },
  '/puppy-book': { name: 'Pentukirja' },
  '/onboarding': { name: 'Aloitusopas', parent: '/' }
};

// Mobile navigation optimization
export const MOBILE_NAV_CONFIG = {
  maxVisibleItems: 4, // Show 4 main items + "More" menu on mobile
  primaryItems: ['/', '/weight-tracker', '/calculator', '/puppy-book'],
  secondaryItems: ['/guides', '/onboarding']
};

// Search suggestions for improved findability
export const SEARCH_SUGGESTIONS = [
  { term: 'painonseuranta', category: 'Toiminto', url: '/weight-tracker' },
  { term: 'ruokamäärä', category: 'Laskuri', url: '/calculator' },
  { term: 'kasvukäyrä', category: 'Seuranta', url: '/weight-tracker' },
  { term: 'pentuopas', category: 'Opas', url: '/guides/puppy-guide' },
  { term: 'sosialisaatio', category: 'Opas', url: '/guides/socialization' },
  { term: 'turvallisuus', category: 'Opas', url: '/guides/safety' },
  { term: 'ruokinta', category: 'Opas', url: '/guides/feeding' },
  { term: 'pentukirja', category: 'Toiminto', url: '/puppy-book' },
  { term: 'aloitus', category: 'Apua', url: '/onboarding' }
];

// Accessibility helpers
export const getAriaLabel = (item: NavigationItem): string => {
  return `${item.label} - ${item.description}`;
};

export const getCurrentPageTitle = (pathname: string): string => {
  const config = BREADCRUMB_CONFIG[pathname as keyof typeof BREADCRUMB_CONFIG];
  return config?.name || 'Pentulaskuri';
};

export const generateBreadcrumbs = (pathname: string): Array<{ name: string; url: string }> => {
  const breadcrumbs = [{ name: 'Koti', url: '/' }];
  
  const config = BREADCRUMB_CONFIG[pathname as keyof typeof BREADCRUMB_CONFIG];
  if (!config) return breadcrumbs;
  
  // Add parent if exists
  if (config.parent && config.parent !== '/') {
    const parentConfig = BREADCRUMB_CONFIG[config.parent as keyof typeof BREADCRUMB_CONFIG];
    if (parentConfig) {
      breadcrumbs.push({ name: parentConfig.name, url: config.parent });
    }
  }
  
  // Add current page (if not home)
  if (pathname !== '/') {
    breadcrumbs.push({ name: config.name, url: pathname });
  }
  
  return breadcrumbs;
};