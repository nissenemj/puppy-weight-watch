import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './contexts/ThemeContext'
import Router from './router'
import './index.css'
import './i18n'

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

// Start performance monitoring
import { PerformanceMonitor } from './utils/LazyLoading'
const performanceMonitor = PerformanceMonitor.getInstance()
performanceMonitor.measureCoreWebVitals()
performanceMonitor.measureStart('app_initialization')

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Router />
      </HelmetProvider>
    </QueryClientProvider>
  </ThemeProvider>
)

// Mark app initialization complete
performanceMonitor.measureEnd('app_initialization')
