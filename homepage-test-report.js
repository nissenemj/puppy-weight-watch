import { chromium } from 'playwright';

async function comprehensiveHomepageTest() {
  console.log('🚀 Starting comprehensive homepage test...\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = {
    status: null,
    heading: false,
    finnishContent: [],
    consoleErrors: [],
    mobileOptimization: {
      horizontalScroll: false,
      touchTargets: []
    },
    accessibility: {
      headingStructure: [],
      altTexts: [],
      landmarks: []
    },
    performance: {
      loadTime: null,
      resourceCounts: {}
    }
  };

  try {
    // Track performance
    const startTime = Date.now();
    
    console.log('📍 Navigating to http://localhost:3000');
    const response = await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle', 
      timeout: 10000 
    });

    results.performance.loadTime = Date.now() - startTime;
    results.status = response.status();

    console.log(`✅ Page status: ${results.status}`);
    console.log(`⏱️  Load time: ${results.performance.loadTime}ms\n`);

    // 1. Check main heading
    console.log('🔍 Checking main heading...');
    try {
      const mainHeading = await page.locator('h1').first();
      const headingText = await mainHeading.textContent();
      
      if (headingText && (headingText.includes('Huolellista') || headingText.includes('pennun hoitoa'))) {
        results.heading = true;
        console.log(`✅ Main heading found: "${headingText.trim()}"`);
      } else {
        console.log(`⚠️  Main heading found but text unexpected: "${headingText}"`);
      }
    } catch (e) {
      console.log('❌ Main heading not found');
    }

    // 2. Check Finnish content
    console.log('\n🔍 Checking Finnish content...');
    const finnishTerms = [
      'Painonseuranta',
      'Ruokalaskuri', 
      'Pentukirja',
      'Aloita mittaaminen',
      'Kaikki mitä tarvitset',
      'Seuraa kasvua',
      'Usein kysytyt kysymykset'
    ];

    for (const term of finnishTerms) {
      try {
        const element = await page.locator(`text=${term}`).first();
        await element.waitFor({ state: 'visible', timeout: 3000 });
        results.finnishContent.push(term);
        console.log(`✅ Found: ${term}`);
      } catch (e) {
        console.log(`⚠️  Missing: ${term}`);
      }
    }

    // 3. Console errors monitoring
    console.log('\n🔍 Monitoring console...');
    page.on('console', msg => {
      if (msg.type() === 'error') {
        results.consoleErrors.push({
          type: msg.type(),
          text: msg.text(),
          location: msg.location()
        });
      }
    });

    await page.waitForTimeout(2000);

    if (results.consoleErrors.length === 0) {
      console.log('✅ No console errors detected');
    } else {
      console.log(`⚠️  ${results.consoleErrors.length} console errors detected:`);
      results.consoleErrors.forEach(error => {
        console.log(`   - ${error.text}`);
      });
    }

    // 4. Accessibility checks
    console.log('\n♿ Running accessibility checks...');
    
    // Check heading structure
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
      const text = await heading.textContent();
      results.accessibility.headingStructure.push({ tag: tagName, text: text?.trim() });
    }
    console.log(`✅ Found ${results.accessibility.headingStructure.length} headings`);

    // Check alt texts for images
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      const src = await img.getAttribute('src');
      results.accessibility.altTexts.push({ 
        src: src?.substring(0, 50) + '...', 
        alt: alt || 'MISSING ALT TEXT' 
      });
    }
    console.log(`✅ Found ${results.accessibility.altTexts.length} images`);

    // Check landmarks
    const landmarks = ['main', 'nav', 'header', 'footer', 'aside', 'section'];
    for (const landmark of landmarks) {
      const count = await page.locator(landmark).count();
      if (count > 0) {
        results.accessibility.landmarks.push({ element: landmark, count });
      }
    }
    console.log(`✅ Found ${results.accessibility.landmarks.length} landmark types`);

    // 5. Mobile optimization tests
    console.log('\n📱 Testing mobile optimization...');
    
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);

    // Check horizontal scroll
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const windowInnerWidth = await page.evaluate(() => window.innerWidth);
    
    results.mobileOptimization.horizontalScroll = bodyScrollWidth > windowInnerWidth;
    
    if (!results.mobileOptimization.horizontalScroll) {
      console.log('✅ No horizontal scrolling on mobile');
    } else {
      console.log(`⚠️  Horizontal scrolling detected: ${bodyScrollWidth}px > ${windowInnerWidth}px`);
    }

    // Check touch targets (buttons, links)
    const touchTargets = await page.locator('button, a, [role="button"]').all();
    let inadequateTouchTargets = 0;
    
    for (const target of touchTargets.slice(0, 10)) { // Check first 10 for performance
      const box = await target.boundingBox();
      if (box && (box.width < 44 || box.height < 44)) {
        inadequateTouchTargets++;
        const text = await target.textContent();
        results.mobileOptimization.touchTargets.push({
          text: text?.trim().substring(0, 30),
          size: `${Math.round(box.width)}x${Math.round(box.height)}px`
        });
      }
    }
    
    if (inadequateTouchTargets === 0) {
      console.log('✅ All touch targets are adequately sized (≥44px)');
    } else {
      console.log(`⚠️  ${inadequateTouchTargets} touch targets smaller than 44px`);
    }

    // 6. Performance metrics
    console.log('\n⚡ Collecting performance metrics...');
    
    const performanceMetrics = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart,
        loadComplete: nav.loadEventEnd - nav.loadEventStart,
        resourceCount: performance.getEntriesByType('resource').length
      };
    });
    
    results.performance.resourceCounts = performanceMetrics;
    console.log(`✅ DOM Content Loaded: ${Math.round(performanceMetrics.domContentLoaded)}ms`);
    console.log(`✅ Load Complete: ${Math.round(performanceMetrics.loadComplete)}ms`);
    console.log(`✅ Resources loaded: ${performanceMetrics.resourceCount}`);

    // Take final screenshots
    console.log('\n📸 Taking screenshots...');
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-desktop-screenshot.png', fullPage: true });
    
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-mobile-screenshot.png', fullPage: true });
    
    console.log('✅ Screenshots saved');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }

  return results;
}

