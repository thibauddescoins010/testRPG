import { test } from '@playwright/test';
import { HomePage } from '../pages/homepage';
import { GamePage } from '../pages/gamepage';
import { EXPECTED_STATS } from '../utils/test-data';


test.describe('Smoke Tests', () =>{
test('homepage has correct locators and Start button', async ({ page }) => {
  const home = new HomePage(page);
  await home.openAppAndCheckHomePage();
});

test('opens on Thief build with correct default stats', async ({ page }) => {
  const home = new HomePage(page);
  const build = 'Thief'
  await home.openAppAndCheckHomePage();
  await home.verifyOrSelectBuild(build);
  await home.assertStats(EXPECTED_STATS[build]);
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

test('character creation flow – missing name then valid creation', async ({ page }) => {
  const home = new HomePage(page);
  const game = new GamePage(page);

  await home.openAppAndCheckHomePage();

  // Negative flow — try to start without entering a name
  await home.tryStartWithoutName();

  // Positive flow — fill name and create character
  const characterName = 'Leggo';
  const build = 'Thief';
  const level = 1;

  await home.createCharacter(characterName);

  // Verify game page header matches expected name, level, and build
  await game.assertCharacterHeader(characterName, level, build);
});

});
