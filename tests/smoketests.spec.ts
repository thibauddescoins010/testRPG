import { test } from '@playwright/test';
import { HomePage } from '../pages/homepage';

test('homepage has correct locators and Start button', async ({ page }) => {
  const home = new HomePage(page);
  await home.openAppAndCheckHomePage();
});

test('opens on Thief build with correct default stats', async ({ page }) => {
  const home = new HomePage(page);
  await home.openAppAndCheckHomePage();
  await home.verifyOrSelectBuild('Thief');
  // Assert stat progress bars are visible with the right values
  await home.assertStatVisible('Strength', 1);
  await home.assertStatVisible('Agility', 6);
  await home.assertStatVisible('Wisdom', 2);
  await home.assertStatVisible('Magic', 1);
});

test('login flow – invalid + valid login attempts', async ({ page }) => {
  const home = new HomePage(page);
  await home.openAppAndCheckHomePage();
  await home.openLoginModal();

  // Negative flow: submit without credentials
  await home.tryLoginWithoutCredentials();

  // Positive flow: fill valid credentials
  await home.loginWithCredentials('test@example.com', 'Password123');
});
