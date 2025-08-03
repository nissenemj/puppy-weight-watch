import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './contexts/ThemeContext'
import Router from './router'
import './index.css'
import './i18n'
import { VirtualKeyboardHandler } from './utils/VirtualKeyboardHandler'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

// Initialize virtual keyboard handler
new VirtualKeyboardHandler();

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Router />
      </HelmetProvider>
    </QueryClientProvider>
  </ThemeProvider>
);
