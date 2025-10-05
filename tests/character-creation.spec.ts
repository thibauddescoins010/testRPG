import { test } from '@playwright/test';
import { HomePage } from '../pages/homepage';
import { GamePage } from '../pages/gamepage';
import { EXPECTED_STATS } from '../utils/test-data';

test('create new Knight and verify stats update before starting', async ({ page }) => {
  const home = new HomePage(page);
  const game = new GamePage(page);

  const build = 'Knight';
  await home.openAppAndCheckHomePage();
  await home.verifyOrSelectBuild(build, true);
  await home.assertStats(EXPECTED_STATS[build]);

  const name = 'SirRock';
  await home.createCharacter(name);
  await game.assertCharacterHeader(name, 1, build);
  await home.assertStats(EXPECTED_STATS[build]);
});
