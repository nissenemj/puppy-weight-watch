/**
 * Critical CSS extraction and inline optimization
 * Identifies and inlines above-the-fold CSS for faster loading
 */

// Critical CSS for immediate loading
export const CRITICAL_CSS = `
/* Mobile-first reset and base styles */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{font-size:16px;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
body{font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:hsl(var(--foreground));background:hsl(var(--background));overflow-x:hidden;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}

/* Critical design tokens */
:root{
--primary:21 89% 52%;
--primary-foreground:0 0% 98%;
--secondary:240 4.8% 95.9%;
--secondary-foreground:240 5.9% 10%;
--muted:240 4.8% 95.9%;
--muted-foreground:240 3.8% 46.1%;
--accent:240 4.8% 95.9%;
--accent-foreground:240 5.9% 10%;
--destructive:0 84.2% 60.2%;
--destructive-foreground:0 0% 98%;
--border:240 5.9% 90%;
--input:240 5.9% 90%;
--ring:21 89% 52%;
--background:0 0% 100%;
--foreground:240 10% 3.9%;
--card:0 0% 100%;
--card-foreground:240 10% 3.9%;
--popover:0 0% 100%;
--popover-foreground:240 10% 3.9%;
--radius:0.5rem;
}

/* Dark mode tokens */
.dark{
--primary:21 89% 52%;
--primary-foreground:0 0% 98%;
--secondary:240 3.7% 15.9%;
--secondary-foreground:0 0% 98%;
--muted:240 3.7% 15.9%;
--muted-foreground:240 5% 64.9%;
--accent:240 3.7% 15.9%;
--accent-foreground:0 0% 98%;
--destructive:0 62.8% 30.6%;
--destructive-foreground:0 0% 98%;
--border:240 3.7% 15.9%;
--input:240 3.7% 15.9%;
--ring:21 89% 52%;
--background:240 10% 3.9%;
--foreground:0 0% 98%;
--card:240 10% 3.9%;
--card-foreground:0 0% 98%;
--popover:240 10% 3.9%;
--popover-foreground:0 0% 98%;
}

/* Touch-friendly minimum sizes */
button,[role="button"],input,select,textarea{min-height:44px;min-width:44px}

/* iOS specific optimizations */
input,textarea,select{font-size:16px!important;-webkit-appearance:none;appearance:none}

/* Touch interaction improvements */
*{-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none}

/* Keyboard handling */
.keyboard-open{position:fixed;width:100%}

/* Safe area support */
.safe-area-padding-bottom{padding-bottom:env(safe-area-inset-bottom)}

/* Container system */
.container{width:100%;padding-left:1rem;padding-right:1rem;margin-left:auto;margin-right:auto}
@media(min-width:576px){.container{max-width:540px}}
@media(min-width:768px){.container{max-width:720px}}
@media(min-width:992px){.container{max-width:960px}}
@media(min-width:1200px){.container{max-width:1140px}}

/* Navigation styles */
.navbar{position:sticky;top:0;z-index:1000;background:hsla(var(--background),.95);backdrop-filter:blur(20px);border-bottom:1px solid hsl(var(--border))}

/* Button base styles */
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0.75rem 1.5rem;border-radius:0.75rem;font-size:1rem;font-weight:600;text-decoration:none;cursor:pointer;transition:all 0.2s ease;user-select:none;border:none;position:relative;overflow:hidden}

.btn-primary{background:hsl(var(--primary));color:hsl(var(--primary-foreground));box-shadow:0 4px 12px hsla(var(--primary),.3)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 6px 20px hsla(var(--primary),.4)}

/* Loading states */
.loading-placeholder{background:linear-gradient(90deg,hsl(var(--muted)) 25%,hsl(var(--accent)) 50%,hsl(var(--muted)) 75%);background-size:200% 100%;animation:loading 2s infinite}
@keyframes loading{0%{background-position:200% 0}100%{background-position:-200% 0}}

/* Animation optimizations */
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:0.01ms!important;animation-iteration-count:1!important;transition-duration:0.01ms!important}}

/* Hardware acceleration */
.animate{will-change:transform,opacity;transform:translateZ(0);backface-visibility:hidden}
`;

/**
 * CSS optimization utilities
 */
export class CSSOptimizer {
  private static injectedCritical = false;

  /**
   * Inject critical CSS into document head
   */
  static injectCriticalCSS(): void {
    if (this.injectedCritical || typeof document === 'undefined') return;

    const style = document.createElement('style');
    style.textContent = CRITICAL_CSS;
    style.setAttribute('data-critical', 'true');
    document.head.insertBefore(style, document.head.firstChild);
    
    this.injectedCritical = true;
  }

  /**
   * Preload non-critical CSS
   */
  static preloadCSS(href: string): void {
    if (typeof document === 'undefined') return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    link.onload = () => {
      link.rel = 'stylesheet';
    };
    document.head.appendChild(link);
  }

  /**
   * Remove unused CSS classes (basic implementation)
   */
  static removeUnusedCSS(): void {
    if (typeof document === 'undefined') return;

    const usedClasses = new Set<string>();
    
    // Collect all used classes
    document.querySelectorAll('*').forEach(element => {
      element.classList.forEach(className => {
        usedClasses.add(className);
      });
    });

    // Log unused classes in development
    if (import.meta.env.DEV) {
      console.log('Used CSS classes:', usedClasses.size);
    }
  }

  /**
   * Monitor CSS loading performance
   */
  static monitorCSSPerformance(): void {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.endsWith('.css')) {
          console.log(`CSS loaded: ${entry.name} in ${entry.duration.toFixed(2)}ms`);
        }
      }
    });

    observer.observe({ entryTypes: ['resource'] });
  }
}

/**
 * Font loading optimization
 */
export class FontOptimizer {
  private static loadedFonts = new Set<string>();

  /**
   * Preload critical font files
   */
  static preloadFonts(fonts: string[]): void {
    if (typeof document === 'undefined') return;

    fonts.forEach(fontUrl => {
      if (this.loadedFonts.has(fontUrl)) return;

      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.href = fontUrl;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);

      this.loadedFonts.add(fontUrl);
    });
  }

  /**
   * Use font display swap for better performance
   */
  static enableFontDisplaySwap(): void {
    if (typeof document === 'undefined') return;

    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Inter';
        font-display: swap;
      }
      @font-face {
        font-family: 'Poppins';
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Resource hints for better loading performance
 */
export function addResourceHints(): void {
  if (typeof document === 'undefined') return;

  const hints = [
    { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
    { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' }
  ];

  hints.forEach(hint => {
    const link = document.createElement('link');
    link.rel = hint.rel;
    link.href = hint.href;
    if ('crossOrigin' in hint) {
      link.crossOrigin = hint.crossOrigin;
    }
    document.head.appendChild(link);
  });
}

/**
 * Initialize all CSS optimizations
 */
export function initializeCSSOptimizations(): void {
  // Inject critical CSS immediately
  CSSOptimizer.injectCriticalCSS();
  
  // Add resource hints
  addResourceHints();
  
  // Enable font optimizations
  FontOptimizer.enableFontDisplaySwap();
  
  // Preload critical fonts
  // Preload critical fonts only if served locally; otherwise rely on Google Fonts
  if (import.meta.env.VITE_PRELOAD_LOCAL_FONTS === 'true') {
    FontOptimizer.preloadFonts([
      '/fonts/inter-v12-latin-regular.woff2',
      '/fonts/inter-v12-latin-600.woff2'
    ]);
  }

  // Monitor performance in development
  if (import.meta.env.DEV) {
    CSSOptimizer.monitorCSSPerformance();
  }
}