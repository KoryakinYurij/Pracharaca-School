// NOTE: Playwright is installed globally. Run this script with:
// NODE_PATH=~/.nvm/versions/node/v24.13.0/lib/node_modules node capture.js
// Or: npx playwright screenshot ... (uses global playwright)

const { chromium } = require('playwright');
const path = require('path');

(async () => {
  try {
    console.log('Launching browser...');
    const browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    console.log('Navigating to Home Page...');
    await page.goto('http://localhost:5174');
    await page.waitForLoadState('networkidle');
    console.log('Taking Home Desktop Screenshot...');
    await page.screenshot({ path: path.join(__dirname, '../evidence/homepage-desktop.png'), fullPage: true });

    console.log('Taking Home Mobile Screenshot...');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(__dirname, '../evidence/homepage-mobile.png'), fullPage: true });

    console.log('Navigating to Lesson Page...');
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:5174/lesson/noble-basics');
    await page.waitForLoadState('networkidle');
    console.log('Taking Lesson Desktop Screenshot...');
    await page.screenshot({ path: path.join(__dirname, '../evidence/lesson-desktop.png'), fullPage: true });

    console.log('Expanding cards...');
    // Try to find buttons that look like accordion toggles. usually checking aria-expanded attribute.
    const buttons = await page.locator('button[aria-expanded]').all();
    console.log(`Found ${buttons.length} expandable buttons.`);
    
    if (buttons.length > 0) {
      await buttons[0].click();
      if (buttons.length > 1) await buttons[1].click();
      if (buttons.length > 2) await buttons[2].click();
      await page.waitForTimeout(1000); // Wait for animation
    } else {
        console.log("No expandable buttons found with aria-expanded attribute.");
    }
    
    console.log('Taking Lesson Desktop Expanded Screenshot...');
    await page.screenshot({ path: path.join(__dirname, '../evidence/lesson-desktop-expanded.png'), fullPage: true });

    console.log('Taking Lesson Mobile Expanded Screenshot...');
    await page.setViewportSize({ width: 390, height: 844 });
    // Maybe collapse others first? No, keep expanded state.
    await page.screenshot({ path: path.join(__dirname, '../evidence/lesson-mobile-expanded.png'), fullPage: true });

    await browser.close();
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
