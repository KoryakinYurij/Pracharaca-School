import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
    test('homepage visual regression', async ({ page }) => {
        await page.goto('/');
        // Wait for the app to be fully interactive
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveScreenshot('homepage.png', {
            fullPage: true,
            maxDiffPixelRatio: 0.02,
        });
    });

    test('lesson page visual regression', async ({ page }) => {
        await page.goto('/topics/krasivyi-konspekt/lessons/01-noble-basics');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveScreenshot('lesson-page.png', {
            fullPage: true,
            maxDiffPixelRatio: 0.02,
        });
    });
});
