import { test } from '@playwright/test';
import { HomePage } from '../pages/homepage';
import { GamePage } from '../pages/gamepage';
import { EXPECTED_STATS } from '../utils/test-data';

test.describe('Character Level Up Tasks', () => {
  let home: HomePage;
  let game: GamePage;
  const build = 'Knight';
  const name = 'SirRock';

  test.beforeEach(async ({ page }) => {
    home = new HomePage(page);
    game = new GamePage(page);
    await home.openAppAndCheckHomePage();
    await home.verifyOrSelectBuild(build, true);
    await home.assertStats(EXPECTED_STATS[build]);
    await home.createCharacter(name);
    await game.assertCharacterHeader(name, 1, build);
    await home.assertStats(EXPECTED_STATS[build]);
  });

  test('level up via clicking task', async () => {
    await game.completeClickTaskAndVerifyLevelUp(5);
  });

  test('level up via uploading task', async () => {
    await game.completeUploadTaskAndVerifyLevelUp();
  });

  test('level up via typing task', async () => {
    await game.completeTypeTaskAndVerifyLevelUP('Lorem Ipsum');
  });

  test('level up via sliding task', async () => {
    await game.completeSlideTaskAndVerifyLevelUp();
  });

  test('level up via all tasks', async () => {
    await game.completeAllTasks(5, 'Lorem Ipsum');
  });
});

