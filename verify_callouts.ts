import { chromium, Page, expect } from '@playwright/test';

async function verifyCalloutAccessibility(page: Page) {
  // Navigate to the Kitchen Sink page where Callouts are demoed
  await page.goto('http://localhost:5173/kitchen-sink');

  // Verify the "Design Insight" callout (type="insight")
  const insightCallout = page.getByText('Design Insight', { exact: true }).locator('..');

  // Check for the sr-only label "На заметку"
  const insightLabel = insightCallout.locator('span.sr-only');
  await expect(insightLabel).toHaveText('На заметку:');

  // Check that the icon has aria-hidden="true"
  // The icon is in a div that precedes the text content div
  const insightIconContainer = page.locator('div.text-gold').first();
  await expect(insightIconContainer).toHaveAttribute('aria-hidden', 'true');

  // Verify the "Cautionary Note" callout (type="warning")
  const warningCallout = page.getByText('Cautionary Note', { exact: true }).locator('..');
  const warningLabel = warningCallout.locator('span.sr-only');
  await expect(warningLabel).toHaveText('Предупреждение:');

  // Verify the "Critical Requirement" callout (type="important")
  const importantCallout = page.getByText('Critical Requirement', { exact: true }).locator('..');
  const importantLabel = importantCallout.locator('span.sr-only');
  await expect(importantLabel).toHaveText('Важно:');

  // Verify MetaphorBlock
  // Find the MetaphorBlock by its text content
  const metaphorBlock = page.locator('div.shadow-card', { hasText: 'Think of the interface as a quiet library' });

  // Check that the icon container has aria-hidden="true"
  // The icon container is the first child div
  const metaphorIconContainer = metaphorBlock.locator('div').first();
  await expect(metaphorIconContainer).toHaveAttribute('aria-hidden', 'true');

  // Take a screenshot of the Callouts section
  // We'll scroll to the section first
  await page.getByRole('heading', { name: '3. Callouts & Metaphors' }).scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'verification.png' });
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await verifyCalloutAccessibility(page);
    console.log('Verification passed!');
  } catch (error) {
    console.error('Verification failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
