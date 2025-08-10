import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './contexts/ThemeContext'
import Router from './router'
import './index.css'
import './i18n'

// Initialize mobile optimizations
import { VirtualKeyboardHandler } from './utils/VirtualKeyboardHandler'
import { initializeCSSOptimizations } from './utils/CSSOptimization'
import { MobileOptimizationChecker } from './utils/mobileOptimizationCheck'
import { ProductionReadiness } from './components/ProductionReadiness'
import MobileOptimizationMonitor from './components/MobileOptimizationMonitor'
import { ErrorBoundary } from './components/ErrorBoundary'
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

// Initialize virtual keyboard handler
new VirtualKeyboardHandler()

// Initialize mobile optimization monitoring
if (import.meta.env.DEV) {
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
  <ErrorBoundary>
    <ScrollProgressBar />
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <ProductionReadiness />
          {import.meta.env.DEV && (
            <MobileOptimizationMonitor showScoreOnly />
          )}
          <Router />
        </HelmetProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </ErrorBoundary>
)

// Mark app initialization complete
performanceMonitor.measureEnd('app_initialization')
