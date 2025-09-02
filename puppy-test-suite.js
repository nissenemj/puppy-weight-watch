import { chromium } from 'playwright';

// Test configuration
const BASE_URL = 'http://localhost:8080';
const FALLBACK_URL = 'http://localhost:5173';
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

class PuppyTestSuite {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.serverUrl = null;
    this.results = {
      screenshots: [],
      pageTests: [],
      navigationTests: [],
      errors: []
    };
  }

  async init() {
    console.log('🚀 Initializing browser...');
    this.browser = await chromium.launch({ 
      headless: false,
      slowMo: 500
    });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
    
    // Listen for errors
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        this.results.errors.push({
          type: 'console',
          message: msg.text(),
          url: this.page.url()
        });
      }
    });
    
    this.page.on('pageerror', error => {
      this.results.errors.push({
        type: 'page',
        message: error.message,
        url: this.page.url()
      });
    });
  }

  async findServer() {
    console.log('🔍 Finding development server...');
    
    for (const url of [BASE_URL, FALLBACK_URL]) {
      try {
        console.log(`   Testing ${url}...`);
        const response = await this.page.goto(url, { 
          waitUntil: 'domcontentloaded', 
          timeout: 5000 
        });
        
        if (response && response.status() === 200) {
          console.log(`✅ Server found at ${url}`);
          this.serverUrl = url;
          return url;
        }
      } catch (error) {
        console.log(`   ❌ ${url} not available`);
      }
    }
    
    throw new Error('❌ No development server found. Please start the server with "npm run dev"');
  }

  async takePageScreenshots(pagePath, pageName) {
    console.log(`\n📸 Taking screenshots for ${pageName}...`);
    
    const fullUrl = `${this.serverUrl}${pagePath}`;
    
    try {
      await this.page.goto(fullUrl, { waitUntil: 'networkidle', timeout: TIMEOUT });
      
      // Desktop screenshot
      await this.page.setViewportSize(DESKTOP_VIEWPORT);
      await this.page.waitForTimeout(1000);
      const desktopFile = `${pageName}-desktop-screenshot.png`;
      await this.page.screenshot({ path: desktopFile, fullPage: true });
      console.log(`✅ Desktop screenshot: ${desktopFile}`);
      
      // Mobile screenshot
      await this.page.setViewportSize(MOBILE_VIEWPORT);
      await this.page.waitForTimeout(1000);
      const mobileFile = `${pageName}-mobile-screenshot.png`;
      await this.page.screenshot({ path: mobileFile, fullPage: true });
      console.log(`✅ Mobile screenshot: ${mobileFile}`);
      
      this.results.screenshots.push({
        page: pageName,
        url: fullUrl,
        desktop: desktopFile,
        mobile: mobileFile
      });
      
      return true;
      
    } catch (error) {
      console.log(`❌ Screenshot failed for ${pageName}: ${error.message}`);
      this.results.errors.push({
        type: 'screenshot',
        page: pageName,
        message: error.message
      });
      return false;
    }
  }

  async testPageContent(pagePath, pageName, expectedTexts = []) {
    console.log(`\n🔍 Testing ${pageName} content...`);
    
    try {
      const fullUrl = `${this.serverUrl}${pagePath}`;
      await this.page.goto(fullUrl, { waitUntil: 'networkidle', timeout: TIMEOUT });
      
      // Check page loads
      console.log(`✅ ${pageName} loaded successfully`);
      
      // Check for expected Finnish texts
      for (const text of expectedTexts) {
        try {
          const element = this.page.locator(`text=${text}`).first();
          await expect(element).toBeVisible({ timeout: 3000 });
          console.log(`✅ Found: "${text}"`);
        } catch (error) {
          console.log(`⚠️ Not found: "${text}"`);
        }
      }
      
      this.results.pageTests.push({
        page: pageName,
        url: fullUrl,
        status: 'success',
        expectedTexts,
        timestamp: new Date().toISOString()
      });
      
      return true;
      
    } catch (error) {
      console.log(`❌ ${pageName} content test failed: ${error.message}`);
      this.results.pageTests.push({
        page: pageName,
        url: `${this.serverUrl}${pagePath}`,
        status: 'failed',
        error: error.message
      });
      return false;
    }
  }

  async testNavigation() {
    console.log('\n🧭 Testing navigation functionality...');
    
    try {
      await this.page.goto(this.serverUrl, { waitUntil: 'networkidle' });
      await this.page.setViewportSize(DESKTOP_VIEWPORT);
      
      const navigationTests = [
        {
          name: 'Aloita mittaaminen button',
          selector: 'text=Aloita mittaaminen',
          expectedUrl: 'weight-tracker'
        },
        {
          name: 'Ruokalaskuri button',
          selector: 'text=Ruokalaskuri',
          expectedUrl: 'calculator'
        }
      ];
      
      for (const test of navigationTests) {
        try {
          console.log(`🔗 Testing ${test.name}...`);
          
          // Go back to homepage first
          await this.page.goto(this.serverUrl, { waitUntil: 'networkidle' });
          
          const button = this.page.locator(test.selector).first();
          await expect(button).toBeVisible({ timeout: 5000 });
          
          await button.click();
          await this.page.waitForLoadState('networkidle', { timeout: 10000 });
          
          const currentUrl = this.page.url();
          const navigatedCorrectly = currentUrl.includes(test.expectedUrl);
          
          if (navigatedCorrectly) {
            console.log(`✅ ${test.name} navigated correctly to: ${currentUrl}`);
            this.results.navigationTests.push({
              name: test.name,
              status: 'success',
              fromUrl: this.serverUrl,
              toUrl: currentUrl
            });
          } else {
            console.log(`⚠️ ${test.name} unexpected navigation: ${currentUrl}`);
            this.results.navigationTests.push({
              name: test.name,
              status: 'unexpected',
              fromUrl: this.serverUrl,
              toUrl: currentUrl,
              expected: test.expectedUrl
            });
          }
          
        } catch (error) {
          console.log(`❌ ${test.name} failed: ${error.message}`);
          this.results.navigationTests.push({
            name: test.name,
            status: 'failed',
            error: error.message
          });
        }
      }
      
    } catch (error) {
      console.log(`❌ Navigation testing failed: ${error.message}`);
      this.results.errors.push({
        type: 'navigation',
        message: error.message
      });
    }
  }

  async runComplete() {
    try {
      await this.init();
      await this.findServer();
      
      console.log('\n🎬 Starting comprehensive test suite...');
      
      // Test and screenshot all pages
      const pages = [
        { path: '', name: 'homepage', texts: ['Huolellista pennun hoitoa', 'Painonseuranta', 'Ruokalaskuri', 'Pentukirja'] },
        { path: '/weight-tracker', name: 'weight-tracker', texts: ['Painonseuranta', 'paino'] },
        { path: '/calculator', name: 'food-calculator', texts: ['Ruokalaskuri', 'ruoka'] },
        { path: '/puppy-book', name: 'puppy-book', texts: ['Pentukirja', 'muisto'] }
      ];
      
      for (const pageConfig of pages) {
        await this.testPageContent(pageConfig.path, pageConfig.name, pageConfig.texts);
        await this.takePageScreenshots(pageConfig.path, pageConfig.name);
      }
      
      // Test navigation
      await this.testNavigation();
      
      // Generate final report
      console.log('\n📊 FINAL TEST REPORT');
      console.log('=' .repeat(50));
      console.log(`Screenshots taken: ${this.results.screenshots.length * 2} (desktop + mobile)`);
      console.log(`Pages tested: ${this.results.pageTests.length}`);
      console.log(`Navigation tests: ${this.results.navigationTests.length}`);
      console.log(`Errors found: ${this.results.errors.length}`);
      
      console.log('\n📸 Screenshots generated:');
      this.results.screenshots.forEach(screenshot => {
        console.log(`   - ${screenshot.page}: ${screenshot.desktop} & ${screenshot.mobile}`);
      });
      
      console.log('\n📄 Page test results:');
      this.results.pageTests.forEach(test => {
        const status = test.status === 'success' ? '✅' : '❌';
        console.log(`   ${status} ${test.page}: ${test.url}`);
      });
      
      console.log('\n🧭 Navigation test results:');
      this.results.navigationTests.forEach(nav => {
        const status = nav.status === 'success' ? '✅' : nav.status === 'unexpected' ? '⚠️' : '❌';
        console.log(`   ${status} ${nav.name}: ${nav.status}`);
      });
      
      if (this.results.errors.length > 0) {
        console.log('\n❌ Errors detected:');
        this.results.errors.forEach(error => {
          console.log(`   - ${error.type}: ${error.message}`);
        });
      }
      
      console.log('\n🎉 Test suite completed!');
      
    } catch (error) {
      console.error('💥 Test suite failed:', error.message);
      throw error;
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// Run the complete test suite
async function main() {
  const tester = new PuppyTestSuite();
  await tester.runComplete();
}

main().catch(console.error);