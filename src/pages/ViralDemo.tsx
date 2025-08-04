import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MobileOptimizations } from '@/components/MobileOptimizations';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Index from '@/pages/Index';
import Calculator from '@/pages/Calculator';
import WeightTrackerPage from '@/pages/WeightTrackerPage';
import PuppyGuide from '@/pages/PuppyGuide';
import SocializationGuide from '@/pages/SocializationGuide';
import SafetyPage from '@/pages/SafetyPage';
import FeedingData from '@/pages/FeedingData';
import InfoHome from '@/pages/InfoHome';
import FoodTypes from '@/pages/FoodTypes';
import PuppyBookLanding from '@/pages/PuppyBookLanding';
import PuppyBookPage from '@/pages/PuppyBook';
import OnboardingPage from '@/pages/OnboardingPage';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

const viralRouter = createBrowserRouter([
  { path: "/", element: <Index /> },
  { path: "/calculator", element: <Calculator /> },
  { path: "/weight-tracker", element: <WeightTrackerPage /> },
  { path: "/puppy-guide", element: <PuppyGuide /> },
  { path: "/socialization-guide", element: <SocializationGuide /> },
  { path: "/safety", element: <SafetyPage /> },
  { path: "/feeding-data", element: <FeedingData /> },
  { path: "/info", element: <InfoHome /> },
  { path: "/food-types", element: <FoodTypes /> },
  { path: "/puppy-book-landing", element: <PuppyBookLanding /> },
  { path: "/puppy-book", element: <PuppyBookPage /> },
  { path: "/onboarding", element: <OnboardingPage /> },
  { path: "*", element: <NotFound /> }
]);

export default function ViralDemo() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <TooltipProvider>
          <MobileOptimizations>
            <RouterProvider router={viralRouter} />
            <PWAInstallPrompt />
            <Toaster />
          </MobileOptimizations>
        </TooltipProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}