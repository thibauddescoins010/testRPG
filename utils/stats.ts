import { expect, Locator, Page } from '@playwright/test';
import { escapeRegExp } from './strings';
import type { StatName } from '../pages/homepage';


export function buildStatRegex(stat: StatName, value?: number): RegExp {
  return value === undefined
    ? new RegExp(`^${escapeRegExp(stat)}\\s*\\d+$`)
    : new RegExp(`^${escapeRegExp(stat)}\\s*${value}$`);
}

export async function assertStatVisible(locator: Locator, stat: StatName, value?: number) {
  try {
    await expect(locator).toBeVisible();
    console.log(`✅ Stat "${stat}"${value !== undefined ? ` (${value})` : ''} is visible`);
  } catch (error) {
    throw new Error(`❌ Stat "${stat}"${value !== undefined ? ` (${value})` : ''} not visible or missing: ${error}`);
  }
}

export async function assertStatsOnPage(
  page: Page,
  expected: Record<StatName, number>,
  statLocatorFn: (stat: StatName, value?: number) => Locator
) {
  for (const [stat, value] of Object.entries(expected) as [StatName, number][]) {
    const locator = statLocatorFn(stat, value);
    await assertStatVisible(locator, stat, value);
  }
}
