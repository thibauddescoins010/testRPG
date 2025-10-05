import { expect, Locator } from '@playwright/test';

/**
 * Assert that one or several locators are visible on the page.
 * @param locators - One locator or an array of locators.
 */
export async function assertVisible(locators: Locator | Locator[]): Promise<void> {
  const list = Array.isArray(locators) ? locators : [locators];

  for (const locator of list) {
    try {
      await expect(locator).toBeVisible();
    } catch (error) {
      throw new Error(`❌ Visibility assertion failed for locator: ${locator} \n${error}`);
    }
  }
}
