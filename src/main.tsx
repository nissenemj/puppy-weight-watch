import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import Router from './router'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <Router />
  </HelmetProvider>
);
