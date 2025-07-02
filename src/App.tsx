
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import InfoHome from "./pages/InfoHome";
import FoodTypes from "./pages/FoodTypes";
import FeedingData from "./pages/FeedingData";
import SafetyPage from "./pages/SafetyPage";
import PuppyGuide from "./pages/PuppyGuide";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ErrorBoundary>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/info" element={<InfoHome />} />
            <Route path="/info/food-types" element={<FoodTypes />} />
            <Route path="/info/feeding-data" element={<FeedingData />} />
            <Route path="/info/safety" element={<SafetyPage />} />
            <Route path="/info/puppy-guide" element={<PuppyGuide />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
