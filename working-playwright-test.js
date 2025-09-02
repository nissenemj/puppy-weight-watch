import { chromium } from 'playwright';

// Allow overriding via env to support Vite base in production preview
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:4000/puppy-weight-watch';
const TIMEOUT = 30000;

const DESKTOP_VIEWPORT = { width: 1920, height: 1080 };
const MOBILE_VIEWPORT = { width: 375, height: 812 };

async function waitForReactApp(page) {
  // Wait for React to mount and render
  await page.waitForFunction(() => {
    return document.querySelector('#root') && 
           document.querySelector('#root').children.length > 0;
  }, { timeout: 20000 });
  
  // Additional wait for content to render
  await page.waitForTimeout(2000);
}

async function takeScreenshot(page, name, viewport) {
  const viewportConfig = viewport === 'mobile' ? MOBILE_VIEWPORT : DESKTOP_VIEWPORT;
  await page.setViewportSize(viewportConfig);
  await page.waitForTimeout(1500); // Wait for responsive layout
  
  const filename = `${name}-${viewport}-final.png`;
  await page.screenshot({ 
    path: filename, 
    fullPage: true 
  });
  
  console.log(`📸 Screenshot saved: ${filename}`);
  return filename;
}

async function testPage(page, path, pageName) {
  console.log(`\n🔍 Testing ${pageName} (${path})...`);
  
  try {
    const fullUrl = `${SERVER_URL}${path}`;
    console.log(`   Navigating to: ${fullUrl}`);
    
    const response = await page.goto(fullUrl, { 
      waitUntil: 'networkidle', 
      timeout: TIMEOUT 
    });
    
    console.log(`   HTTP Status: ${response.status()}`);
    
    // Wait for React app to load
    await waitForReactApp(page);
    
    // Take screenshots
    const desktopFile = await takeScreenshot(page, pageName, 'desktop');
    const mobileFile = await takeScreenshot(page, pageName, 'mobile');
    
    // Check for any content
    const hasContent = await page.evaluate(() => {
      const content = document.body.innerText.trim();
      return content.length > 100; // Basic content check
    });
    
    console.log(`   Content loaded: ${hasContent ? 'Yes' : 'No'}`);
    
    // Check for Finnish content
    const finnishTexts = ['painon', 'ruoka', 'pentu', 'kasvu', 'mittaami', 'laskuri', 'kirja'];
    let finnishContentFound = false;
    
    for (const text of finnishTexts) {
      try {
        const found = await page.locator(`text*=${text}`).first().isVisible({ timeout: 2000 });
        if (found) {
          finnishContentFound = true;
          console.log(`   ✅ Found Finnish content: ${text}`);
          break;
        }
      } catch (e) {
        // Continue checking
      }
    }
    
    if (!finnishContentFound) {
      console.log(`   ⚠️ No Finnish content detected`);
    }
    
    return {
      success: true,
      url: fullUrl,
      status: response.status(),
      hasContent,
      finnishContentFound,
      screenshots: { desktop: desktopFile, mobile: mobileFile }
    };
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return {
      success: false,
      error: error.message,
      screenshots: null
    };
  }
}

