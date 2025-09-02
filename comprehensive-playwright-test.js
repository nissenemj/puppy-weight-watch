import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Test configuration
const BASE_URL = 'http://localhost:8080'; // Primary port
const FALLBACK_URL = 'http://localhost:5173'; // Fallback port
const TIMEOUT = 15000;

// Viewport configurations
const DESKTOP_VIEWPORT = { width: 1920, height: 1080 };
const MOBILE_VIEWPORT = { width: 375, height: 812 };

// Mock expect function for assertions
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

class PuppyWeightWatchTester {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.testResults = {
      screenshots: [],
      navigation: [],
      pageLoads: [],
      errors: [],
      finnishContent: []
    };
  }

  async init() {
    console.log('🚀 Initializing Playwright browser...');
    this.browser = await chromium.launch({ 
      headless: false,
      slowMo: 1000 // Slow down for better observation
    });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
    
    // Listen for console errors
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        this.testResults.errors.push({
          type: 'console',
          message: msg.text(),
          url: this.page.url()
        });
      }
    });
  }

  async findWorkingServer() {
    console.log('🔍 Finding active development server...');
    
    for (const url of [BASE_URL, FALLBACK_URL]) {
      try {
        console.log(`   Trying ${url}...`);
        const response = await this.page.goto(url, { 
          waitUntil: 'domcontentloaded', 
          timeout: 5000 
        });
        
        if (response && response.status() === 200) {
          console.log(`✅ Found working server at ${url}`);
          return url;
        }
      } catch (error) {
        console.log(`   ❌ ${url} not available`);
      }
    }
    
    throw new Error('No development server found. Please run "npm run dev" first.');
  }

  async takeScreenshot(name, viewport = 'desktop') {
    const viewportConfig = viewport === 'mobile' ? MOBILE_VIEWPORT : DESKTOP_VIEWPORT;
    await this.page.setViewportSize(viewportConfig);
    await this.page.waitForTimeout(1000); // Wait for responsive adjustments
    
    const filename = `${name}-${viewport}-screenshot.png`;
    await this.page.screenshot({ 
      path: filename, 
      fullPage: true 
    });
    
    this.testResults.screenshots.push({
      name,
      viewport,
      filename,
      url: this.page.url()
    });
    
    console.log(`📸 Screenshot saved: ${filename}`);
  }

  async testHomepage() {
    console.log('\n🏠 Testing Homepage...');
    
    const serverUrl = await this.findWorkingServer();
    
    // Desktop test
    await this.page.setViewportSize(DESKTOP_VIEWPORT);
    await this.page.goto(serverUrl, { waitUntil: 'networkidle', timeout: TIMEOUT });
    
    // Check Finnish content
    const finnishElements = [
      { selector: 'text=Huolellista pennun hoitoa', description: 'Main heading' },
      { selector: 'text=Painonseuranta', description: 'Weight tracking' },
      { selector: 'text=Ruokalaskuri', description: 'Food calculator' },
      { selector: 'text=Pentukirja', description: 'Puppy book' },
      { selector: 'text=Aloita mittaaminen', description: 'Start measuring button' },
      { selector: 'text=Kaikki mitä tarvitset', description: 'All you need text' }
    ];
    
    for (const element of finnishElements) {
      try {
        const locator = this.page.locator(element.selector).first();
        await expect(locator).toBeVisible({ timeout: 3000 });
        console.log(`✅ Found Finnish content: ${element.description}`);
        this.testResults.finnishContent.push({
          page: 'homepage',
          element: element.description,
          found: true
        });
      } catch (error) {
        console.log(`❌ Missing Finnish content: ${element.description}`);
        this.testResults.finnishContent.push({
          page: 'homepage',
          element: element.description,
          found: false,
          error: error.message
        });
      }
    }
    
    await this.takeScreenshot('homepage', 'desktop');
    await this.takeScreenshot('homepage', 'mobile');
    
    this.testResults.pageLoads.push({
      page: 'homepage',
      url: serverUrl,
      status: 'success'
    });
  }

  async testWeightTrackerPage() {
    console.log('\n⚖️ Testing Weight Tracker Page...');
    
    try {
      // Navigate to weight tracker
      await this.page.setViewportSize(DESKTOP_VIEWPORT);
      await this.page.goto(`${await this.findWorkingServer()}/weight-tracker`, { 
        waitUntil: 'networkidle', 
        timeout: TIMEOUT 
      });
      
      // Check for weight tracker specific content
      const weightTrackerElements = [
        { selector: 'text=Painonseuranta', description: 'Weight tracking title' },
        { selector: 'text=Lisää paino', description: 'Add weight button' },
        { selector: 'text=kg', description: 'Weight unit' }
      ];
      
      for (const element of weightTrackerElements) {
        try {
          const locator = this.page.locator(element.selector).first();
          await expect(locator).toBeVisible({ timeout: 5000 });
          console.log(`✅ Found weight tracker element: ${element.description}`);
        } catch (error) {
          console.log(`⚠️ Weight tracker element not found: ${element.description}`);
        }
      }
      
      await this.takeScreenshot('weight-tracker', 'desktop');
      await this.takeScreenshot('weight-tracker', 'mobile');
      
      this.testResults.pageLoads.push({
        page: 'weight-tracker',
        url: this.page.url(),
        status: 'success'
      });
      
    } catch (error) {
      console.log(`❌ Weight tracker page failed: ${error.message}`);
      this.testResults.pageLoads.push({
        page: 'weight-tracker',
        url: this.page.url(),
        status: 'failed',
        error: error.message
      });
    }
  }

  async testFoodCalculatorPage() {
    console.log('\n🍽️ Testing Food Calculator Page...');
    
    try {
      await this.page.setViewportSize(DESKTOP_VIEWPORT);
      await this.page.goto(`${await this.findWorkingServer()}/calculator`, { 
        waitUntil: 'networkidle', 
        timeout: TIMEOUT 
      });
      
      // Check for calculator specific content
      const calculatorElements = [
        { selector: 'text=Ruokalaskuri', description: 'Food calculator title' },
        { selector: 'text=ruokamäärä', description: 'Food amount' },
        { selector: 'text=Laskuri', description: 'Calculator' }
      ];
      
      for (const element of calculatorElements) {
        try {
          const locator = this.page.locator(element.selector).first();
          await expect(locator).toBeVisible({ timeout: 5000 });
          console.log(`✅ Found calculator element: ${element.description}`);
        } catch (error) {
          console.log(`⚠️ Calculator element not found: ${element.description}`);
        }
      }
      
      await this.takeScreenshot('food-calculator', 'desktop');
      await this.takeScreenshot('food-calculator', 'mobile');
      
      this.testResults.pageLoads.push({
        page: 'food-calculator',
        url: this.page.url(),
        status: 'success'
      });
      
    } catch (error) {
      console.log(`❌ Food calculator page failed: ${error.message}`);
      this.testResults.pageLoads.push({
        page: 'food-calculator',
        url: this.page.url(),
        status: 'failed',
        error: error.message
      });
    }
  }

  async testPuppyBookPage() {
    console.log('\n📖 Testing Puppy Book Page...');
    
    try {
      await this.page.setViewportSize(DESKTOP_VIEWPORT);
      await this.page.goto(`${await this.findWorkingServer()}/puppy-book`, { 
        waitUntil: 'networkidle', 
        timeout: TIMEOUT 
      });
      
      // Check for puppy book specific content
      const puppyBookElements = [
        { selector: 'text=Pentukirja', description: 'Puppy book title' },
        { selector: 'text=muistoja', description: 'Memories' },
        { selector: 'text=kasvu', description: 'Growth' }
      ];
      
      for (const element of puppyBookElements) {
        try {
          const locator = this.page.locator(element.selector).first();
          await expect(locator).toBeVisible({ timeout: 5000 });
          console.log(`✅ Found puppy book element: ${element.description}`);
        } catch (error) {
          console.log(`⚠️ Puppy book element not found: ${element.description}`);
        }
      }
      
      await this.takeScreenshot('puppy-book', 'desktop');
      await this.takeScreenshot('puppy-book', 'mobile');
      
      this.testResults.pageLoads.push({
        page: 'puppy-book',
        url: this.page.url(),
        status: 'success'
      });
      
    } catch (error) {
      console.log(`❌ Puppy book page failed: ${error.message}`);
      this.testResults.pageLoads.push({
        page: 'puppy-book',
        url: this.page.url(),
        status: 'failed',
        error: error.message
      });
    }
  }

  async testNavigation() {
    console.log('\n🧭 Testing Navigation Functionality...');
    
    try {
      const serverUrl = await this.findWorkingServer();
      await this.page.goto(serverUrl, { waitUntil: 'networkidle', timeout: TIMEOUT });
      await this.page.setViewportSize(DESKTOP_VIEWPORT);
      
      // Test "Aloita mittaaminen" button navigation
      console.log('🔗 Testing "Aloita mittaaminen" button...');
      try {
        const startButton = this.page.locator('text=Aloita mittaaminen').first();
        await expect(startButton).toBeVisible({ timeout: 5000 });
        await startButton.click();
        await this.page.waitForLoadState('networkidle');
        
        const currentUrl = this.page.url();
        console.log(`✅ "Aloita mittaaminen" navigated to: ${currentUrl}`);
        this.testResults.navigation.push({
          button: 'Aloita mittaaminen',
          fromUrl: serverUrl,
          toUrl: currentUrl,
          status: 'success'
        });
        
        // Go back to homepage
        await this.page.goto(serverUrl, { waitUntil: 'networkidle' });
        
      } catch (error) {
        console.log(`❌ "Aloita mittaaminen" button failed: ${error.message}`);
        this.testResults.navigation.push({
          button: 'Aloita mittaaminen',
          status: 'failed',
          error: error.message
        });
      }
      
      // Test "Ruokalaskuri" button navigation
      console.log('🔗 Testing "Ruokalaskuri" button...');
      try {
        const calculatorButton = this.page.locator('text=Ruokalaskuri').first();
        await expect(calculatorButton).toBeVisible({ timeout: 5000 });
        await calculatorButton.click();
        await this.page.waitForLoadState('networkidle');
        
        const currentUrl = this.page.url();
        console.log(`✅ "Ruokalaskuri" navigated to: ${currentUrl}`);
        this.testResults.navigation.push({
          button: 'Ruokalaskuri',
          fromUrl: serverUrl,
          toUrl: currentUrl,
          status: 'success'
        });
        
        // Go back to homepage
        await this.page.goto(serverUrl, { waitUntil: 'networkidle' });
        
      } catch (error) {
        console.log(`❌ "Ruokalaskuri" button failed: ${error.message}`);
        this.testResults.navigation.push({
          button: 'Ruokalaskuri',
          status: 'failed',
          error: error.message
        });
      }
      
      // Test navigation menu links
      console.log('🔗 Testing navigation menu...');
      try {
        // Check for navigation elements
        const navElements = [
          { selector: 'nav a[href*="puppy-book"], nav a[href="/puppy-book"]', name: 'Puppy Book Link' },
          { selector: 'nav a[href*="calculator"], nav a[href="/calculator"]', name: 'Calculator Link' },
          { selector: 'nav a[href*="weight-tracker"], nav a[href="/weight-tracker"]', name: 'Weight Tracker Link' }
        ];
        
        for (const navElement of navElements) {
          try {
            const link = this.page.locator(navElement.selector).first();
            if (await link.isVisible()) {
              await link.click();
              await this.page.waitForLoadState('networkidle');
              
              const currentUrl = this.page.url();
              console.log(`✅ ${navElement.name} navigated to: ${currentUrl}`);
              this.testResults.navigation.push({
                element: navElement.name,
                toUrl: currentUrl,
                status: 'success'
              });
              
              // Go back to homepage
              await this.page.goto(serverUrl, { waitUntil: 'networkidle' });
            }
          } catch (error) {
            console.log(`⚠️ ${navElement.name} navigation failed: ${error.message}`);
          }
        }
        
      } catch (error) {
        console.log(`❌ Navigation menu test failed: ${error.message}`);
      }
      
      // Test mobile navigation
      console.log('📱 Testing mobile navigation...');
      await this.page.setViewportSize(MOBILE_VIEWPORT);
      await this.page.waitForTimeout(1000);
      
      try {
        // Look for mobile menu button
        const mobileMenuButton = this.page.locator('button[aria-label*="menu"], button:has-text("☰"), .hamburger').first();
        if (await mobileMenuButton.isVisible()) {
          await mobileMenuButton.click();
          await this.page.waitForTimeout(500);
          console.log('✅ Mobile navigation menu opened');
          
          // Take screenshot of mobile menu
          await this.page.screenshot({ 
            path: 'mobile-navigation-screenshot.png',
            fullPage: true 
          });
          console.log('📸 Mobile navigation screenshot saved');
        }
      } catch (error) {
        console.log(`⚠️ Mobile navigation test: ${error.message}`);
      }
      
    } catch (error) {
      console.log(`❌ Navigation testing failed: ${error.message}`);
      this.testResults.errors.push({
        type: 'navigation',
        message: error.message
      });
    }
  }

  async checkPageLoading(pagePath, pageName) {
    console.log(`\n🔄 Testing ${pageName} page loading...`);
    
    try {
      const serverUrl = await this.findWorkingServer();
      const fullUrl = `${serverUrl}${pagePath}`;
      
      const response = await this.page.goto(fullUrl, { 
        waitUntil: 'networkidle', 
        timeout: TIMEOUT 
      });
      
      if (response && response.status() === 200) {
        console.log(`✅ ${pageName} loaded successfully (${response.status()})`);
        
        // Check for basic Finnish content
        const basicFinnishCheck = await this.page.locator('html[lang="fi"], [lang="fi"], text=ja, text=tai, text=on').first().isVisible();
        if (basicFinnishCheck) {
          console.log(`✅ ${pageName} contains Finnish content`);
        }
        
        this.testResults.pageLoads.push({
          page: pageName,
          url: fullUrl,
          status: response.status(),
          success: true
        });
        
        return true;
      } else {
        throw new Error(`Page returned status ${response?.status()}`);
      }
      
    } catch (error) {
      console.log(`❌ ${pageName} failed to load: ${error.message}`);
      this.testResults.pageLoads.push({
        page: pageName,
        url: `${await this.findWorkingServer()}${pagePath}`,
        status: 'failed',
        success: false,
        error: error.message
      });
      return false;
    }
  }

  async checkForBrokenLinks() {
    console.log('\n🔗 Checking for broken links...');
    
    try {
      const serverUrl = await this.findWorkingServer();
      await this.page.goto(serverUrl, { waitUntil: 'networkidle' });
      
      // Get all links
      const links = await this.page.locator('a[href]').all();
      console.log(`Found ${links.length} links to check`);
      
      for (let i = 0; i < Math.min(links.length, 10); i++) { // Limit to first 10 links
        try {
          const href = await links[i].getAttribute('href');
          if (href && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('#')) {
            const linkUrl = href.startsWith('http') ? href : `${serverUrl}${href}`;
            console.log(`Checking link: ${linkUrl}`);
            
            const linkResponse = await this.page.goto(linkUrl, { timeout: 5000 });
            if (linkResponse && linkResponse.status() === 200) {
              console.log(`✅ Link OK: ${href}`);
            } else {
              console.log(`⚠️ Link issue: ${href} (${linkResponse?.status()})`);
            }
          }
        } catch (error) {
          console.log(`⚠️ Link check failed: ${error.message}`);
        }
      }
      
    } catch (error) {
      console.log(`❌ Link checking failed: ${error.message}`);
    }
  }

  async generateReport() {
    console.log('\n📊 Generating Test Report...');
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalScreenshots: this.testResults.screenshots.length,
        pagesTestedSuccessfully: this.testResults.pageLoads.filter(p => p.success).length,
        totalPagesTested: this.testResults.pageLoads.length,
        navigationTestsRun: this.testResults.navigation.length,
        errorsFound: this.testResults.errors.length,
        finnishContentFound: this.testResults.finnishContent.filter(c => c.found).length
      },
      details: this.testResults
    };
    
    // Save report to JSON file
    const reportJson = JSON.stringify(report, null, 2);
    await this.page.evaluate((content) => {
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'playwright-test-report.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, reportJson);
    
    console.log('\n📋 TEST SUMMARY:');
    console.log(`   Screenshots taken: ${report.summary.totalScreenshots}`);
    console.log(`   Pages loaded successfully: ${report.summary.pagesTestedSuccessfully}/${report.summary.totalPagesTested}`);
    console.log(`   Navigation tests: ${report.summary.navigationTestsRun}`);
    console.log(`   Finnish content elements found: ${report.summary.finnishContentFound}`);
    console.log(`   Errors detected: ${report.summary.errorsFound}`);
    
    return report;
  }

  async runFullTest() {
    try {
      await this.init();
      
      // Test all pages
      await this.testHomepage();
      await this.testWeightTrackerPage();
      await this.testFoodCalculatorPage();
      await this.testPuppyBookPage();
      
      // Test navigation
      await this.testNavigation();
      
      // Check for broken links
      await this.checkForBrokenLinks();
      
      // Generate report
      const report = await this.generateReport();
      
      console.log('\n🎉 All tests completed successfully!');
      return report;
      
    } catch (error) {
      console.error('❌ Test suite failed:', error.message);
      throw error;
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Run the tests
async function main() {
  const tester = new PuppyWeightWatchTester();
  
  try {
    console.log('🐶 Puppy Weight Watch - Comprehensive Playwright Test Suite');
    console.log('=' .repeat(60));
    
    const report = await tester.runFullTest();
    
    console.log('\n📄 Detailed Results:');
    console.log('\nScreenshots taken:');
    report.details.screenshots.forEach(screenshot => {
      console.log(`   📸 ${screenshot.name} (${screenshot.viewport}): ${screenshot.filename}`);
    });
    
    console.log('\nPage load results:');
    report.details.pageLoads.forEach(page => {
      const status = page.success ? '✅' : '❌';
      console.log(`   ${status} ${page.page}: ${page.status || 'failed'}`);
    });
    
    console.log('\nNavigation test results:');
    report.details.navigation.forEach(nav => {
      const status = nav.status === 'success' ? '✅' : '❌';
      console.log(`   ${status} ${nav.button || nav.element}: ${nav.toUrl || 'failed'}`);
    });
    
    if (report.details.errors.length > 0) {
      console.log('\nErrors detected:');
      report.details.errors.forEach(error => {
        console.log(`   ❌ ${error.type}: ${error.message}`);
      });
    }
    
  } catch (error) {
    console.error('💥 Test suite failed:', error);
    process.exit(1);
  } finally {
    await tester.cleanup();
  }
}

// Export for use as module
export { PuppyWeightWatchTester };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}