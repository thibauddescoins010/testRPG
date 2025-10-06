import { test, expect } from '@playwright/test';
import { validateBuildResponse, validBuildPayload, invalidBuildPayloads } from '../utils/api-helpers';

const BASE_URL = process.env.BASE_URL_API

test.describe('API /api/builds', () => {
  test('GET returns all builds', async ({ request }) => {
    console.log('BASE_URL_API:', BASE_URL);
    const res = await request.get(`${BASE_URL}/api/builds`);
    console.log('Status:', res.status());
    const text = await res.text();
    console.log('Response body:', text);
    expect(res.ok()).toBeTruthy();
    expect(res.status()).toBe(200);
    const data = JSON.parse(text);
    expect(typeof data).toBe('object');
    expect(Array.isArray(data)).toBeFalsy();
    Object.entries(data).forEach(([_, build]) => {
      validateBuildResponse(build);
    });
  });

  test('GET returns a specific build', async ({ request }) => {
  const res = await request.get(`${BASE_URL}/api/builds?build=knight`);
  console.log('Status:', res.status());
  const text = await res.text();
  console.log('Response body:', text);
  expect(res.ok()).toBeTruthy();
  expect(res.status()).toBe(200);
  const data = JSON.parse(text);
  expect(typeof data).toBe('object');
  validateBuildResponse(data);
  });

  test('POST creates a new build', async ({ request }) => {
    const payload = validBuildPayload('TestBuild1');
    const res = await request.post(`${BASE_URL}/api/builds`, {
      data: payload,
    });
  expect(res.ok()).toBeTruthy();
  expect([200, 201]).toContain(res.status());
    const data = await res.json();
    console.log('POST /api/builds response:', data);
    const build = data.result.build;
    expect(typeof build.name).toBe('string');
    expect(typeof build.strength).toBe('number');
    expect(typeof build.agility).toBe('number');
    expect(typeof build.wisdom).toBe('number');
    expect(typeof build.magic).toBe('number');
    expect(build.name).toBe('TestBuild1');
  });

  for (const { name, payload } of invalidBuildPayloads()) {
    test(`POST fails for invalid build: ${name}`, async ({ request }) => {
      const res = await request.post(`${BASE_URL}/api/builds`, {
        data: payload,
      });
      console.log(`POST /api/builds (invalid: ${name}) status:`, res.status());
      const text = await res.text();
      console.log(`POST /api/builds (invalid: ${name}) response:`, text);
      expect(res.ok()).toBeFalsy();
      expect([400, 409, 422]).toContain(res.status());
    });
  }
});
