import { useLocation } from "react-router-dom";
import { MobileOptimizedLayout } from '@/components/MobileOptimizedLayout';
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <MobileOptimizedLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 mobile-text-wrap responsive-media no-horizontal-scroll">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
          <a href="/" className="text-blue-500 hover:text-blue-700 underline">
            Return to Home
          </a>
        </div>
      </div>
    </MobileOptimizedLayout>
  );
};

export default NotFound;
