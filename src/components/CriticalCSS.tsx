import { useEffect } from 'react';

const CriticalCSS = () => {
  useEffect(() => {
    // Let Vite handle CSS loading automatically
    // No manual CSS preloading needed as it's handled by the build process
  }, []);

  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        /* Critical CSS - Inline for fastest loading */
        :root {
          --color-primary: #FF6B35;
          --color-accent: #FF6B35;
          --color-secondary: #FFD23F;
          --color-success: #4CAF50;
          --color-text: #1F2937;
          --color-muted: #6B7280;
          --color-surface: #FFFFFF;
          --color-surface-alt: #F9FAFB;
          --color-border: #E5E7EB;
        }

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }

        body {
          color: var(--color-text);
          background-color: var(--color-surface);
          font-size: 16px;
          overflow-x: hidden;
        }

        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        h1, h2, h3 {
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 1rem;
        }

        h1 { font-size: 2.25rem; }
        h2 { font-size: 1.875rem; }

        @media (max-width: 768px) {
          body, html {
            overflow-x: hidden !important;
            max-width: 100vw !important;
          }
          .container { padding: 0 0.75rem; }
          h1 { font-size: 1.875rem; }
          h2 { font-size: 1.5rem; }
          input, select, textarea { font-size: 16px !important; }
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `
    }} />
  );
};

export default CriticalCSS;