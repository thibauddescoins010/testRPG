import { test, expect } from '@playwright/test';

test('homepage has title and Start button', async ({ page }) => {
  await page.goto('https://test-rpg.vercel.app/play');
  await expect(page.getByRole('heading', { name: 'TestRPG' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start!' })).toBeVisible();
});
