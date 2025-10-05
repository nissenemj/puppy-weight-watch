# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pentulaskuri.com is a Finnish puppy weight tracking and food calculation web application. The application helps dog owners track their puppy's growth, calculate food portions, and maintain a digital puppy book with social sharing capabilities.

## Technology Stack

- **Framework**: React 18.3+ with TypeScript 5.5+
- **Build Tool**: Vite 5.4+ with SWC for fast compilation
- **Styling**: Tailwind CSS 3.4+ with shadcn/ui component library
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **State Management**: React Query (@tanstack/react-query) for server state
- **Routing**: React Router DOM 6.26+
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion 12.23+
- **Charts**: Recharts 2.12+
- **Icons**: Lucide React 0.462+
- **Mobile**: Capacitor 7.4+ for native app compilation

## Essential Development Commands

```bash
# Install dependencies
npm install

# Development server (configured for port 8080, falls back to 5173)
npm run dev

# Production build
npm run build

# Development build (with console logs)
npm run build:dev

# Code Quality
npm run lint             # ESLint with TypeScript strict mode
npm run type-check       # TypeScript type checking only
npm run format           # Prettier formatting
npm run format:check     # Check formatting without fixing

# Testing
npm run test             # Vitest unit tests
npm run test:watch       # Vitest watch mode for development
npm run test:e2e         # Playwright E2E tests
npm run a11y-test        # Accessibility tests with axe-core

# Preview and validation
npm run preview          # Preview production build locally
npm run mobile-check     # Mobile optimization validation script
npm run test:mobile      # Mobile testing with validation

# Utilities
npm run generate-icons   # Icon generation script
npm run release          # Semantic release

# MCP server management
claude mcp list              # List configured MCP servers
claude mcp get <name>        # Get server details
claude mcp add <name> <cmd>  # Add new MCP server
```

## Critical Development Notes

- **Development Server**: Configured for port 8080 (strictPort: true), may run on 5173 if 8080 is busy
- **Always run `npm run lint` before committing** - TypeScript strict mode enforced
- **Test mobile responsiveness** at 320px, 768px, 1024px, 1440px breakpoints
- **No horizontal scroll allowed** - test thoroughly on mobile devices

## Testing Configuration

### Unit Testing (Vitest)

- **Framework**: Vitest with jsdom environment
- **Config**: `vitest.config.ts` with @testing-library/jest-dom setup
- **Coverage**: Text and lcov reporters enabled
- **Location**: `tests/unit/` and `src/**/*.{test,spec}.{ts,tsx}`

### E2E Testing (Playwright)

- **Base URL**: http://127.0.0.1:4173 (configurable via PLAYWRIGHT_BASE_URL env)
- **Browser**: Desktop Chrome (1280x720)
- **Timeout**: 30s test, 5s expect
- **Location**: `tests/e2e/`

### Accessibility Testing

- **Framework**: @axe-core/playwright for WCAG 2.1 AA compliance
- **Integration**: Separate project in playwright.config.ts
- **Location**: `tests/a11y/`

### Running Single Tests

```bash
# Single unit test file
npm run test src/components/Calculator.test.tsx

# Single E2E test
npm run test:e2e tests/e2e/smoke.spec.ts

# Watch mode for development
npm run test:watch
```

## MCP Integration

### Playwright MCP Server

- **Status**: Installed and configured ✓
- **Command**: `npx @playwright/mcp@latest`
- **Scope**: Local project configuration
- **Usage**: Browser automation, testing, and web scraping capabilities
- **Access**: Available through `/mcp` command in Claude Code sessions

## Project Architecture

### High-Level Architecture

This is a **React SPA with lazy-loaded routes** using a **component consolidation strategy**. The app follows a **mobile-first, full-width layout system** with **unified design tokens**.

### Core Directory Structure

```
src/
├── components/          # Reusable React components
│   ├── ui/             # shadcn/ui base components (Button, Card, etc.)
│   ├── PuppyBook/      # Puppy book feature components
│   ├── Navigation.tsx  # Main navigation (added recently)
│   ├── AdvancedFoodCalculator.tsx    # CONSOLIDATED food calculator
│   ├── ModernPuppyWeightTracker.tsx  # CONSOLIDATED weight tracker
│   ├── ScrollPanBackground.tsx       # Hero section backgrounds
│   ├── LazyImage.tsx               # Optimized image loading
│   └── *.tsx                       # Other feature components
├── pages/              # Route components with lazy loading
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── styles/             # CSS files with design system
│   ├── design-system.css       # Unified design tokens
│   ├── mobile-optimizations.css # Mobile-specific rules
│   └── *.css                   # Feature-specific styles
├── assets/             # Static images and resources
└── animations.ts       # Framer Motion animation definitions
```

