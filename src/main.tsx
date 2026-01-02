import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { GuestAuthProvider } from './contexts/GuestAuthContext'
import Router from './router'
import CriticalCSS from './components/CriticalCSS'
import './index.css'
import './i18n'
import { initializeHealthCheck } from './utils/productionHealthCheck'
import { AccessibilityEnhancer } from './components/MobileEnhancements'

// Initialize mobile optimizations
import { VirtualKeyboardHandler } from './utils/VirtualKeyboardHandler'
import { initializeCSSOptimizations } from './utils/CSSOptimization'
import { ProductionReadiness } from './components/ProductionReadiness'

import { ErrorBoundary } from './components/ErrorBoundary'
import { ModuleLoadingErrorBoundary } from './components/ModuleLoadingErrorBoundary'
import ScrollProgressBar from './components/ScrollProgressBar'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

// Initialize critical optimizations immediately
initializeCSSOptimizations()

// Initialize production health check
const healthCheck = initializeHealthCheck()

// Initialize virtual keyboard handler
new VirtualKeyboardHandler()

// Register service worker for production (respect base path)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    const swUrl = new URL('sw.js', import.meta.env.BASE_URL).toString()
    navigator.serviceWorker.register(swUrl)
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Start performance monitoring
import { PerformanceMonitor } from './utils/LazyLoading'
const performanceMonitor = PerformanceMonitor.getInstance()
performanceMonitor.measureCoreWebVitals()
performanceMonitor.measureStart('app_initialization')

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ModuleLoadingErrorBoundary>
      <ErrorBoundary>
        <CriticalCSS />
        <ScrollProgressBar />
        <AccessibilityEnhancer />
        <GuestAuthProvider>
          <QueryClientProvider client={queryClient}>
            <HelmetProvider>
              <ProductionReadiness />
              <Router />
            </HelmetProvider>
          </QueryClientProvider>
        </GuestAuthProvider>
      </ErrorBoundary>
    </ModuleLoadingErrorBoundary>
  </StrictMode>
)

// Apply noise texture globally
document.body.classList.add('noise-texture')

// Mark app initialization complete
performanceMonitor.measureEnd('app_initialization')
