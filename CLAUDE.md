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

# Development server (runs on port 8080 by default, or 5173 if 8080 is busy)
npm run dev

# Production build
npm run build

# Development build (with console logs)
npm run build:dev

# Lint code
npm run lint

# Preview production build locally
npm run preview

# Mobile optimization check
npm run mobile-check
npm run test:mobile
```

## Project Architecture

### Core Directory Structure
```
src/
├── components/          # Reusable React components
│   ├── ui/             # shadcn/ui base components (Button, Card, etc.)
│   ├── *Calculator.tsx # Food calculation components
│   ├── *Tracker.tsx    # Weight tracking components
│   └── *.tsx           # Other feature components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── styles/             # CSS files (including mobile-optimizations.css)
├── assets/             # Static images and resources
└── animations.ts       # Framer Motion animation definitions
```

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
- `MobileOptimizedLayout.tsx` - Responsive layout wrapper
- `MobileOptimizationMonitor.tsx` - Development tool for mobile testing
- `src/styles/mobile-optimizations.css` - Mobile-specific CSS rules

## Styling Conventions

### CSS Architecture
- **Primary**: Tailwind CSS utility classes
- **Components**: shadcn/ui components with Tailwind customization
- **Mobile**: Dedicated mobile-optimizations.css file with responsive breakpoints
- **Animations**: Framer Motion for transitions and micro-interactions

### Design System
- **Colors**: Warm orange (#FF6B35), golden yellow (#FFD23F), green (#4CAF50)
- **Typography**: Mobile-first with minimum 14px font sizes
- **Touch Targets**: Minimum 44px x 44px for mobile interaction
- **Breakpoints**: 320px (small), 768px (tablet), 1024px (desktop), 1440px (large)

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
import { createClient } from '@supabase/supabase-js'

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
  queryKey: ['dogs', userId],
  queryFn: () => fetchUserDogs(userId),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### Local State
- React useState for component-level state
- React Context for theme and auth state
- No global state management library (Zustand mentioned in old docs but not implemented)

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
  onCallback
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
npm run mobile-check  # Automated mobile optimization check
npm run dev           # Then test manually in Chrome DevTools device mode
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
import { Component } from '@/components/Component'
import { helper } from '@/utils/helper'
```

### Mobile Optimization Monitor
The `MobileOptimizationMonitor` component shows a mobile optimization score in development. Keep this above 90%.

### Component Consolidation
The codebase has been recently refactored to remove duplicate components:
- Use `AdvancedFoodCalculator` (not FoodCalculator or EnhancedPuppyCalculator)
- Use `ModernPuppyWeightTracker` (not WeightTracker or PuppyWeightTracker)

### Supabase Environment
Ensure environment variables are set:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Deployment Notes

- **Production**: Configured for GitHub Pages with base path `/puppy-weight-watch/`
- **Development**: Runs on `localhost:8080` or fallback ports
- **Build**: Optimized chunks, tree-shaking, and minification configured
- **Assets**: Proper base path handling for production deployment

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

## Recent Refactoring Notes

The codebase was recently simplified to remove redundant components and improve maintainability:

### Removed Components
- `DesignSystemDemo.tsx`, `ViralDemo.tsx` - Demo components
- `MobileTestingDashboard.tsx`, `ResponsiveTestRunner.tsx` - Development tools
- `FoodCalculator.tsx`, `EnhancedPuppyCalculator.tsx` - Duplicate calculators
- `PuppyWeightTracker.tsx`, `WeightTracker.tsx` - Duplicate trackers

### Consolidated Components
- **Food Calculation**: Use `AdvancedFoodCalculator.tsx` only
- **Weight Tracking**: Use `ModernPuppyWeightTracker.tsx` only
- **Mobile CSS**: Optimized `mobile-optimizations.css` (159 lines, organized sections)

### Import Updates Required
When working with weight tracking or food calculation features, ensure imports reference the correct consolidated components to avoid build errors.