### Bundle Architecture (Vite Configuration)

- **Route-based lazy loading** for all non-critical pages
- **Automatic chunking**: Manual chunking disabled to avoid circular dependency issues - Vite handles optimization automatically
- **Feature-based code splitting**: PuppyBook (52kB), Calculator (3kB), Weight tracking (11kB)
- **Initial bundle**: ~18.3kB JS + 21.6kB CSS (gzipped) - excellent performance
- **Minification**: esbuild for reliable production minification
- **Optimization**: React core dependencies explicitly included for proper dependency resolution

### Key Components Architecture

**Weight Tracking Flow:**

- `ModernPuppyWeightTracker.tsx` - Main weight tracking interface
- `WeightChart.tsx` - Data visualization
- `WeightEntry.tsx` - Form for adding weight entries
- `DogSelector.tsx` - Dog selection interface

**Food Calculation:**

- `AdvancedFoodCalculator.tsx` - Main food calculation component (consolidated)
- Contains breed-specific algorithms and feeding recommendations

**Authentication & Onboarding:**

- `AuthenticationWrapper.tsx` - Handles login/register
- `OnboardingWizard.tsx` - New user setup flow

**Mobile Optimization:**

- `src/styles/mobile-optimizations.css` - Mobile-specific CSS rules (159 lines, optimized)
- Mobile-first responsive design with utility classes (`mobile-grid-1`, `mobile-text-wrap`, `mobile-container-safe`)
- Critical mobile rules prevent horizontal scroll and ensure proper touch targets
- Performance optimizations (GPU acceleration, smooth scrolling)
- Accessibility enhancements (focus indicators, reduced motion support)
- Form optimizations and responsive table handling

## Styling Conventions

### CSS Architecture

- **Primary**: Tailwind CSS utility classes
- **Components**: shadcn/ui components with Tailwind customization
- **Mobile**: Dedicated mobile-optimizations.css file with responsive breakpoints
- **Animations**: Framer Motion for transitions and micro-interactions

### Design System

