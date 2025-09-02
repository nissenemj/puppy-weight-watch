/**
 * WCAG 2.1 Color Contrast Validation Utilities
 * Ensures all colors meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
 */

// Convert hex to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Calculate relative luminance
export function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio between two colors
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 0;
  
  const l1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

// Check if contrast ratio meets WCAG AA standards
export function meetsWCAGAA(foreground: string, background: string, isLargeText = false): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

// Check if contrast ratio meets WCAG AAA standards
export function meetsWCAGAAA(foreground: string, background: string, isLargeText = false): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
}

// Design system color palette validation
export interface ColorCombination {
  name: string;
  foreground: string;
  background: string;
  usage: string;
  isLargeText?: boolean;
  contrastRatio?: number;
}

export const COLOR_COMBINATIONS: ColorCombination[] = [
  // Primary combinations - Critical interactive elements
  { name: 'Primary on White', foreground: '#e07856', background: '#ffffff', usage: 'Primary buttons, links' },
  { name: 'White on Primary', foreground: '#ffffff', background: '#e07856', usage: 'Primary button text' },
  { name: 'Primary 600 on Primary 100', foreground: '#c15f3c', background: '#fff4f0', usage: 'Badges, pills' },
  { name: 'Primary 700 on Primary 200', foreground: '#a04a2a', background: '#ffe4d9', usage: 'Strong emphasis' },
  
  // Text combinations - Body content
  { name: 'Primary Text on White', foreground: '#2d251c', background: '#ffffff', usage: 'Main body text' },
  { name: 'Secondary Text on White', foreground: '#8b6f4f', background: '#ffffff', usage: 'Secondary text, descriptions' },
  { name: 'Tertiary Text on White', foreground: '#b89878', background: '#ffffff', usage: 'Muted text, placeholders' },
  
  // Interactive elements
  { name: 'Link Blue on White', foreground: '#3b82f6', background: '#ffffff', usage: 'Links, navigation' },
  { name: 'Link Blue on Surface Alt', foreground: '#2563eb', background: '#fbf6f2', usage: 'Links on warm backgrounds' },
  
  // Status colors
  { name: 'Success Green on White', foreground: '#22c55e', background: '#ffffff', usage: 'Success states, confirmations' },
  { name: 'Warning Orange on White', foreground: '#ff9f7f', background: '#ffffff', usage: 'Warning states' },
  { name: 'Error Red on White', foreground: '#ef4444', background: '#ffffff', usage: 'Error states, danger' },
  
  // Surface combinations
  { name: 'Primary Text on Surface Alt', foreground: '#2d251c', background: '#fbf6f2', usage: 'Text on warm neutral surface' },
  { name: 'Secondary Text on Surface Alt', foreground: '#8b6f4f', background: '#fbf6f2', usage: 'Secondary text on warm surface' },
  { name: 'Primary Text on Primary 100', foreground: '#2d251c', background: '#fff4f0', usage: 'Text on primary tinted surface' },
  
  // High contrast combinations for better accessibility
  { name: 'Primary 800 on White', foreground: '#7d3a21', background: '#ffffff', usage: 'High contrast primary text' },
  { name: 'Primary 900 on White', foreground: '#5a2a18', background: '#ffffff', usage: 'Maximum contrast primary text' },
  { name: 'Secondary 700 on White', foreground: '#2563eb', background: '#ffffff', usage: 'High contrast secondary' },
  { name: 'Tertiary 700 on White', foreground: '#16a34a', background: '#ffffff', usage: 'High contrast success' },
];

// Validate all design system colors
export function validateDesignSystemContrast(): {
  passed: ColorCombination[];
  failed: ColorCombination[];
  warnings: ColorCombination[];
} {
  const passed: ColorCombination[] = [];
  const failed: ColorCombination[] = [];
  const warnings: ColorCombination[] = [];
  
  COLOR_COMBINATIONS.forEach(combo => {
    const ratio = getContrastRatio(combo.foreground, combo.background);
    const meetsAA = meetsWCAGAA(combo.foreground, combo.background, combo.isLargeText);
    const meetsAAA = meetsWCAGAAA(combo.foreground, combo.background, combo.isLargeText);
    
    if (meetsAA) {
      passed.push({ ...combo, contrastRatio: ratio });
      if (!meetsAAA) {
        warnings.push({ ...combo, contrastRatio: ratio });
      }
    } else {
      failed.push({ ...combo, contrastRatio: ratio });
    }
  });
  
  return { passed, failed, warnings };
}

// Generate WCAG-compliant color suggestions
export function suggestCompliantColor(foreground: string, background: string, targetRatio = 4.5): string {
  // This is a simplified suggestion - in practice, you'd need more sophisticated color adjustment
  const currentRatio = getContrastRatio(foreground, background);
  
  if (currentRatio >= targetRatio) return foreground;
  
  // Simple darkening/lightening suggestion
  const rgb = hexToRgb(foreground);
  if (!rgb) return foreground;
  
  const bgRgb = hexToRgb(background);
  if (!bgRgb) return foreground;
  
  const bgLuminance = getRelativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
  
  // If background is dark, make foreground lighter, otherwise darker
  const adjustment = bgLuminance > 0.5 ? -20 : 20;
  
  const newR = Math.max(0, Math.min(255, rgb.r + adjustment));
  const newG = Math.max(0, Math.min(255, rgb.g + adjustment));
  const newB = Math.max(0, Math.min(255, rgb.b + adjustment));
  
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}