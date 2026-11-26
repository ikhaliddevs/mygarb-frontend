import { expect, test } from '@playwright/test';

test('production preview loads without runtime errors or business requests', async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  const requests: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Every stitch starts with an agreement.',
  );
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByText('In development')).toBeVisible();
  expect(errors).toEqual([]);
  expect(
    requests.some((url) => /support\.js|\.dc\.html|\/api\//.test(url)),
  ).toBe(false);
  await page.screenshot({
    path: testInfo.outputPath('foundation.png'),
    fullPage: true,
  });
});

for (const width of [360, 375, 390, 768, 1024, 1440]) {
  test(`fits the ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  });
}

test('unknown and unimplemented workspace routes recover safely', async ({
  page,
}) => {
  await page.goto('/not-implemented');
  await expect(
    page.getByRole('heading', { name: 'Page not found' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Return home' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Every stitch starts with an agreement.',
  );
});

test('keyboard users can skip the header', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Every stitch starts with an agreement.',
  );
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Skip to content' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
});
