import { test } from '@playwright/test';
import { HomePage } from '../pages/homepage';
import { GamePage } from '../pages/gamepage';
import { EXPECTED_STATS } from '../utils/test-data';

let home: HomePage;
let game: GamePage;

test.beforeEach(async ({ page }) => {
  home = new HomePage(page);
  game = new GamePage(page);

  await home.openAppAndCheckHomePage();
});

test.describe('Character creation flows', () =>{
test('create new Knight and verify stats update before starting', async ({}) => {

  const build = 'Knight';
  await home.verifyOrSelectBuild(build, true);
  await home.assertStats(EXPECTED_STATS[build]);

  const name = 'SirRock';
  await home.createCharacter(name);
  await game.assertCharacterHeader(name, 1, build);
  await home.assertStats(EXPECTED_STATS[build]);
});

test('create new Mage and verify stats update before starting', async ({}) => {

  const build = 'Mage';
  await home.verifyOrSelectBuild(build, true);
  await home.assertStats(EXPECTED_STATS[build]);

  const name = 'Magus';
  await home.createCharacter(name);
  await game.assertCharacterHeader(name, 1, build);
  await home.assertStats(EXPECTED_STATS[build]);
});

test('create new Brigadier and verify stats update before starting', async ({}) => {

  const build = 'Brigadier';
  await home.verifyOrSelectBuild(build, true);
  await home.assertStats(EXPECTED_STATS[build]);

  const name = 'SgtPrice';
  await home.createCharacter(name);
  await game.assertCharacterHeader(name, 1, build);
  await home.assertStats(EXPECTED_STATS[build]);
});

});
