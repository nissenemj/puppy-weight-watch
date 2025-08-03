/**
 * Enhanced Touch Gesture Handler
 * Provides swipe, pinch, and other touch gesture support
 */
export interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface SwipeGesture {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  velocity: number;
}

export interface PinchGesture {
  scale: number;
  center: TouchPoint;
}

export interface TouchGestureOptions {
  swipeThreshold?: number;
  velocityThreshold?: number;
  pinchThreshold?: number;
  preventDefault?: boolean;
}

export class TouchGestureHandler {
  private element: HTMLElement;
  private options: Required<TouchGestureOptions>;
  private startTouches: TouchPoint[] = [];
  private currentTouches: TouchPoint[] = [];
  private initialDistance: number = 0;
  private initialScale: number = 1;

  // Event callbacks
  public onSwipe?: (gesture: SwipeGesture) => void;
  public onPinch?: (gesture: PinchGesture) => void;
  public onTap?: (point: TouchPoint) => void;
  public onDoubleTap?: (point: TouchPoint) => void;

  private lastTapTime: number = 0;
  private doubleTapDelay: number = 300;

  constructor(element: HTMLElement, options: TouchGestureOptions = {}) {
    this.element = element;
    this.options = {
      swipeThreshold: options.swipeThreshold || 50,
      velocityThreshold: options.velocityThreshold || 0.3,
      pinchThreshold: options.pinchThreshold || 0.1,
      preventDefault: options.preventDefault !== false
    };

    this.init();
  }

  private init(): void {
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    this.element.addEventListener('touchcancel', this.handleTouchEnd.bind(this));
  }

  private handleTouchStart(e: TouchEvent): void {
    this.startTouches = this.getTouchPoints(e);
    this.currentTouches = [...this.startTouches];

    if (e.touches.length === 2) {
      this.initialDistance = this.getDistance(this.startTouches[0], this.startTouches[1]);
      this.initialScale = 1;
    }

    if (this.options.preventDefault && e.touches.length > 1) {
      e.preventDefault();
    }
  }

  private handleTouchMove(e: TouchEvent): void {
    this.currentTouches = this.getTouchPoints(e);

    if (e.touches.length === 2 && this.onPinch) {
      this.handlePinch();
    }

    if (this.options.preventDefault && e.touches.length > 1) {
      e.preventDefault();
    }
  }

  private handleTouchEnd(e: TouchEvent): void {
    if (this.startTouches.length === 1 && this.currentTouches.length === 1) {
      const gesture = this.analyzeSwipe();
      
      if (gesture) {
        this.onSwipe?.(gesture);
      } else {
        this.handleTap();
      }
    }

    this.startTouches = [];
    this.currentTouches = [];
    this.initialDistance = 0;
    this.initialScale = 1;
  }

  private getTouchPoints(e: TouchEvent): TouchPoint[] {
    return Array.from(e.touches).map(touch => ({
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    }));
  }

  private getDistance(point1: TouchPoint, point2: TouchPoint): number {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private analyzeSwipe(): SwipeGesture | null {
    if (this.startTouches.length !== 1 || this.currentTouches.length !== 1) {
      return null;
    }

    const start = this.startTouches[0];
    const end = this.currentTouches[0];
    
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const timeDelta = end.timestamp - start.timestamp;
    const velocity = distance / timeDelta;

    if (distance < this.options.swipeThreshold || velocity < this.options.velocityThreshold) {
      return null;
    }

    let direction: SwipeGesture['direction'];
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }

    return {
      direction,
      distance,
      velocity
    };
  }

  private handlePinch(): void {
    if (this.currentTouches.length !== 2 || !this.onPinch) {
      return;
    }

    const currentDistance = this.getDistance(this.currentTouches[0], this.currentTouches[1]);
    const scale = currentDistance / this.initialDistance;
    
    if (Math.abs(scale - this.initialScale) > this.options.pinchThreshold) {
      const center: TouchPoint = {
        x: (this.currentTouches[0].x + this.currentTouches[1].x) / 2,
        y: (this.currentTouches[0].y + this.currentTouches[1].y) / 2,
        timestamp: Date.now()
      };

      this.onPinch({
        scale,
        center
      });

      this.initialScale = scale;
    }
  }

  private handleTap(): void {
    const now = Date.now();
    const point = this.currentTouches[0];

    if (now - this.lastTapTime < this.doubleTapDelay) {
      this.onDoubleTap?.(point);
    } else {
      this.onTap?.(point);
    }

    this.lastTapTime = now;
  }

  public destroy(): void {
    this.element.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    this.element.removeEventListener('touchmove', this.handleTouchMove.bind(this));
    this.element.removeEventListener('touchend', this.handleTouchEnd.bind(this));
    this.element.removeEventListener('touchcancel', this.handleTouchEnd.bind(this));
  }
}

import React from 'react';

// React hook for touch gestures

export function useTouchGestures(
  elementRef: React.RefObject<HTMLElement>,
  options: TouchGestureOptions = {}
) {
  const [gestureHandler, setGestureHandler] = React.useState<TouchGestureHandler | null>(null);

  React.useEffect(() => {
    if (elementRef.current) {
      const handler = new TouchGestureHandler(elementRef.current, options);
      setGestureHandler(handler);

      return () => {
        handler.destroy();
      };
    }
  }, [elementRef, options]);

  return gestureHandler;
}