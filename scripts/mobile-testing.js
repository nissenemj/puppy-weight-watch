#!/usr/bin/env node

/**
 * Mobile Testing Suite - Simulates Playwright testing
 * Tests mobile optimizations with real browser measurements
 * 
 * Usage: node scripts/mobile-testing.js
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:4000',
  viewports: [
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'Small Mobile', width: 320, height: 568 },
    { name: 'Galaxy S8', width: 360, height: 740 },
    { name: 'Large Mobile', width: 414, height: 896 }
  ],
  touchTargets: [
    'button:contains("Aloita seuranta – 1 min")',
    'button:contains("Aloita seuranta")',
    'a[aria-label="Aloita seuranta – siirry painonseurantaan"]'
  ]
};

async function runMobileTesting() {
  console.log('🚀 Starting Mobile Testing Suite\n');
  
  const browser = await puppeteer.launch({ 
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const results = {
      touchTargets: {},
      horizontalScroll: {},
      screenshots: {},
      overall: { score: 0, issues: [] }
    };

    for (const viewport of TEST_CONFIG.viewports) {
      console.log(`📱 Testing viewport: ${viewport.name} (${viewport.width}x${viewport.height})`);
      
      const page = await browser.newPage();
      await page.setViewport(viewport);
      
      try {
        await page.goto(TEST_CONFIG.baseUrl, { waitUntil: 'networkidle0' });
        
        // Test touch targets
        const touchTargetResults = await testTouchTargets(page, viewport);
        results.touchTargets[viewport.name] = touchTargetResults;
        
        // Test horizontal scroll
        const scrollResults = await testHorizontalScroll(page, viewport);
        results.horizontalScroll[viewport.name] = scrollResults;
        
        // Take screenshot
        const screenshotPath = `screenshots/mobile-test-${viewport.name.toLowerCase().replace(/\s+/g, '-')}.png`;
        await page.screenshot({ 
          path: screenshotPath, 
          fullPage: true 
        });
        results.screenshots[viewport.name] = screenshotPath;
        
        console.log(`  ✅ Completed testing for ${viewport.name}`);
        
      } catch (error) {
        console.log(`  ❌ Error testing ${viewport.name}:`, error.message);
        results.overall.issues.push(`Error testing ${viewport.name}: ${error.message}`);
      }
      
      await page.close();
    }

    // Generate comprehensive report
    const report = generateMobileTestReport(results);
    
    // Save results
    await fs.promises.writeFile(
      'mobile-test-results.json',
      JSON.stringify(results, null, 2)
    );
    
    printReport(report, results);
    
    return report;
    
  } finally {
    await browser.close();
  }
}

async function testTouchTargets(page, viewport) {
  console.log(`    🎯 Testing touch targets...`);
  
  const results = {
    passed: 0,
    failed: 0,
    details: []
  };

  // Test "Aloita seuranta – 1 min" button
  try {
    const button1 = await page.$('a[aria-label="Aloita seuranta – siirry painonseurantaan"] button');
    if (button1) {
      const box = await button1.boundingBox();
      const passes = box.height >= 44 && box.width >= 44;
      
      results.details.push({
        selector: 'Aloita seuranta – 1 min button',
        width: Math.round(box.width),
        height: Math.round(box.height),
        passes,
        minRequirement: 44
      });
      
      if (passes) results.passed++;
      else results.failed++;
    }
  } catch (error) {
    results.details.push({
      selector: 'Aloita seuranta – 1 min button',
      error: error.message
    });
    results.failed++;
  }

  // Test second "Aloita seuranta" button
  try {
    const buttons = await page.$$('button');
    let foundSecondButton = false;
    
    for (const button of buttons) {
      const text = await button.evaluate(el => el.textContent?.trim());
      if (text === 'Aloita seuranta') {
        const box = await button.boundingBox();
        const passes = box.height >= 44 && box.width >= 44;
        
        results.details.push({
          selector: 'Aloita seuranta button',
          width: Math.round(box.width),
          height: Math.round(box.height),
          passes,
          minRequirement: 44
        });
        
        if (passes) results.passed++;
        else results.failed++;
        
        foundSecondButton = true;
        break;
      }
    }
    
    if (!foundSecondButton) {
      results.details.push({
        selector: 'Aloita seuranta button',
        error: 'Button not found'
      });
      results.failed++;
    }
  } catch (error) {
    results.details.push({
      selector: 'Aloita seuranta button',
      error: error.message
    });
    results.failed++;
  }

  return results;
}

async function testHorizontalScroll(page, viewport) {
  console.log(`    📏 Testing horizontal scroll...`);
  
  const scrollData = await page.evaluate(() => {
    return {
      bodyScrollWidth: document.body.scrollWidth,
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      hasHorizontalScroll: document.body.scrollWidth > window.innerWidth
    };
  });

  return {
    ...scrollData,
    passes: !scrollData.hasHorizontalScroll,
    expected: viewport.width,
    difference: scrollData.bodyScrollWidth - viewport.width
  };
}

function generateMobileTestReport(results) {
  const report = {
    overall: { score: 0, issues: [], recommendations: [] },
    touchTargets: { totalTests: 0, passed: 0, failed: 0, passRate: 0 },
    horizontalScroll: { totalTests: 0, passed: 0, failed: 0, passRate: 0 }
  };

  // Analyze touch targets
  let totalTouchTargets = 0;
  let passedTouchTargets = 0;

  Object.values(results.touchTargets).forEach(viewport => {
    totalTouchTargets += viewport.passed + viewport.failed;
    passedTouchTargets += viewport.passed;
    
    viewport.details.forEach(detail => {
      if (!detail.passes && !detail.error) {
        report.overall.issues.push(
          `Touch target "${detail.selector}" is ${detail.width}x${detail.height}px (needs 44x44px minimum)`
        );
      }
    });
  });

  report.touchTargets = {
    totalTests: totalTouchTargets,
    passed: passedTouchTargets,
    failed: totalTouchTargets - passedTouchTargets,
    passRate: totalTouchTargets > 0 ? Math.round((passedTouchTargets / totalTouchTargets) * 100) : 0
  };

  // Analyze horizontal scroll
  let totalScrollTests = 0;
  let passedScrollTests = 0;

  Object.entries(results.horizontalScroll).forEach(([viewport, data]) => {
    totalScrollTests++;
    if (data.passes) {
      passedScrollTests++;
    } else {
      report.overall.issues.push(
        `Horizontal scroll detected on ${viewport}: ${data.bodyScrollWidth}px > ${data.viewportWidth}px (${data.difference}px overflow)`
      );
    }
  });

  report.horizontalScroll = {
    totalTests: totalScrollTests,
    passed: passedScrollTests,
    failed: totalScrollTests - passedScrollTests,
    passRate: totalScrollTests > 0 ? Math.round((passedScrollTests / totalScrollTests) * 100) : 0
  };

  // Calculate overall score
  const touchScore = report.touchTargets.passRate * 0.6; // 60% weight
  const scrollScore = report.horizontalScroll.passRate * 0.4; // 40% weight
  report.overall.score = Math.round(touchScore + scrollScore);

  // Generate recommendations
  if (report.touchTargets.passRate < 100) {
    report.overall.recommendations.push(
      'Increase button sizes to meet 44px minimum touch target requirements'
    );
  }

  if (report.horizontalScroll.passRate < 100) {
    report.overall.recommendations.push(
      'Fix horizontal overflow by adjusting container widths and padding'
    );
  }

  return report;
}

function printReport(report, results) {
  console.log('\n📊 MOBILE TESTING RESULTS\n');
  console.log('=' .repeat(50));
  
  // Overall Score
  const scoreColor = report.overall.score >= 90 ? '🟢' : report.overall.score >= 70 ? '🟡' : '🔴';
  console.log(`${scoreColor} Overall Score: ${report.overall.score}/100\n`);
  
  // Touch Target Results
  console.log('🎯 TOUCH TARGET VALIDATION');
  console.log('-'.repeat(30));
  console.log(`Pass Rate: ${report.touchTargets.passRate}% (${report.touchTargets.passed}/${report.touchTargets.totalTests})`);
  
  Object.entries(results.touchTargets).forEach(([viewport, data]) => {
    console.log(`\n📱 ${viewport}:`);
    data.details.forEach(detail => {
      const status = detail.passes ? '✅' : '❌';
      if (detail.error) {
        console.log(`  ${status} ${detail.selector}: Error - ${detail.error}`);
      } else {
        console.log(`  ${status} ${detail.selector}: ${detail.width}x${detail.height}px`);
      }
    });
  });
  
  // Horizontal Scroll Results
  console.log(`\n📏 HORIZONTAL SCROLL VALIDATION`);
  console.log('-'.repeat(30));
  console.log(`Pass Rate: ${report.horizontalScroll.passRate}% (${report.horizontalScroll.passed}/${report.horizontalScroll.totalTests})`);
  
  Object.entries(results.horizontalScroll).forEach(([viewport, data]) => {
    const status = data.passes ? '✅' : '❌';
    console.log(`  ${status} ${viewport}: ${data.bodyScrollWidth}px ${data.passes ? '==' : '>'} ${data.viewportWidth}px`);
    if (!data.passes) {
      console.log(`      Overflow: +${data.difference}px`);
    }
  });
  
  // Issues
  if (report.overall.issues.length > 0) {
    console.log(`\n🐛 ISSUES FOUND (${report.overall.issues.length})`);
    console.log('-'.repeat(30));
    report.overall.issues.forEach((issue, index) => {
      console.log(`  ${index + 1}. ${issue}`);
    });
  }
  
  // Recommendations
  if (report.overall.recommendations.length > 0) {
    console.log(`\n💡 RECOMMENDATIONS`);
    console.log('-'.repeat(30));
    report.overall.recommendations.forEach((rec, index) => {
      console.log(`  ${index + 1}. ${rec}`);
    });
  }

  // Screenshots
  console.log(`\n📸 SCREENSHOTS CAPTURED`);
  console.log('-'.repeat(30));
  Object.entries(results.screenshots).forEach(([viewport, path]) => {
    console.log(`  📱 ${viewport}: ${path}`);
  });
  
  console.log(`\n📋 TESTING SUMMARY`);
  console.log('-'.repeat(30));
  console.log(`  🎯 Touch Targets: ${report.touchTargets.passRate}% pass rate`);
  console.log(`  📏 No H-Scroll: ${report.horizontalScroll.passRate}% pass rate`);
  console.log(`  📊 Overall Score: ${report.overall.score}/100`);
  console.log(`  📄 Results saved to: mobile-test-results.json`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  // Create screenshots directory
  await fs.promises.mkdir('screenshots', { recursive: true });
  
  runMobileTesting()
    .then(report => {
      process.exit(report.overall.score >= 90 ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Mobile testing failed:', error);
      process.exit(1);
    });
}

export { runMobileTesting };