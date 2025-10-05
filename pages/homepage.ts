import { Locator, Page, expect } from '@playwright/test';
import { assertVisible } from '../utils/assertions';
import { escapeRegExp } from '../utils/strings';
import { assertStatsOnPage, buildStatRegex } from '../utils/stats';

export type StatName = 'Strength' | 'Agility' | 'Wisdom' | 'Magic';

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
  readonly startButton: Locator;
  readonly loginButton: Locator;
  readonly loginDialog: Locator;
  readonly loginEmailField: Locator;
  readonly loginPasswordField: Locator;
  readonly emailRequiredErrorMessage: Locator;
  readonly passwordRequiredErrorMessage: Locator;
  readonly logOutButton: Locator;
  readonly characterNameErrorMessage: Locator;

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
    this.startButton = page.getByRole('button', { name: 'Start!' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.loginDialog = page.getByRole('dialog', { name: 'Login to TestRPG' });
    this.loginEmailField = page.getByRole('textbox', { name: 'Email' });
    this.loginPasswordField = page.getByRole('textbox', { name: 'Password' });
    this.emailRequiredErrorMessage = page.getByText('EmailRequired');
    this.passwordRequiredErrorMessage = page.getByText('PasswordRequired');
    this.logOutButton = page.getByTestId('logout-button');
    this.characterNameErrorMessage = page.getByText('Name must be at least 3');
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

  async assertHomePageLocatorsVisibleAfterLogin() {
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
      this.logOutButton,
    ]);
    await expect(this.loginButton).toBeHidden();
  }

  async openAppAndCheckHomePage() {
    await this.openApp();
    await this.assertHomePageLocatorsVisible();
  }

  statProgressBar(stat: StatName, value?: number): Locator {
  const statRe = buildStatRegex(stat, value);
  return this.page.locator('div').filter({ hasText: statRe }).getByRole('progressbar');
}

async assertStats(expected: Record<StatName, number>) {
  await assertStatsOnPage(this.page, expected, (stat, value) => this.statProgressBar(stat, value));
}

async verifyOrSelectBuild(build: string, change: boolean = false) {
  if (change) {
    // Open the dropdown
    await this.buildDropdown.click();

    // Click the desired option
    await this.page.getByRole('option', { name: build }).click();
  }

  // Verify that the combobox displays the correct build
  await expect(this.buildDropdown).toHaveText(build);
}

async openLoginModal() {
  await this.loginButton.click();
  await assertVisible([
    this.loginDialog,
    this.loginEmailField,
    this.loginPasswordField,
    this.loginButton
  ]);
}

async tryLoginWithoutCredentials() {
  await this.loginButton.click();
  await assertVisible([
    this.emailRequiredErrorMessage,
    this.passwordRequiredErrorMessage
  ]);
}

async loginWithCredentials(email: string, password: string) {
  await this.loginEmailField.fill(email);
  await this.loginPasswordField.fill(password);
  await this.loginButton.click();
  await this.assertHomePageLocatorsVisibleAfterLogin();
}

async tryStartWithoutName() {
  await this.startButton.click();
  await assertVisible([
    this.characterNameErrorMessage,
  ])
}

async createCharacter(name: string) {
  await this.nameInput.fill(name);
  await this.startButton.click();
}

}