async function testNavigation(page) {
  console.log('\n🧭 Testing Navigation...');
  
  try {
    await page.goto(SERVER_URL, { waitUntil: 'networkidle', timeout: TIMEOUT });
    await waitForReactApp(page);
    await page.setViewportSize(DESKTOP_VIEWPORT);
    
    const navigationResults = [];
    
    // Test common navigation patterns
    const navTests = [
      { 
        name: 'Homepage to Weight Tracker',
        selectors: ['[href*="weight-tracker"]', 'text*=Aloita', 'text*=mittaami', 'text*=Painon']
      },
      { 
        name: 'Homepage to Calculator',
        selectors: ['[href*="calculator"]', 'text*=Ruoka', 'text*=laskuri', 'text*=Calculator']
      },
      { 
        name: 'Homepage to Puppy Book',
        selectors: ['[href*="puppy-book"]', 'text*=Pentu', 'text*=kirja', 'text*=Book']
      }
    ];
    
    for (const test of navTests) {
      console.log(`   Testing: ${test.name}`);
      
      // Go back to homepage
      await page.goto(SERVER_URL, { waitUntil: 'networkidle' });
      await waitForReactApp(page);
      
      let clicked = false;
      let clickedElement = null;
      
      for (const selector of test.selectors) {
        try {
          const element = page.locator(selector).first();
          if (await element.isVisible({ timeout: 2000 })) {
            console.log(`     Found clickable element: ${selector}`);
            clickedElement = selector;
            await element.click();
            await page.waitForLoadState('networkidle', { timeout: 10000 });
            clicked = true;
            break;
          }
        } catch (e) {
          // Try next selector
        }
      }
      
      if (clicked) {
        const newUrl = page.url();
        console.log(`     ✅ Navigated to: ${newUrl}`);
        navigationResults.push({
          test: test.name,
          success: true,
          element: clickedElement,
          resultUrl: newUrl
        });
      } else {
        console.log(`     ❌ No clickable element found`);
        navigationResults.push({
          test: test.name,
          success: false,
          reason: 'No clickable element found'
        });
      }
    }
    
    return navigationResults;
    
  } catch (error) {
    console.log(`   ❌ Navigation test failed: ${error.message}`);
    return [{ error: error.message }];
  }
}

async function runCompleteTest() {
  let browser = null;
  
  try {
    console.log('🐶 Puppy Weight Watch - Comprehensive Test Suite');
    console.log('=' .repeat(60));
    
    browser = await chromium.launch({ 
      headless: false,
      slowMo: 1000 
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    console.log(`🌐 Testing application at: ${SERVER_URL}`);
    
    // Test all pages
    const pages = [
      { path: '', name: 'homepage' },
      { path: '/weight-tracker', name: 'weight-tracker' },
      { path: '/calculator', name: 'food-calculator' },
      { path: '/puppy-book', name: 'puppy-book' }
    ];
    
    const pageResults = [];
    for (const pageConfig of pages) {
      const result = await testPage(page, pageConfig.path, pageConfig.name);
      pageResults.push({ ...result, name: pageConfig.name });
    }
    
    // Test navigation
    const navigationResults = await testNavigation(page);
    
    // Generate summary report
    console.log('\n📊 COMPREHENSIVE TEST RESULTS');
    console.log('=' .repeat(60));
    
    console.log('\n📄 Page Loading Results:');
    pageResults.forEach(result => {
      const status = result.success ? '✅' : '❌';
      console.log(`   ${status} ${result.name}: HTTP ${result.status || 'failed'}`);
      if (result.screenshots) {
        console.log(`      📸 Desktop: ${result.screenshots.desktop}`);
        console.log(`      📸 Mobile: ${result.screenshots.mobile}`);
      }
      if (result.hasContent !== undefined) {
        console.log(`      📝 Content: ${result.hasContent ? 'Loaded' : 'Empty'}`);
      }
      if (result.finnishContentFound !== undefined) {
        console.log(`      🇫🇮 Finnish: ${result.finnishContentFound ? 'Found' : 'Not found'}`);
      }
    });
    
    console.log('\n🧭 Navigation Test Results:');
    navigationResults.forEach(result => {
      if (result.error) {
        console.log(`   ❌ Navigation failed: ${result.error}`);
      } else {
        const status = result.success ? '✅' : '❌';
        console.log(`   ${status} ${result.test}: ${result.success ? result.resultUrl : result.reason}`);
        if (result.element) {
          console.log(`      🎯 Clicked: ${result.element}`);
        }
      }
    });
    
    console.log('\n📊 Summary:');
    const successfulPages = pageResults.filter(r => r.success).length;
    const successfulNav = navigationResults.filter(r => r.success).length;
    const totalScreenshots = pageResults.filter(r => r.screenshots).length * 2;
    
    console.log(`   Pages tested successfully: ${successfulPages}/${pageResults.length}`);
    console.log(`   Navigation tests passed: ${successfulNav}/${navigationResults.length}`);
    console.log(`   Screenshots taken: ${totalScreenshots}`);
    
    console.log('\n🎉 Test suite completed!');
    console.log(`📁 Screenshots saved in: C:\\Users\\nisse\\puppy-weight-watch\\`);
    
  } catch (error) {
    console.error('💥 Test suite failed:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

runCompleteTest().catch(console.error);
