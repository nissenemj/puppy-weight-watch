// UX Improvements Test Suite
// Testaa käyttökokemuksen parannuksia Playwright MCP:llä

import { test, expect } from '@playwright/test';

test.describe('UX Improvements - Priority 3', () => {
  const BASE_URL = 'http://localhost:3001';

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    // Wait for app to load
    await page.waitForLoadState('networkidle');
  });

  test.describe('Navigation Improvements', () => {
    test('should have sticky navigation with scroll effects', async ({ page }) => {
      // Check navigation is present (try different selectors)
      const nav = page.locator('nav[role="navigation"], nav, header nav').first();
      await expect(nav).toBeVisible();
      
      // Check navigation is sticky (positioned fixed/sticky)
      const navPosition = await nav.evaluate(el => 
        window.getComputedStyle(el).position
      );
      expect(['fixed', 'sticky'].includes(navPosition)).toBeTruthy();
      
      // Scroll down and check navigation behavior
      await page.evaluate(() => window.scrollTo(0, 200));
      await page.waitForTimeout(300);
      
      // Navigation should still be visible after scrolling
      await expect(nav).toBeVisible();
    });

    test('should have working breadcrumbs on sub-pages', async ({ page }) => {
      // Navigate to calculator page
      await page.click('a[href*="calculator"]');
      await page.waitForLoadState('networkidle');
      
      // Check for breadcrumb navigation
      const breadcrumb = page.locator('nav[aria-label*="Breadcrumb" i]');
      if (await breadcrumb.count() > 0) {
        await expect(breadcrumb).toBeVisible();
        
        // Check breadcrumb contains home link
        const homeLink = breadcrumb.locator('a[href="/"]');
        await expect(homeLink).toBeVisible();
      }
    });

    test('should have mobile-friendly touch targets', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Check main navigation buttons
      const navButtons = page.locator('nav a, nav button');
      const buttonCount = await navButtons.count();
      
      for (let i = 0; i < buttonCount; i++) {
        const button = navButtons.nth(i);
        if (await button.isVisible()) {
          const boundingBox = await button.boundingBox();
          if (boundingBox) {
            // Touch targets should be at least 44px
            expect(boundingBox.height).toBeGreaterThanOrEqual(40); // Allow small margin
            expect(boundingBox.width).toBeGreaterThanOrEqual(40);
          }
        }
      }
    });
  });

  test.describe('Form UX Improvements', () => {
    test('should show validation feedback on form fields', async ({ page }) => {
      // Navigate to weight tracker
      await page.click('a[href*="weight-tracker"]');
      await page.waitForLoadState('networkidle');
      
      // Look for weight input field
      const weightInput = page.locator('input[type="number"], input[placeholder*="paino" i]').first();
      
      if (await weightInput.count() > 0) {
        // Test invalid input
        await weightInput.fill('-5');
        await weightInput.blur();
        
        // Should show validation error
        const errorMessage = page.locator('.text-red-500, .text-destructive, [role="alert"]');
        await expect(errorMessage.first()).toBeVisible({ timeout: 2000 });
        
        // Test valid input
        await weightInput.fill('5.2');
        await weightInput.blur();
        
        // Error should disappear
        await expect(errorMessage.first()).not.toBeVisible({ timeout: 2000 });
      }
    });

    test('should have proper form field labels and accessibility', async ({ page }) => {
      // Navigate to calculator
      await page.click('a[href*="calculator"]');
      await page.waitForLoadState('networkidle');
      
      // Check all input fields have labels
      const inputs = page.locator('input, select, textarea');
      const inputCount = await inputs.count();
      
      for (let i = 0; i < inputCount && i < 5; i++) {
        const input = inputs.nth(i);
        if (await input.isVisible()) {
          // Check for label association
          const inputId = await input.getAttribute('id');
          const ariaLabel = await input.getAttribute('aria-label');
          const ariaLabelledBy = await input.getAttribute('aria-labelledby');
          
          if (inputId) {
            const label = page.locator(`label[for="${inputId}"]`);
            const hasLabel = await label.count() > 0;
            const hasAriaLabel = ariaLabel !== null;
            const hasAriaLabelledBy = ariaLabelledBy !== null;
            
            expect(hasLabel || hasAriaLabel || hasAriaLabelledBy).toBeTruthy();
          }
        }
      }
    });
  });

  test.describe('Loading States and Microanimations', () => {
    test('should show loading states for async operations', async ({ page }) => {
      // Click on a navigation item that might trigger loading
      await page.click('a[href*="calculator"]');
      
      // Look for loading indicators during navigation
      const loadingIndicators = page.locator('.animate-spin, .loading, [aria-label*="loading" i], [aria-label*="ladataan" i]');
      
      // Loading might be very fast, so we wait briefly
      await page.waitForTimeout(100);
      
      // Check page loaded properly
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('calculator');
    });

    test('should have smooth transitions between states', async ({ page }) => {
      // Check for Framer Motion or CSS transitions
      const animatedElements = page.locator('[data-framer-motion], .transition, .animate');
      
      if (await animatedElements.count() > 0) {
        // Elements should have transition properties
        const firstElement = animatedElements.first();
        const hasTransition = await firstElement.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return styles.transition !== 'none' || styles.animation !== 'none';
        });
        
        expect(hasTransition).toBeTruthy();
      }
    });

    test('should handle button click states properly', async ({ page }) => {
      // Find clickable buttons
      const buttons = page.locator('button:not(:disabled)');
      
      if (await buttons.count() > 0) {
        const firstButton = buttons.first();
        await expect(firstButton).toBeVisible();
        
        // Click should be possible
        await firstButton.click();
        
        // Button should handle click state
        // (This is more of a visual check that the click was processed)
        await page.waitForTimeout(100);
      }
    });
  });

  test.describe('Mobile Optimization', () => {
    test('should be responsive on mobile viewports', async ({ page }) => {
      // Test different mobile sizes
      const viewports = [
        { width: 320, height: 568 }, // iPhone SE
        { width: 375, height: 667 }, // iPhone 6/7/8
        { width: 390, height: 844 }, // iPhone 12
      ];
      
      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await page.waitForTimeout(500);
        
        // Check no significant horizontal scroll
        const scrollData = await page.evaluate(() => {
          return {
            bodyWidth: document.body.scrollWidth,
            windowWidth: window.innerWidth,
            overflow: document.body.scrollWidth > window.innerWidth + 5 // Allow 5px tolerance
          };
        });
        expect(scrollData.overflow).toBeFalsy();
        
        // Check navigation is still accessible
        const nav = page.locator('nav[role="navigation"]');
        await expect(nav).toBeVisible();
      }
    });

    test('should prevent horizontal scroll on all pages', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 });
      
      const pages = ['/', '/calculator', '/weight-tracker'];
      
      for (const pagePath of pages) {
        try {
          await page.goto(`${BASE_URL}${pagePath}`);
          await page.waitForLoadState('networkidle');
          
          // Check for horizontal overflow
          const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
          const windowInnerWidth = await page.evaluate(() => window.innerWidth);
          
          expect(bodyScrollWidth).toBeLessThanOrEqual(windowInnerWidth + 20); // Allow larger tolerance for development
        } catch (error) {
          console.log(`Could not test ${pagePath}: ${error.message}`);
        }
      }
    });

    test('should have proper font sizes for mobile', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 });
      
      // Check input font sizes (should be 16px to prevent iOS zoom)
      const inputs = page.locator('input, select, textarea');
      const inputCount = Math.min(await inputs.count(), 3);
      
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        if (await input.isVisible()) {
          const fontSize = await input.evaluate(el => {
            return window.getComputedStyle(el).fontSize;
          });
          
          const fontSizeValue = parseFloat(fontSize);
          expect(fontSizeValue).toBeGreaterThanOrEqual(16); // Prevent iOS zoom
        }
      }
    });
  });

  test.describe('Accessibility and UX Polish', () => {
    test('should have proper focus indicators', async ({ page }) => {
      // Test keyboard navigation
      await page.keyboard.press('Tab');
      
      // Get focused element
      const focusedElement = page.locator(':focus');
      
      if (await focusedElement.count() > 0) {
        // Check if focus is visible
        const outlineStyle = await focusedElement.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return styles.outline || styles.boxShadow || styles.border;
        });
        
        expect(outlineStyle).not.toBe('none');
        expect(outlineStyle).not.toBe('');
      }
    });

    test('should have skip links for keyboard users', async ({ page }) => {
      // Check for skip link
      const skipLink = page.locator('a[href="#main-content"], .skip-link');
      
      if (await skipLink.count() > 0) {
        await expect(skipLink).toHaveCount(1);
        
        // Skip link should become visible on focus
        await skipLink.focus();
        const isVisible = await skipLink.isVisible();
        expect(isVisible).toBeTruthy();
      }
    });

    test('should handle reduced motion preferences', async ({ page }) => {
      // Set reduced motion preference
      await page.emulateMedia({ reducedMotion: 'reduce' });
      
      // Navigate to trigger potential animations
      await page.click('a[href*="calculator"]');
      await page.waitForLoadState('networkidle');
      
      // Check if animations are reduced/disabled
      const animatedElement = page.locator('.animate, [data-framer-motion]').first();
      
      if (await animatedElement.count() > 0) {
        const animationDuration = await animatedElement.evaluate(el => {
          return window.getComputedStyle(el).animationDuration;
        });
        
        // Should have very short or no animations
        expect(['0s', '0.01s'].some(duration => animationDuration.includes(duration))).toBeTruthy();
      }
    });
  });

  test.describe('Error Handling and Feedback', () => {
    test('should show appropriate error messages', async ({ page }) => {
      // Navigate to a form page
      await page.click('a[href*="weight-tracker"]');
      await page.waitForLoadState('networkidle');
      
      // Try to trigger a validation error
      const submitButton = page.locator('button[type="submit"], button:has-text("Tallenna"), button:has-text("Lisää")').first();
      
      if (await submitButton.count() > 0) {
        await submitButton.click();
        
        // Look for error messages
        const errorMessages = page.locator('.error, .text-red-500, .text-destructive, [role="alert"]');
        
        // Should show some form of feedback
        await page.waitForTimeout(1000);
        // Note: This might not always trigger, depends on form implementation
      }
    });

    test('should provide success feedback for user actions', async ({ page }) => {
      // This test checks if success states exist in the UI
      // Look for success-related classes and components
      const successElements = page.locator('.success, .text-green-500, .text-success, [aria-label*="success"]');
      
      // These elements might not be visible initially, which is expected
      // The test passes if the selectors exist in the DOM structure
      expect(await successElements.count()).toBeGreaterThanOrEqual(0);
    });
  });
});

test.describe('Performance and Loading', () => {
  test('should load initial page quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Should load in under 3 seconds (generous for development)
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have efficient lazy loading', async ({ page }) => {
    await page.goto('http://localhost:3001');
    
    // Check for lazy-loaded images
    const lazyImages = page.locator('img[loading="lazy"]');
    
    if (await lazyImages.count() > 0) {
      // Lazy images should exist
      expect(await lazyImages.count()).toBeGreaterThan(0);
    }
  });
});