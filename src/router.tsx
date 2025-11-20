import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import { RootLayout } from "./components/RootLayout";

// Critical pages - load immediately
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load pages - simplified structure
const Calculator = lazy(() => import("./pages/Calculator"));
const WeightTrackerPage = lazy(() => import("./pages/WeightTrackerPage"));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage"));
const PuppyBook = lazy(() => import("./pages/PuppyBook"));
const PuppyBookLanding = lazy(() => import("./pages/PuppyBookLanding"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const AuthCallbackPage = lazy(() => import("./pages/auth/AuthCallback"));

// New consolidated guides structure
const Guides = lazy(() => import("./pages/Guides"));
const PuppyGuide = lazy(() => import("./pages/PuppyGuide"));
const SafetyPage = lazy(() => import("./pages/SafetyPage"));
const SocializationGuide = lazy(() => import("./pages/SocializationGuide"));

// Legacy support - will redirect to new structure
const InfoHome = lazy(() => import("./pages/InfoHome"));
const FeedingData = lazy(() => import("./pages/FeedingData"));
const FoodTypes = lazy(() => import("./pages/FoodTypes"));

// Legal pages
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/legal/TermsOfService"));
const CookiePolicy = lazy(() => import("./pages/legal/CookiePolicy"));
const AccessibilityStatement = lazy(() => import("./pages/legal/AccessibilityStatement"));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-stone-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta-500 mx-auto mb-4"></div>
      <p className="text-stone-500">Ladataan...</p>
    </div>
  </div>
);

// Wrap lazy components with Suspense
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Main pages - simplified 5-category structure
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "/weight-tracker",
        element: withSuspense(WeightTrackerPage),
      },
      {
        path: "/calculator",
        element: withSuspense(Calculator),
      },
      {
        path: "/guides",
        element: withSuspense(Guides),
      },
      {
        path: "/puppy-book",
        element: withSuspense(PuppyBook),
      },
      {
        path: "/login",
        element: withSuspense(LoginPage),
      },
      {
        path: "/auth/callback",
        element: withSuspense(AuthCallbackPage),
      },

      // Secondary pages
      {
        path: "/onboarding",
        element: withSuspense(OnboardingPage),
      },
      {
        path: "/puppy-book-landing",
        element: withSuspense(PuppyBookLanding),
      },

      // Guide sub-pages - new organized structure
      {
        path: "/guides/puppy-guide",
        element: withSuspense(PuppyGuide),
      },
      {
        path: "/guides/socialization",
        element: withSuspense(SocializationGuide),
      },
      {
        path: "/guides/safety",
        element: withSuspense(SafetyPage),
      },
      {
        path: "/guides/feeding",
        element: withSuspense(FeedingData), // Repurpose as feeding guide
      },

      // Legacy redirects - maintain backward compatibility
      {
        path: "/info",
        element: withSuspense(InfoHome),
      },
      {
        path: "/info/feeding-data",
        element: withSuspense(FeedingData),
      },
      {
        path: "/info/food-types",
        element: withSuspense(FoodTypes),
      },
      {
        path: "/info/puppy-guide",
        element: withSuspense(PuppyGuide),
      },
      {
        path: "/info/socialization-guide",
        element: withSuspense(SocializationGuide),
      },
      {
        path: "/info/safety",
        element: withSuspense(SafetyPage),
      },

      // Legal pages
      {
        path: "/privacy",
        element: withSuspense(PrivacyPolicy),
      },
      {
        path: "/terms",
        element: withSuspense(TermsOfService),
      },
      {
        path: "/cookies",
        element: withSuspense(CookiePolicy),
      },
      {
        path: "/accessibility",
        element: withSuspense(AccessibilityStatement),
      },

      // 404 page
      {
        path: "*",
        element: <NotFound />,
      },
    ]
  }
]);

export default function Router() {
  return (
    <RouterProvider router={router} />
  );
}

