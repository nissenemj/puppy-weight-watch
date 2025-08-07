import React, { useEffect } from 'react';

interface MobileOptimizationWrapperProps {
  children: React.ReactNode;
}

export default function MobileOptimizationWrapper({ children }: MobileOptimizationWrapperProps) {
  useEffect(() => {
    // Force mobile optimizations on mount
    const applyMobileOptimizations = () => {
      // Prevent horizontal scroll
      document.body.style.overflowX = 'hidden';
      document.documentElement.style.overflowX = 'hidden';
      document.body.style.maxWidth = '100vw';
      document.documentElement.style.maxWidth = '100vw';
      
      // Fix viewport meta tag if needed
      let viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        viewport = document.createElement('meta');
        viewport.setAttribute('name', 'viewport');
        document.head.appendChild(viewport);
      }
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
      
      // Add mobile-specific styles
      const style = document.createElement('style');
      style.textContent = `
        /* Force mobile optimizations */
        * {
          box-sizing: border-box !important;
          max-width: 100% !important;
        }
        
        /* Fix touch targets */
        button, a, input[type="button"], input[type="submit"], [role="button"] {
          min-height: 44px !important;
          min-width: 44px !important;
          touch-action: manipulation;
        }
        
        /* Fix form inputs */
        input, textarea, select {
          font-size: 16px !important;
          transform-origin: left top;
          transition: none !important;
        }
        
        /* Prevent zoom on focus */
        input:focus, textarea:focus, select:focus {
          font-size: 16px !important;
        }
        
        /* Fix images */
        img {
          max-width: 100% !important;
          height: auto !important;
        }
        
        /* Mobile performance optimizations */
        @media (max-width: 768px) {
          * {
            transition-duration: 0.1s !important;
            animation-duration: 0.1s !important;
          }
          
          .shadow-xl, .shadow-2xl, .shadow-lg {
            box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
          }
          
          .backdrop-blur-lg, .backdrop-blur-xl {
            backdrop-filter: blur(2px) !important;
          }
        }
      `;
      
      if (!document.head.querySelector('#mobile-optimizations')) {
        style.id = 'mobile-optimizations';
        document.head.appendChild(style);
      }
      
      // Fix any overflowing elements
      const checkOverflow = () => {
        const elements = document.querySelectorAll('*');
        elements.forEach((element) => {
          const rect = element.getBoundingClientRect();
          if (rect.width > window.innerWidth) {
            (element as HTMLElement).style.maxWidth = '100%';
            (element as HTMLElement).style.overflowX = 'hidden';
          }
        });
      };
      
      // Initial check
      setTimeout(checkOverflow, 100);
      
      // Check on resize
      window.addEventListener('resize', checkOverflow);
      
      return () => {
        window.removeEventListener('resize', checkOverflow);
      };
    };
    
    return applyMobileOptimizations();
  }, []);
  
  useEffect(() => {
    // Continuous monitoring for mobile optimization
    const interval = setInterval(() => {
      // Check and fix horizontal scroll
      if (document.body.scrollWidth > window.innerWidth) {
        document.body.style.overflowX = 'hidden';
        console.warn('Fixed horizontal scroll detected');
      }
      
      // Check for elements causing overflow
      const overflowElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > window.innerWidth + 10; // 10px tolerance
      });
      
      if (overflowElements.length > 0) {
        console.warn(`Found ${overflowElements.length} elements causing overflow:`, overflowElements);
        overflowElements.forEach(el => {
          (el as HTMLElement).style.maxWidth = '100%';
          (el as HTMLElement).style.overflowX = 'hidden';
        });
      }
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  return <>{children}</>;
}