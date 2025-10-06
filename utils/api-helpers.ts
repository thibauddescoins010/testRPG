import { expect } from '@playwright/test';

export function validateBuildResponse(build: any) {
  // The build object does not have a name property in the API response, so only check stats and equipment
  expect(typeof build.strength).toBe('number');
  expect(typeof build.agility).toBe('number');
  expect(typeof build.wisdom).toBe('number');
  expect(typeof build.magic).toBe('number');
  expect(typeof build.weapon).toBe('string');
  expect(typeof build.upgradedWeapon).toBe('string');
  expect(typeof build.armor).toBe('string');
  expect(typeof build.upgradedArmor).toBe('string');
}

export function validBuildPayload(name: string) {
  return {
    build: {
      name,
      strength: 4,
      agility: 3,
      wisdom: 2,
      magic: 1,
    },
  };
}

export function invalidBuildPayloads() {
  return [
    {
      name: 'existing name',
      payload: validBuildPayload('knight'), // assuming 'knight' already exists
    },
    {
      name: 'skill over 10',
      payload: { build: { name: 'TooStrong', strength: 11, agility: 0, wisdom: 0, magic: 0 } },
    },
    {
      name: 'sum over 10',
      payload: { build: { name: 'TooMuch', strength: 5, agility: 5, wisdom: 1, magic: 0 } },
    },
  ];
}
