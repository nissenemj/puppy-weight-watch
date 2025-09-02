/* ===== PUPPY WEIGHT WATCH ANIMATION LIBRARY ===== */
/* Framer Motion variants and animation configurations */

import { Variants, Transition } from 'framer-motion'

// ===== EASING FUNCTIONS =====
export const easings = {
  // Material Design inspired
  standard: [0.4, 0.0, 0.2, 1],
  decelerated: [0.0, 0.0, 0.2, 1],
  accelerated: [0.4, 0.0, 1, 1],
  
  // Custom puppy-themed (bouncy)
  puppy: [0.68, -0.55, 0.265, 1.55],
  gentle: [0.25, 0.46, 0.45, 0.94],
  playful: [0.175, 0.885, 0.32, 1.275]
} as const

// ===== CLAUDE-INSPIRED TRANSITIONS =====
export const transitions = {
  fast: { duration: 0.25, ease: easings.standard },
  base: { duration: 0.35, ease: easings.standard },
  slow: { duration: 0.45, ease: easings.standard },
  bounce: { duration: 0.4, ease: easings.puppy },
  gentle: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } // Claude's cubic-bezier
} as const

// ===== PAGE TRANSITIONS =====
export const pageTransitions: { [key: string]: Variants } = {
  // Slide transitions
  slideLeft: {
    initial: { x: 300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 }
  },
  
  slideRight: {
    initial: { x: -300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 300, opacity: 0 }
  },
  
  slideUp: {
    initial: { y: 300, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -100, opacity: 0 }
  },
  
  // Fade transitions
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  
  // Scale transitions
  scale: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 }
  }
}

// ===== ENTRANCE ANIMATIONS =====
export const entranceAnimations: { [key: string]: Variants } = {
  // Fade in from bottom
  fadeInUp: {
    hidden: { y: 60, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  },
  
  // Fade in from top
  fadeInDown: {
    hidden: { y: -60, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  },
  
  // Fade in from left
  fadeInLeft: {
    hidden: { x: -60, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  },
  
  // Fade in from right
  fadeInRight: {
    hidden: { x: 60, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  },
  
  // Scale in
  scaleIn: {
    hidden: { scale: 0.5, opacity: 0 },
    visible: { scale: 1, opacity: 1 }
  },
  
  // Puppy bounce in
  bounceIn: {
    hidden: { scale: 0.3, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: transitions.bounce
    }
  },
  
  // Stagger children container
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  },
  
  // Stagger child item
  staggerChild: {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: transitions.base
    }
  }
}

// ===== HOVER ANIMATIONS =====
export const hoverAnimations = {
  // Gentle lift
  lift: {
    whileHover: {
      y: -4,
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      transition: transitions.fast
    },
    whileTap: { 
      y: -2,
      scale: 0.98,
      transition: transitions.fast 
    }
  },
  
  // Scale up
  scale: {
    whileHover: {
      scale: 1.05,
      transition: transitions.fast
    },
    whileTap: {
      scale: 0.95,
      transition: transitions.fast
    }
  },
  
  // Gentle glow
  glow: {
    whileHover: {
      boxShadow: "0 0 20px rgba(255, 107, 53, 0.3)",
      transition: transitions.base
    }
  },
  
  // Puppy wiggle
  wiggle: {
    whileHover: {
      rotate: [0, -1, 1, -1, 0],
      transition: { duration: 0.5 }
    }
  },
  
  // Button press
  press: {
    whileTap: {
      scale: 0.96,
      transition: transitions.fast
    }
  }
}

// ===== LOADING ANIMATIONS =====
export const loadingAnimations: { [key: string]: Variants } = {
  // Spinning loader
  spin: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  },
  
  // Pulsing dot
  pulse: {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },
  
  // Bouncing dots (for 3-dot loader)
  bounceDot: {
    animate: {
      y: [0, -16, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }
}

// ===== MODAL ANIMATIONS =====
export const modalAnimations: { [key: string]: Variants } = {
  // Backdrop fade
  backdrop: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  },
  
  // Modal slide up
  modal: {
    hidden: { 
      y: 100,
      opacity: 0,
      scale: 0.9
    },
    visible: { 
      y: 0,
      opacity: 1,
      scale: 1,
      transition: transitions.gentle
    },
    exit: { 
      y: 100,
      opacity: 0,
      scale: 0.9,
      transition: transitions.fast
    }
  }
}

// ===== UTILITY FUNCTIONS =====
export const createStaggerAnimation = (staggerDelay: number = 0.1) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: staggerDelay
    }
  }
})

export const createDelayedAnimation = (delay: number = 0) => ({
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      ...transitions.base,
      delay
    }
  }
})

// ===== PRESETS FOR COMMON COMPONENTS =====
export const componentAnimations = {
  // Card animations
  card: {
    ...hoverAnimations.lift,
    initial: "hidden",
    animate: "visible",
    variants: entranceAnimations.fadeInUp,
    transition: transitions.base
  },
  
  // Button animations
  button: {
    ...hoverAnimations.scale,
    ...hoverAnimations.press
  },
  
  // Navigation animations
  nav: {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { ...transitions.gentle, delay: 0.2 }
  },
  
  // Hero section
  hero: {
    initial: "hidden",
    animate: "visible",
    variants: entranceAnimations.staggerContainer,
    transition: transitions.gentle
  }
}