- **Colors**: Anthropic-inspired warm palette with CSS custom properties
  - Primary: `var(--color-primary-500)` (#e07856 warm terracotta)
  - Secondary: `var(--color-secondary-500)` (#60a5fa calm blue)
  - Tertiary: `var(--color-tertiary-500)` (#4ade80 vibrant green)
  - Neutrals: `var(--color-neutral-*)` warm beiges and grays
- **Typography**: Inter + Source Serif Pro, mobile-first with minimum 14px font sizes
- **Gradients**: Unified gradient system via CSS classes (`bg-gradient-primary`, `bg-gradient-soft`, `bg-gradient-warm`)
- **Touch Targets**: Minimum 44px x 44px for mobile interaction
- **Breakpoints**: 320px (small), 768px (tablet), 1024px (desktop), 1440px (large)
- **Glassmorphism**: backdrop-blur effects with transparency and white borders

### Critical Mobile Rules

```css
/* Prevent horizontal scroll - NEVER allow this */
overflow-x: hidden !important;
max-width: 100vw !important;

/* Minimum touch targets */
min-height: 44px !important;
min-width: 44px !important;

/* iOS zoom prevention */
font-size: 16px !important; /* for input elements */
```

## Supabase Integration

### Database Schema (Key Tables)

- `dogs` - Dog profiles with breed, age, activity level
- `weight_entries` - Weight measurements with timestamps
- `puppy_books` - Puppy book entries with photos and notes
- User authentication via Supabase Auth

### Client Configuration

```typescript
// Located in src/integrations/supabase/client.ts
import { createClient } from "@supabase/supabase-js";

// Environment variables required:
// VITE_SUPABASE_URL
// VITE_SUPABASE_ANON_KEY
```

### Row Level Security (RLS)

All tables implement RLS policies ensuring users can only access their own data.

## State Management Patterns

### Server State (React Query)

```typescript
// Pattern for data fetching
const { data, error, isLoading } = useQuery({
  queryKey: ["dogs", userId],
  queryFn: () => fetchUserDogs(userId),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### Local State

- React useState for component-level state
- React Context for theme and auth state
- No global state management library (Zustand mentioned in old docs but not implemented)

### Custom Hooks

Key specialized hooks in `src/hooks/`:

- **`useWeightEntries.ts`**: Weight entry data fetching and mutations
- **`usePWAInstall.ts`**: PWA installation prompt handling
- **`useMobileAnalytics.ts`**: Mobile-specific analytics tracking
- **`useVirtualKeyboard.ts`**: Virtual keyboard height management for mobile
- **`useCoreWebVitals.ts`**: Performance monitoring (LCP, FID, CLS)
- **`usePullToRefresh.ts`**: Pull-to-refresh gesture on mobile
- **`use-mobile.tsx`**: Mobile device detection and breakpoint tracking
- **`use-toast.ts`**: Toast notification system (shadcn/ui)

## Component Development Guidelines

### TypeScript Standards

- **Strict mode enabled** - no `any` types allowed
- All props interfaces must be explicitly typed
- Use `React.FC<PropsInterface>` for component definitions

### Component Pattern

```typescript
interface ComponentProps {
  required: string;
  optional?: number;
  onCallback?: (data: SomeType) => void;
}

export const Component: React.FC<ComponentProps> = ({
  required,
  optional = defaultValue,
  onCallback,
}) => {
  // Implementation
};
```

### Accessibility Requirements

- **WCAG 2.1 AA compliance mandatory**
- Semantic HTML elements (`<main>`, `<nav>`, `<header>`, `<footer>`)
- ARIA labels for interactive elements
- Alt text for all informative images
- Keyboard navigation support
- Focus indicators visible
- Color contrast ratio 4.5:1 minimum

### Performance Optimization

- Lazy loading with `LazyImage.tsx` component
- Code splitting via dynamic imports
- Optimized bundle chunks (configured in vite.config.ts)
- Image optimization and proper alt text

## Mobile-First Development

### Critical Rules

1. **NO horizontal scroll ever** - test on 320px width minimum
2. Touch targets minimum 44px x 44px
3. Test on iPhone SE, iPad, and desktop breakpoints
4. Use `mobile-optimizations.css` for mobile-specific styles

### Testing Process

```bash
npm run mobile-check  # Automated mobile optimization check script
npm run dev           # Development server - then test manually in Chrome DevTools device mode
# Test breakpoints: 320px (iPhone SE), 768px (tablet), 1024px (desktop)
```

## Business Logic Constraints

### Food Calculations

- Based on real veterinary feeding guidelines
- Age, weight, breed size, and activity level factors
- Include disclaimer about consulting veterinarian
- Support for 200+ food brands in database

### Weight Tracking

- Metric system (kg) for measurements
- Growth curve comparisons by breed
- Historical data visualization
- Export capabilities for vet visits

### Social Features (Puppy Book)

- Privacy controls (public/private sharing)
- Photo uploads with metadata
- Timeline view with chronological ordering
- Social sharing capabilities

## Development Workflow

### Before Making Changes

1. Understand the existing component architecture
2. Check mobile-optimizations.css for responsive patterns
3. Review related components for consistency
4. Ensure TypeScript strict compliance

### Code Quality Checklist

- [ ] TypeScript strict mode passes
- [ ] Mobile responsive (test at 320px width)
- [ ] Accessibility compliant (semantic HTML, ARIA)
- [ ] Proper error handling
- [ ] Loading states implemented
- [ ] Performance optimized (lazy loading, etc.)

### Testing Requirements

- Manual mobile testing in Chrome DevTools required
- Test keyboard navigation
- Verify screen reader compatibility
- Test offline functionality where applicable

## Common Gotchas

### Import Path Aliases

```typescript
// Use @ alias for all src imports
import { Component } from "@/components/Component";
import { helper } from "@/utils/helper";
```

### Mobile Optimization Utilities

The `mobile-optimizations.css` file contains comprehensive mobile rules with utility classes:

- `mobile-grid-1` - Forces single column layout on mobile
- `mobile-text-wrap` - Ensures proper text wrapping to prevent overflow
- `mobile-container-safe` - Safe container padding for mobile
- `mobile-card-safe` - Safe card widths to prevent overflow
- `mobile-button` - Full-width mobile button behavior
- `full-width-section` - Full viewport width sections
- `full-width-content` - Centered content within full-width sections
- Global overflow-x: hidden to prevent horizontal scroll

### Component Consolidation Strategy

**CRITICAL**: The codebase has been recently refactored to remove duplicate components:

- **Food Calculation**: Use `AdvancedFoodCalculator.tsx` ONLY (not FoodCalculator or EnhancedPuppyCalculator)
- **Weight Tracking**: Use `ModernPuppyWeightTracker.tsx` ONLY (not WeightTracker or PuppyWeightTracker)
- **Navigation**: All main pages now include `<Navigation />` component for consistent navigation
- **Layout System**: Converted to full-width layout with proper content centering

### Recent Navigation & Layout Improvements

- **Navigation z-index fixed**: Navigation components use z-[200], mobile menu z-[250]
- **Full-width layout system**: All pages converted to full-width sections with centered content
- **Design system unification**: All background gradients now use unified CSS classes from design-system.css

### Supabase Environment

**Project Configuration:**

- **Project ID**: ckwwxuyteyaaxfcvozvb
- **URL**: https://ckwwxuyteyaaxfcvozvb.supabase.co

Ensure environment variables are set:

```
VITE_SUPABASE_URL=https://ckwwxuyteyaaxfcvozvb.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

**Database Management:**

```bash
# Reset database with seed data
npm run supabase:reset

# Seed database only
npm run supabase:seed
```

## Performance Optimizations

### Bundle Optimization

- **Initial load**: ~18.3 kB JS + 21.6 kB CSS (gzipped) - Excellent performance!
- **Route-based lazy loading**: All non-critical pages lazy loaded with Suspense
- **Automatic chunking**: Vite handles optimization automatically (manual chunking disabled to avoid circular dependencies)
- **Feature-based code splitting**: PuppyBook (52 kB), Calculator (3 kB), Weight tracking (11 kB)
- **Critical path**: Only homepage + essential chunks loaded initially
- **Minification**: esbuild for production builds

### Image Optimization

- **LazyImage component**: WebP support, responsive images, priority loading
- **Intersection Observer**: 100px margin for optimal loading
- **Progressive enhancement**: Fallbacks for older browsers

### CSS Performance

- **Critical CSS**: Inline styles for above-the-fold content
- **Deferred loading**: Non-critical CSS loaded after initial render
- **Mobile-first**: 635 lines of comprehensive mobile CSS rules in `mobile-optimizations.css`

### PWA Features

- **Service Worker**: Cache-first for static, network-first for API, stale-while-revalidate for dynamic
- **Offline support**: Basic offline functionality for cached resources
- **Install prompts**: Full PWA manifest with shortcuts and screenshots
- **Background sync**: Ready for weight entry synchronization

## Deployment & Build Configuration

### Development Environment

- **Local Server**: Configured for port 8080 (strictPort: true) in vite.config.ts
- **Fallback Port**: 5173 if 8080 is busy
- **Host Configuration**: "0.0.0.0" for network access

### Production Build

- **Base Path**: `/` (serves from domain root)
- **Build Optimization**: Automatic vendor chunk splitting for optimal loading
- **Performance**: Initial bundle ~18.3kB JS + 21.6kB CSS (gzipped)
- **Tree Shaking**: Aggressive optimization with esbuild in production
- **Console Cleanup**: All console.log/debugger statements removed in production

### CI/CD Pipeline

- **Current Deployment**: Vercel (recommended)
- **GitHub Actions**: CI/CD workflows currently disabled for Vercel integration
- **Previous Setup**: IONOS deployment via `.github/workflows/deploy-ionos.yml` (disabled)
- **Performance**: Lighthouse Performance Score target >95 (Core Web Vitals optimized)

## Finnish Language Context

This is a Finnish application (`pentulaskuri` = puppy calculator). Maintain Finnish terminology in:

- User interface text
- Comments when appropriate
- Error messages
- Placeholder text

Common terms:

- `pentu` = puppy
- `paino` = weight
- `ruoka` = food
- `kasvu` = growth
- `rotu` = breed

## Growth Prediction Architecture

The app implements **dual growth prediction models** for puppy weight forecasting:

### Biological Growth Model (`biologicalGrowthModel.ts`)

- **Based on Gompertz Growth Function**: Scientifically validated model for canine growth
- **Formula**: `Wt = Wmax × exp(-exp(-(t-c)/b))`
- **Parameters**:
  - `adultWeight`: Predicted adult weight (kg)
  - `growthDuration`: Growth rate parameter (days)
  - `inflectionAge`: Age at maximum growth rate (days)
- **Quality Metrics**: R², RMSE, MAE for prediction confidence
- **Usage**: Advanced predictions with confidence intervals

### Veterinary Growth Calculator (`veterinaryGrowthCalculator.ts`)

- **Based on practical veterinary formulas** used by professionals
- **Breed-specific calculations** for toy, small, medium, large, giant breeds
- **Multiple formula approach** for different age ranges with confidence scoring
- **Breed max weights**: toy (5kg), small (15kg), medium (30kg), large (50kg), giant (80kg)
- **Usage**: Simple, reliable predictions for owners

### Implementation Pattern

```typescript
import { calculateVeterinaryGrowthEstimate } from "@/utils/veterinaryGrowthCalculator";
import { fitGompertzModel } from "@/utils/biologicalGrowthModel";

// Veterinary method (simpler, practical)
const vetEstimate = calculateVeterinaryGrowthEstimate(weightData, birthDate);

// Gompertz model (advanced, with confidence intervals)
const gompertzFit = fitGompertzModel(weightData, breedProfile);
```

## Recent Refactoring & Feature Additions

### Recent Growth Prediction Improvements (Latest Commits)

- **Veterinary-based growth calculator** implemented with practical formulas used by veterinarians
- **Biological Gompertz growth model** added for scientifically-validated predictions
- **Comprehensive polynomial regression** system with stability improvements
- **Dual prediction approach**: Both simple (veterinary) and advanced (Gompertz) models available

### Component Consolidation

The codebase was simplified to remove redundant components and improve maintainability:

**Removed Components:**

- `DesignSystemDemo.tsx`, `ViralDemo.tsx` - Demo components
- `MobileTestingDashboard.tsx`, `ResponsiveTestRunner.tsx` - Development tools
- `FoodCalculator.tsx`, `EnhancedPuppyCalculator.tsx` - Duplicate calculators
- `PuppyWeightTracker.tsx`, `WeightTracker.tsx` - Duplicate trackers

**Consolidated Components:**

- **Food Calculation**: Use `AdvancedFoodCalculator.tsx` only
- **Weight Tracking**: Use `ModernPuppyWeightTracker.tsx` only
- **Mobile CSS**: Comprehensive `mobile-optimizations.css` (635 lines, organized sections)

**Import Updates Required:**

When working with weight tracking or food calculation features, ensure imports reference the correct consolidated components to avoid build errors.

### TypeScript Configuration

- **Strict mode enabled** in both `tsconfig.json` and `tsconfig.app.json`
- Path aliases configured: `@/*` maps to `src/*`
- **IMPORTANT**: Always run `npm run lint` before committing to catch TypeScript errors

### Critical Mobile & Layout CSS Classes

Apply these classes from `mobile-optimizations.css` and `design-system.css` when building components:

```css
/* Mobile Optimization Classes */
.mobile-grid-1              /* Single column grid on mobile */
.mobile-text-wrap           /* Prevent text overflow */
.mobile-container-safe      /* Safe container padding */
.mobile-card-safe           /* Safe card widths */
.mobile-button             /* Full-width mobile buttons */
.mobile-form-full          /* Full-width form controls */
.mobile-smooth-scroll      /* GPU-accelerated scrolling */
.mobile-focus-enhanced     /* Enhanced focus indicators */
.mobile-table-responsive   /* Responsive table wrapper */

/* Full-Width Layout Classes */
.full-width-section        /* Full viewport width sections */
.full-width-content        /* Centered content (max-width: 1400px) */
.hero-content              /* Hero section content (max-width: 1200px) */

/* Design System Classes */
.bg-gradient-primary       /* Primary brand gradient */
.bg-gradient-soft          /* Soft background gradient */
.bg-gradient-warm          /* Warm CTA gradient */
```

### Navigation Implementation Pattern

When adding navigation to new pages, follow this pattern:

```tsx
import Navigation from "@/components/Navigation";

export default function NewPage() {
  return (
    <MobileOptimizedLayout>
      <Navigation /> {/* Add after MobileOptimizedLayout */}
      <div className="full-width-section bg-gradient-primary">
        <div className="full-width-content">{/* Your page content */}</div>
      </div>
    </MobileOptimizedLayout>
  );
}
```

### Recent Hero Section Fixes (Critical)

**ScrollPanBackground Component Usage:**

- Hero content MUST be nested as children within ScrollPanBackground component
- Do NOT render hero content as sibling sections - this causes overlay positioning issues
- Fixed reduced motion handling to show static image instead of null
- Proper z-index hierarchy: background (1), gradient (10), content (30)

**Correct Pattern:**

```tsx
<ScrollPanBackground
  src={image}
  alt="..."
  overlayClassName="items-center justify-center"
>
  <div className="hero-content">{/* Title, subtitle, buttons go here */}</div>
</ScrollPanBackground>
```

# important-instruction-reminders

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (\*.md) or README files. Only create documentation files if explicitly requested by the User.
