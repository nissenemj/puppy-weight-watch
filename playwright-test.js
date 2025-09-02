import { chromium } from 'playwright';

async function testHomepage() {
  console.log('🚀 Starting homepage test...');
  
  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to homepage
    console.log('📍 Navigating to http://localhost:3000');
    const response = await page.goto('http://localhost:3000', { 
      waitUntil: 'networkidle', 
      timeout: 10000 
    });

    // 1. Check page loads successfully (status 200)
    console.log(`✅ Page status: ${response.status()}`);
    
    if (response.status() !== 200) {
      throw new Error(`Page failed to load. Status: ${response.status()}`);
    }

    // 2. Check the main heading "Huolellista pennun hoitoa" is visible
    console.log('🔍 Checking for main heading...');
    const mainHeading = await page.locator('h1:has-text("Huolellista"), h1:has-text("pennun hoitoa")').first();
    
    await expect(mainHeading).toBeVisible({ timeout: 5000 });
    console.log('✅ Main heading "Huolellista pennun hoitoa" is visible');

    // 3. Check for expected Finnish content
    console.log('🔍 Checking for Finnish content...');
    
    const finnishElements = [
      'text=Painonseuranta',
      'text=Ruokalaskuri', 
      'text=Pentukirja',
      'text=Aloita mittaaminen',
      'text=Kaikki mitä tarvitset'
    ];

    for (const selector of finnishElements) {
      const element = await page.locator(selector).first();
      await expect(element).toBeVisible({ timeout: 3000 });
      console.log(`✅ Found Finnish content: ${selector.replace('text=', '')}`);
    }

    // 4. Check for console errors
    console.log('🔍 Checking for console errors...');
    
    let consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Wait a bit more for any async errors
    await page.waitForTimeout(2000);

    if (consoleErrors.length > 0) {
      console.log('⚠️  Console errors detected:');
      consoleErrors.forEach(error => console.log(`   - ${error}`));
    } else {
      console.log('✅ No console errors detected');
    }

    // 5. Take a screenshot
    console.log('📸 Taking screenshot...');
    await page.screenshot({ 
      path: 'homepage-screenshot.png', 
      fullPage: true 
    });
    console.log('✅ Screenshot saved as homepage-screenshot.png');

    // Additional checks for mobile optimization
    console.log('📱 Checking mobile optimization...');
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);

    // Check for horizontal scroll
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const windowInnerWidth = await page.evaluate(() => window.innerWidth);
    
    if (bodyScrollWidth <= windowInnerWidth) {
      console.log('✅ No horizontal scrolling detected on mobile');
    } else {
      console.log('⚠️  Horizontal scrolling detected on mobile');
    }

    // Take mobile screenshot
    await page.screenshot({ 
      path: 'homepage-mobile-screenshot.png', 
      fullPage: true 
    });
    console.log('✅ Mobile screenshot saved as homepage-mobile-screenshot.png');

    console.log('🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    // Take error screenshot
    await page.screenshot({ path: 'error-screenshot.png' });
    console.log('📸 Error screenshot saved');
  } finally {
    await browser.close();
  }
}

// Mock expect function for basic assertions
global.expect = (actual) => ({
  toBeVisible: async (options = {}) => {
    try {
      await actual.waitFor({ 
        state: 'visible', 
        timeout: options.timeout || 5000 
      });
      return true;
    } catch (error) {
      throw new Error(`Element not visible: ${error.message}`);
    }
  }
});

// Run the test
testHomepage().catch(console.error);

export { testHomepage };