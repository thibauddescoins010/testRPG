import { test } from '@playwright/test';
import { HomePage } from '../pages/homepage';

test('homepage has correct locators and Start button', async ({ page }) => {
  const home = new HomePage(page);
  await home.openAppAndCheckHomePage();
});
