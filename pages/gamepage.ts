import { Locator, Page, expect } from '@playwright/test';
import { escapeRegExp } from '../utils/strings';

export class GamePage{
    readonly page: Page;
    readonly characterName: Locator;
    readonly characterStats: Locator;

    constructor(page: Page){
        this.page = page;
        this.characterName = page.getByTestId('character-name');
        this.characterStats = page.getByTestId('character-stats').first();
    }

    async assertCharacterHeader(name: string, level: number, build: string) {
    await expect(this.characterName).toHaveText(name);

    // Build a regex for the stats line: "A level 1 thief" or "a level 1 Thief"
    const buildRe = escapeRegExp(build);
    const re = new RegExp(`^\\s*a\\s+level\\s+${level}\\s+${buildRe}\\s*$`, 'i');

    await expect(this.characterStats).toHaveText(re);
  }
}