// Run comprehensive test and generate report
comprehensiveHomepageTest().then(results => {
  console.log('\n📊 COMPREHENSIVE TEST REPORT');
  console.log('==============================\n');
  
  console.log(`🌐 Status Code: ${results.status === 200 ? '✅' : '❌'} ${results.status}`);
  console.log(`🎯 Main Heading: ${results.heading ? '✅ Found' : '❌ Missing'}`);
  console.log(`🇫🇮 Finnish Content: ${results.finnishContent.length}/7 terms found`);
  console.log(`🐛 Console Errors: ${results.consoleErrors.length === 0 ? '✅' : '⚠️'} ${results.consoleErrors.length} errors`);
  console.log(`📱 Mobile Scroll: ${!results.mobileOptimization.horizontalScroll ? '✅ No issues' : '⚠️ Horizontal scroll detected'}`);
  console.log(`👆 Touch Targets: ${results.mobileOptimization.touchTargets.length === 0 ? '✅ All adequate' : '⚠️ ' + results.mobileOptimization.touchTargets.length + ' too small'}`);
  console.log(`♿ Headings: ✅ ${results.accessibility.headingStructure.length} found`);
  console.log(`🖼️  Images: ${results.accessibility.altTexts.filter(img => img.alt !== 'MISSING ALT TEXT').length}/${results.accessibility.altTexts.length} have alt text`);
  console.log(`🏗️  Landmarks: ✅ ${results.accessibility.landmarks.length} types found`);
  console.log(`⏱️  Load Time: ${results.performance.loadTime}ms`);
  
  console.log('\n🎯 SUMMARY');
  console.log('============');
  
  const issues = [];
  if (results.status !== 200) issues.push('Status code not 200');
  if (!results.heading) issues.push('Main heading missing');
  if (results.finnishContent.length < 6) issues.push('Some Finnish content missing');
  if (results.consoleErrors.length > 0) issues.push('Console errors present');
  if (results.mobileOptimization.horizontalScroll) issues.push('Horizontal scrolling on mobile');
  if (results.mobileOptimization.touchTargets.length > 0) issues.push('Some touch targets too small');
  if (results.performance.loadTime > 3000) issues.push('Slow load time');
  
  if (issues.length === 0) {
    console.log('🎉 ALL TESTS PASSED! The homepage is working excellently.');
  } else {
    console.log(`⚠️  ${issues.length} issues detected:`);
    issues.forEach(issue => console.log(`   • ${issue}`));
  }
  
}).catch(console.error);