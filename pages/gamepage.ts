import { Locator, Page, expect } from '@playwright/test';
import { escapeRegExp } from '../utils/strings';
import { assertStatsOnPage, buildStatRegex } from '../utils/stats';
import { assertVisible } from '../utils/assertions';
import type { StatName } from './homepage';

export class GamePage{
    readonly page: Page;
    readonly characterName: Locator;
    readonly characterStats: Locator;
    readonly adventureSection: Locator;
    readonly clickerSection: Locator;
    readonly uploaderSection: Locator;
    readonly typerSection: Locator;
    readonly sliderSection: Locator;
    readonly clickCountdownBtn: Locator;
    readonly uploadFile: Locator;
    readonly typeInput: Locator;
    readonly slider: Locator;
    readonly clickerSuccess: Locator;
    readonly uploaderSuccess: Locator;
    readonly typerSuccess: Locator;
    readonly sliderSuccess: Locator;

  constructor(page: Page){
    this.page = page;
    this.characterName = page.getByTestId('character-name');
    this.characterStats = page.getByTestId('character-stats').first();
    this.adventureSection = page.locator('div.p-6.pt-0.space-y-4');
    this.clickerSection = this.adventureSection.getByTestId('adventure-clicker');
    this.uploaderSection = this.adventureSection.getByTestId('adventure-uploader');
    this.typerSection = this.adventureSection.getByTestId('adventure-typer');
    this.sliderSection = this.adventureSection.getByTestId('adventure-slider');
    this.clickCountdownBtn = this.clickerSection.getByRole('button', { name: /click me \d+ times/i });
    this.uploadFile = this.uploaderSection.locator('input[type="file"]');
    this.typeInput = this.typerSection.getByRole('textbox');
    this.slider = this.sliderSection.getByRole('slider');
    this.clickerSuccess = this.clickerSection.locator('[data-task="clicker"]');
    this.uploaderSuccess = this.uploaderSection.locator('[data-task="uploader"]');
    this.typerSuccess = this.typerSection.locator('[data-task="typer"]');
    this.sliderSuccess = this.sliderSection.locator('[data-task="slider"]');
    }

    async assertCharacterHeader(name: string, level: number, build: string) {
    await expect(this.characterName).toHaveText(name);

    // Build a regex for the stats line: "A level 1 thief" or "a level 1 Thief"
    const buildRe = escapeRegExp(build);
    const re = new RegExp(`^\\s*a\\s+level\\s+${level}\\s+${buildRe}\\s*$`, 'i');

    await expect(this.characterStats).toHaveText(re);
  }

  statProgressBar(stat: StatName, value?: number): Locator {
  const statRe = buildStatRegex(stat, value);
  return this.page
    .locator(`[data-character-stats="${stat}"]`)
    .filter({ hasText: statRe })
    .getByRole('progressbar');
}

async assertStats(expected: Record<StatName, number>) {
  await assertStatsOnPage(this.page, expected, (stat, value) => this.statProgressBar(stat, value));
}

// Parse current level from "A level X <build>"
  async getCurrentLevel(): Promise<number> {
    const text = await this.characterStats.textContent();
    const m = text?.match(/level\s+(\d+)/i);
    if (!m) throw new Error(`Could not parse level from header text: "${text}"`);
    return Number(m[1]);
  }


  private async waitForLevelUpByOne(before: number, message: string = 'Waiting for level to increment by one') {
    await expect.poll(async () => {
      return await this.getCurrentLevel();
    }, {
      message,
    }).toBe(before + 1);
  }

  async completeClickTaskAndVerifyLevelUp(clicks) {
    const before = await this.getCurrentLevel();
    for (let i = 0; i < clicks; i++) {
      await this.clickCountdownBtn.click();
    }
    await expect(this.clickerSuccess).toBeVisible();
    await this.waitForLevelUpByOne(before, 'Waiting for level to increment by one after clicks');
  }

  async completeUploadTaskAndVerifyLevelUp() {
    await assertVisible(this.uploadFile);
    const before = await this.getCurrentLevel();
    // Pass a virtual file directly (no disk file needed)
    await this.uploadFile.setInputFiles({
      name: 'note.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('hello from Playwright'),
    });
    await expect(this.uploaderSuccess).toBeVisible();
    await this.waitForLevelUpByOne(before, 'Waiting for level to increment by one after upload');
  }

  async completeTypeTaskAndVerifyLevelUP(text) {
  await assertVisible(this.typeInput);
  const before = await this.getCurrentLevel();
  await this.typeInput.fill(text);
  await expect(this.typerSuccess).toBeVisible();
  await this.waitForLevelUpByOne(before, 'Waiting for level to increment by one after typing');
  }

  async completeSlideTaskAndVerifyLevelUp() {
  await assertVisible(this.slider);
  const before = await this.getCurrentLevel();
  await this.slider.focus();
  await this.slider.press('End');
  await expect(this.sliderSuccess).toBeVisible();
  await this.waitForLevelUpByOne(before, 'Waiting for level to increment by one after sliding');
  }

  async completeAllTasks(clicks, text) {
    await this.completeClickTaskAndVerifyLevelUp(clicks);
    await this.completeUploadTaskAndVerifyLevelUp();
    await this.completeTypeTaskAndVerifyLevelUP(text);
    await this.completeSlideTaskAndVerifyLevelUp();
  }
}