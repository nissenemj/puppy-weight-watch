import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './contexts/ThemeContext'
import Router from './router'
import './index.css'
import { MobileOptimizationChecker } from './utils/mobileOptimizationCheck'
import './i18n'
import { ProductionReadiness } from './components/ProductionReadiness'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

// Initialize mobile optimizations
import { VirtualKeyboardHandler } from './utils/VirtualKeyboardHandler'
import { initializeCSSOptimizations } from './utils/CSSOptimization'
import { preloadCriticalResources } from './utils/LazyLoading'

// Initialize critical optimizations immediately
initializeCSSOptimizations()

// Initialize virtual keyboard handler
new VirtualKeyboardHandler()

// Preload critical resources
preloadCriticalResources()

// Initialize mobile optimization monitoring
if (process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    const report = MobileOptimizationChecker.generateReport()
    if (!report.isOptimized) {
      console.group('🔍 Mobile Optimization Issues')
      console.warn('Score:', report.score + '%')
      console.warn('Issues:', report.issues)
      console.warn('Recommendations:', report.recommendations)
      console.groupEnd()
    } else {
      console.log('✅ Mobile optimization: All checks passed!')
    }
  }, 2000)
}

// Register service worker for production
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
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
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ProductionReadiness />
        <Router />
      </HelmetProvider>
    </QueryClientProvider>
  </ThemeProvider>
)

// Mark app initialization complete
performanceMonitor.measureEnd('app_initialization')
