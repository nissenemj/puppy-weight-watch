/**
 * Virtual Keyboard Handler for iOS and Android devices
 * Handles viewport adjustments when virtual keyboard appears/disappears
 */
export class VirtualKeyboardHandler {
  private initialViewportHeight: number;
  private currentViewportHeight: number;
  private isKeyboardOpen: boolean = false;
  private activeInput: HTMLElement | null = null;

  constructor() {
    this.initialViewportHeight = window.innerHeight;
    this.currentViewportHeight = window.innerHeight;
    this.init();
  }

  private init(): void {
    // Listen for viewport changes
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Focus/blur events for inputs
    document.addEventListener('focusin', this.handleFocusIn.bind(this));
    document.addEventListener('focusout', this.handleFocusOut.bind(this));

    // Visual viewport API support (modern browsers)
    if ('visualViewport' in window) {
      window.visualViewport?.addEventListener('resize', this.handleVisualViewportResize.bind(this));
    }
  }

  private handleResize(): void {
    this.currentViewportHeight = window.innerHeight;
    const heightDifference = this.initialViewportHeight - this.currentViewportHeight;
    
    if (heightDifference > 150) {
      this.onKeyboardOpen();
    } else {
      this.onKeyboardClose();
    }
  }

  private handleVisualViewportResize(): void {
    if (window.visualViewport) {
      const keyboardHeight = window.innerHeight - window.visualViewport.height;
      
      if (keyboardHeight > 150) {
        this.onKeyboardOpen();
      } else {
        this.onKeyboardClose();
      }
    }
  }

  private handleFocusIn(e: Event): void {
    const target = e.target as HTMLElement;
    
    if (this.isInputElement(target)) {
      this.activeInput = target;
      
      // Prevent zoom on iOS for inputs with font-size < 16px
      if (this.isIOS()) {
        const computedStyle = window.getComputedStyle(target);
        const fontSize = parseFloat(computedStyle.fontSize);
        
        if (fontSize < 16) {
          target.style.fontSize = '16px';
          target.dataset.originalFontSize = computedStyle.fontSize;
        }
      }

      // Delay scroll to allow keyboard animation
      setTimeout(() => {
        this.scrollToInput(target);
      }, 300);
    }
  }

  private handleFocusOut(e: Event): void {
    const target = e.target as HTMLElement;
    
    if (this.isInputElement(target)) {
      // Restore original font size
      if (target.dataset.originalFontSize) {
        target.style.fontSize = target.dataset.originalFontSize;
        delete target.dataset.originalFontSize;
      }
      
      this.activeInput = null;
    }
  }

  private onKeyboardOpen(): void {
    if (!this.isKeyboardOpen) {
      this.isKeyboardOpen = true;
      document.body.classList.add('keyboard-open');
      
      // Adjust fixed elements
      this.adjustFixedElements();
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('keyboardopen'));
    }
  }

  private onKeyboardClose(): void {
    if (this.isKeyboardOpen) {
      this.isKeyboardOpen = false;
      document.body.classList.remove('keyboard-open');
      
      // Reset fixed elements
      this.resetFixedElements();
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('keyboardclose'));
    }
  }

  private scrollToInput(input: HTMLElement): void {
    const rect = input.getBoundingClientRect();
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    const scrollOffset = 20; // Extra padding
    
    if (rect.bottom > viewportHeight - scrollOffset) {
      const scrollAmount = rect.bottom - (viewportHeight - scrollOffset);
      window.scrollBy({
        top: scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  private adjustFixedElements(): void {
    const keyboardHeight = this.initialViewportHeight - this.currentViewportHeight;
    
    // Adjust elements with fixed bottom positioning
    const fixedElements = document.querySelectorAll<HTMLElement>('.fixed-bottom, [style*="position: fixed"]');
    fixedElements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      if (computedStyle.position === 'fixed' && computedStyle.bottom !== 'auto') {
        element.style.bottom = `${keyboardHeight}px`;
        element.dataset.originalBottom = computedStyle.bottom;
      }
    });
  }

  private resetFixedElements(): void {
    const fixedElements = document.querySelectorAll<HTMLElement>('[data-original-bottom]');
    fixedElements.forEach(element => {
      element.style.bottom = element.dataset.originalBottom || '';
      delete element.dataset.originalBottom;
    });
  }

  private isInputElement(element: HTMLElement): boolean {
    const inputTypes = ['input', 'textarea', 'select'];
    return inputTypes.includes(element.tagName.toLowerCase()) ||
           element.contentEditable === 'true';
  }

  private isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  // Public methods
  public getKeyboardHeight(): number {
    return this.initialViewportHeight - this.currentViewportHeight;
  }

  public isKeyboardVisible(): boolean {
    return this.isKeyboardOpen;
  }

  public destroy(): void {
    window.removeEventListener('resize', this.handleResize.bind(this));
    document.removeEventListener('focusin', this.handleFocusIn.bind(this));
    document.removeEventListener('focusout', this.handleFocusOut.bind(this));
    
    if ('visualViewport' in window) {
      window.visualViewport?.removeEventListener('resize', this.handleVisualViewportResize.bind(this));
    }
  }
}