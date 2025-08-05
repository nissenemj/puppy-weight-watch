// Mobile Optimization Validation Utility
export interface MobileOptimizationReport {
  isOptimized: boolean;
  issues: string[];
  recommendations: string[];
  score: number;
}

export class MobileOptimizationChecker {
  static validateViewport(): boolean {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) return false;
    
    const content = viewport.getAttribute('content') || '';
    return content.includes('width=device-width') && 
           content.includes('initial-scale=1.0');
  }

  static checkHorizontalScroll(): boolean {
    const body = document.body;
    const html = document.documentElement;
    
    const documentWidth = Math.max(
      body.scrollWidth, body.offsetWidth,
      html.clientWidth, html.scrollWidth, html.offsetWidth
    );
    
    return documentWidth <= window.innerWidth;
  }

  static validateTextWrapping(): string[] {
    const issues: string[] = [];
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div');
    
    elements.forEach((element, index) => {
      const computedStyle = window.getComputedStyle(element);
      const hasWordWrap = computedStyle.wordWrap === 'break-word' || 
                         computedStyle.overflowWrap === 'break-word';
      
      if (!hasWordWrap && element.textContent && element.textContent.length > 50) {
        issues.push(`Element ${index}: Text may overflow without word wrapping`);
      }
    });
    
    return issues;
  }

  static checkTouchTargets(): string[] {
    const issues: string[] = [];
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    
    interactiveElements.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      const minSize = 44; // Recommended minimum touch target size
      
      if (rect.width < minSize || rect.height < minSize) {
        issues.push(`Interactive element ${index}: Touch target too small (${Math.round(rect.width)}x${Math.round(rect.height)}px)`);
      }
    });
    
    return issues;
  }

  static checkImageOptimization(): string[] {
    const issues: string[] = [];
    const images = document.querySelectorAll('img');
    
    images.forEach((img, index) => {
      const computedStyle = window.getComputedStyle(img);
      
      if (computedStyle.maxWidth !== '100%') {
        issues.push(`Image ${index}: Not responsive (max-width should be 100%)`);
      }
      
      if (!img.alt || img.alt.trim() === '') {
        issues.push(`Image ${index}: Missing alt text for accessibility`);
      }
    });
    
    return issues;
  }

  static checkFontSizes(): string[] {
    const issues: string[] = [];
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');
    
    textElements.forEach((element, index) => {
      const computedStyle = window.getComputedStyle(element);
      const fontSize = parseInt(computedStyle.fontSize);
      
      if (fontSize < 14) {
        issues.push(`Text element ${index}: Font size too small for mobile (${fontSize}px)`);
      }
    });
    
    return issues;
  }

  static generateReport(): MobileOptimizationReport {
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    // Check viewport
    if (!this.validateViewport()) {
      issues.push('Missing or incorrect viewport meta tag');
      recommendations.push('Add proper viewport meta tag with width=device-width, initial-scale=1.0');
    }
    
    // Check horizontal scroll
    if (!this.checkHorizontalScroll()) {
      issues.push('Page has horizontal scrolling');
      recommendations.push('Add overflow-x: hidden to body and html elements');
    }
    
    // Check text wrapping
    const textIssues = this.validateTextWrapping();
    issues.push(...textIssues);
    if (textIssues.length > 0) {
      recommendations.push('Add word-wrap: break-word to text elements');
    }
    
    // Check touch targets
    const touchIssues = this.checkTouchTargets();
    issues.push(...touchIssues);
    if (touchIssues.length > 0) {
      recommendations.push('Increase touch target sizes to minimum 44x44px');
    }
    
    // Check images
    const imageIssues = this.checkImageOptimization();
    issues.push(...imageIssues);
    if (imageIssues.length > 0) {
      recommendations.push('Make images responsive with max-width: 100%');
    }
    
    // Check font sizes
    const fontIssues = this.checkFontSizes();
    issues.push(...fontIssues);
    if (fontIssues.length > 0) {
      recommendations.push('Increase font sizes to minimum 14px for better readability');
    }
    
    // Calculate score
    const totalChecks = 6;
    const passedChecks = totalChecks - [
      !this.validateViewport(),
      !this.checkHorizontalScroll(),
      textIssues.length > 0,
      touchIssues.length > 0,
      imageIssues.length > 0,
      fontIssues.length > 0
    ].filter(Boolean).length;
    
    const score = Math.round((passedChecks / totalChecks) * 100);
    
    return {
      isOptimized: issues.length === 0,
      issues,
      recommendations,
      score
    };
  }
  
  static runContinuousCheck(intervalMs: number = 5000): () => void {
    const interval = setInterval(() => {
      const report = this.generateReport();
      if (!report.isOptimized) {
        console.warn('Mobile Optimization Issues Detected:', report);
      }
    }, intervalMs);
    
    return () => clearInterval(interval);
  }
}

// Export utility functions for direct use
export const isMobileOptimized = () => MobileOptimizationChecker.generateReport().isOptimized;
export const getMobileOptimizationScore = () => MobileOptimizationChecker.generateReport().score;
export const getMobileOptimizationReport = () => MobileOptimizationChecker.generateReport();