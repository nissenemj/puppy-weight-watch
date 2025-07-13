
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Suspense, lazy } from "react";

// Lazy load all page components to reduce initial bundle size
const Index = lazy(() => import("./pages/Index"));
const Calculator = lazy(() => import("./pages/Calculator"));
const NotFound = lazy(() => import("./pages/NotFound"));
const InfoHome = lazy(() => import("./pages/InfoHome"));
const FoodTypes = lazy(() => import("./pages/FoodTypes"));
const FeedingData = lazy(() => import("./pages/FeedingData"));
const SafetyPage = lazy(() => import("./pages/SafetyPage"));
const PuppyGuide = lazy(() => import("./pages/PuppyGuide"));
const PuppyBookPage = lazy(() => import("./pages/PuppyBook"));
const PuppyBookLanding = lazy(() => import("./pages/PuppyBookLanding"));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime in newer versions)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ErrorBoundary>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/info" element={<InfoHome />} />
              <Route path="/info/food-types" element={<FoodTypes />} />
              <Route path="/info/feeding-data" element={<FeedingData />} />
              <Route path="/info/safety" element={<SafetyPage />} />
              <Route path="/info/puppy-guide" element={<PuppyGuide />} />
              <Route path="/puppy-book-info" element={<PuppyBookLanding />} />
              <Route path="/puppy-book" element={<PuppyBookPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
