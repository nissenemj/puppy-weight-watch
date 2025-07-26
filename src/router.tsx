import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Calculator from "./pages/Calculator";
import PuppyBook from "./pages/PuppyBook";
import PuppyBookLanding from "./pages/PuppyBookLanding";
import InfoHome from "./pages/InfoHome";
import FeedingData from "./pages/FeedingData";
import FoodTypes from "./pages/FoodTypes";
import PuppyGuide from "./pages/PuppyGuide";
import SafetyPage from "./pages/SafetyPage";
import NotFound from "./pages/NotFound";
import OnboardingPage from "./pages/OnboardingPage";
import WeightTrackerPage from "./pages/WeightTrackerPage";
import App from "./App"; // Viral demo page

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/weight-tracker",
    element: <WeightTrackerPage />,
  },
  {
    path: "/onboarding",
    element: <OnboardingPage />,
  },
  {
    path: "/calculator",
    element: <Calculator />,
  },
  {
    path: "/puppy-book",
    element: <PuppyBook />,
  },
  {
    path: "/puppy-book-landing",
    element: <PuppyBookLanding />,
  },
  {
    path: "/info",
    element: <InfoHome />,
  },
  {
    path: "/info/feeding-data",
    element: <FeedingData />,
  },
  {
    path: "/info/food-types",
    element: <FoodTypes />,
  },
  {
    path: "/info/puppy-guide",
    element: <PuppyGuide />,
  },
  {
    path: "/info/safety",
    element: <SafetyPage />,
  },
  {
    path: "/viral-demo",
    element: <App />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}