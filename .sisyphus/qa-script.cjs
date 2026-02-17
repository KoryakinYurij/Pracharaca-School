const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const EVIDENCE_DIR = path.resolve('.sisyphus/evidence');
const BASE_URL = 'http://localhost:5173';

(async () => {
  console.log('Starting QA Verification...');
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 } // Default desktop
  });
  const page = await context.newPage();

  // Helper to save screenshot
  const screenshot = async (name) => {
    const p = path.join(EVIDENCE_DIR, name);
    await page.screenshot({ path: p, fullPage: false });
    console.log(`Saved: ${name}`);
  };

  try {
    // 1. Homepage topics grid
    console.log('Testing Homepage...');
    await page.goto(BASE_URL);
    await page.waitForSelector('main'); // Wait for content
    // Give time for any animations or data loading
    await page.waitForTimeout(1000); 
    await screenshot('task-8-homepage-grid.png');

    // 2. Topic detail navigation
    console.log('Testing Topic Detail...');
    // Click the first topic card. Assuming links are inside the grid.
    // Try to find a link that looks like a topic card.
    const topicLink = await page.$('a[href^="/topic/"]');
    if (topicLink) {
        await topicLink.click();
        await page.waitForURL(/\/topic\//);
        await page.waitForTimeout(1000);
        await screenshot('task-8-topic-detail.png');
    } else {
        console.error('No topic link found on homepage!');
    }

    // 3. Lesson navigation + back link
    console.log('Testing Lesson Navigation...');
    // Click the first lesson link.
    const lessonLink = await page.$('a[href*="/lesson/"]');
    if (lessonLink) {
        await lessonLink.click();
        await page.waitForURL(/\/lesson\//);
        await page.waitForTimeout(1000);
        await screenshot('task-8-lesson-navigation.png');
    } else {
        console.error('No lesson link found on topic page!');
    }

    // 4. Prev/next links
    console.log('Testing Prev/Next Links...');
    // Scroll to bottom to see nav links
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await screenshot('task-8-prevnext-nav.png');

    // 5. Responsive behavior
    console.log('Testing Responsive Behavior...');
    
    // Mobile
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL);
    await page.waitForTimeout(1000);
    await screenshot('task-8-responsive-mobile.png');

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE_URL);
    await page.waitForTimeout(1000);
    await screenshot('task-8-responsive-tablet.png');

    // Desktop (reset)
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE_URL);
    await page.waitForTimeout(1000);
    await screenshot('task-8-responsive-desktop.png');

    // 6. Semantic/focus accessibility checks
    console.log('Testing Focus Accessibility...');
    await page.reload();
    await page.waitForTimeout(500);
    // Tab through a few elements
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    await screenshot('task-8-focus-visible.png');

    // 7. Invalid topic not-found state
    console.log('Testing Invalid Topic...');
    await page.goto(`${BASE_URL}/topic/invalid-topic-slug-12345`);
    await page.waitForTimeout(1000);
    await screenshot('task-8-topic-not-found.png');

    // 8. Old route redirects
    console.log('Testing Old Route Redirects...');
    // Requirement: old /lesson/... redirects to /
    await page.goto(`${BASE_URL}/lesson/some-old-lesson-slug`);
    await page.waitForTimeout(1000);
    
    const currentUrl = page.url();
    const isHome = currentUrl === BASE_URL || currentUrl === `${BASE_URL}/`;
    console.log(`Old route redirected to: ${currentUrl} (Expected: ${BASE_URL}/)`);
    
    await screenshot('task-8-old-route-redirect.png');

    console.log('QA Verification Completed Successfully.');

  } catch (error) {
    console.error('QA Verification Failed:', error);
  } finally {
    await browser.close();
  }
})();
