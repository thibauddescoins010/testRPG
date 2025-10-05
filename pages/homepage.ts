import { Locator, Page } from '@playwright/test';
import { assertVisible } from '../utils/assertions';

export class HomePage {
  readonly page: Page;
  readonly title: Locator;
  readonly characterPanel: Locator;
  readonly statsTitle: Locator;
  readonly strengthTitle: Locator;
  readonly agilityTitle: Locator;
  readonly wisdomTitle: Locator;
  readonly magicTitle: Locator;
  readonly levelTitle: Locator;
  readonly nameInput: Locator;
  readonly buildDropdown: Locator;
  readonly thiefBuild: Locator;
  readonly knightBuild: Locator;
  readonly mageBuild:Locator;
  readonly brigadierBuild: Locator;
  readonly startButton: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByRole('heading', { name: 'TestRPG' });
    this.characterPanel = page.getByTestId('character-name');
    this.statsTitle = page.getByText('Stats');
    this.strengthTitle = page.getByText('Strength');
    this.agilityTitle = page.getByText('Agility');
    this.wisdomTitle = page.getByText('Wisdom');
    this.magicTitle = page.getByText('Magic');
    this.levelTitle = page.getByText('Level', { exact: true });
    this.nameInput = page.getByRole('textbox', { name: 'Character name' });
    this.buildDropdown = page.getByRole('combobox', { name: 'Build' });
    this.thiefBuild = page.getByRole('option', { name: 'Thief' });
    this.knightBuild = page.getByRole('option', { name: 'Knight' });
    this.mageBuild = page.getByRole('option', { name: 'Mage' });
    this.brigadierBuild = page.getByRole('option', { name: 'Brigadier' });
    this.startButton = page.getByRole('button', { name: 'Start!' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async openApp() {
    await this.page.goto(process.env.BASE_URL ?? '/');
  }

  async assertHomePageLocatorsVisible() {
    await assertVisible([
      this.title,
      this.characterPanel,
      this.statsTitle,
      this.strengthTitle,
      this.agilityTitle,
      this.wisdomTitle,
      this.magicTitle,
      this.levelTitle,
      this.nameInput,
      this.buildDropdown,
      this.startButton,
      this.loginButton,
    ]);
  }

  async openAppAndCheckHomePage() {
    await this.openApp();
    await this.assertHomePageLocatorsVisible();
  }
}
