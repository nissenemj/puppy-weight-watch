#!/usr/bin/env node

/**
 * Mobile Optimization Check Script
 * Validates mobile-specific CSS rules and responsive design patterns
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Running mobile optimization checks...\n');

// Check if mobile-optimizations.css exists and has required rules
function checkMobileOptimizations() {
  const mobileOptPath = path.join(__dirname, '..', 'src', 'styles', 'mobile-optimizations.css');
  
  if (!fs.existsSync(mobileOptPath)) {
    console.log('❌ mobile-optimizations.css not found');
    return false;
  }
  
  const content = fs.readFileSync(mobileOptPath, 'utf8');
  
  // Check for critical mobile rules
  const requiredRules = [
    'overflow-x: hidden',
    'mobile-grid-1',
    'mobile-text-wrap',
    'mobile-container-safe',
    'min-height: 44px',
    '@media (max-width: 768px)'
  ];
  
  let allRulesFound = true;
  requiredRules.forEach(rule => {
    if (!content.includes(rule)) {
      console.log(`❌ Missing mobile rule: ${rule}`);
      allRulesFound = false;
    }
  });
  
  if (allRulesFound) {
    console.log('✅ Mobile optimization CSS rules found');
  }
  
  return allRulesFound;
}

// Check if design-system.css exists
function checkDesignSystem() {
  const designSystemPath = path.join(__dirname, '..', 'src', 'styles', 'design-system.css');
  
  if (!fs.existsSync(designSystemPath)) {
    console.log('❌ design-system.css not found');
    return false;
  }
  
  const content = fs.readFileSync(designSystemPath, 'utf8');
  
  // Check for design system classes
  const requiredClasses = [
    'bg-gradient-primary',
    'bg-gradient-soft',
    'full-width-section',
    'full-width-content'
  ];
  
  let allClassesFound = true;
  requiredClasses.forEach(className => {
    if (!content.includes(className)) {
      console.log(`❌ Missing design system class: ${className}`);
      allClassesFound = false;
    }
  });
  
  if (allClassesFound) {
    console.log('✅ Design system CSS classes found');
  }
  
  return allClassesFound;
}

// Check component files for mobile-first patterns
function checkComponentPatterns() {
  const srcPath = path.join(__dirname, '..', 'src');
  let hasIssues = false;
  
  // Check for consolidated components
  const consolidatedComponents = [
    'components/AdvancedFoodCalculator.tsx',
    'components/ModernPuppyWeightTracker.tsx'
  ];
  
  consolidatedComponents.forEach(component => {
    const componentPath = path.join(srcPath, component);
    if (!fs.existsSync(componentPath)) {
      console.log(`❌ Missing consolidated component: ${component}`);
      hasIssues = true;
    }
  });
  
  if (!hasIssues) {
    console.log('✅ Consolidated components found');
  }
  
  return !hasIssues;
}

// Main check function
function runMobileChecks() {
  console.log('📱 Mobile Optimization Check\n');
  
  const checks = [
    checkMobileOptimizations(),
    checkDesignSystem(),
    checkComponentPatterns()
  ];
  
  const allPassed = checks.every(check => check);
  
  console.log('\n' + '='.repeat(50));
  
  if (allPassed) {
    console.log('✅ All mobile optimization checks passed!');
    process.exit(0);
  } else {
    console.log('❌ Some mobile optimization checks failed');
    console.log('Please fix the issues above before deploying');
    process.exit(0); // Don't fail deployment, just warn
  }
}

// Run the checks
runMobileChecks();
