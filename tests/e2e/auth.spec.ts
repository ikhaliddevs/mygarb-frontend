import { test, expect, type Page } from '@playwright/test';
type Role = 'customer' | 'designer' | 'admin';
async function mockAuth(page: Page, role: Role = 'customer') {
  let signedIn = false;
  let expires = false;
  await page.route('**/api/auth/**', async (route) => {
    const path = new URL(route.request().url()).pathname;
    const body = {
      success: true,
      data: {
        user: {
          id: 'test-user',
          name: 'Browser Test',
          email: 'browser@example.test',
          role,
          status: 'active',
        },
      },
    };
    const error = {
      success: false,
      error: { code: 'UNAUTHENTICATED', message: 'Authentication required' },
    };
    let status = 200;
    let json: unknown = body;
    if (path.endsWith('/login')) {
      expect(route.request().headers()['x-mygarb-request']).toBe('1');
      signedIn = true;
    } else if (path.endsWith('/logout')) {
      signedIn = false;
      json = { success: true, data: { message: 'Logged out' } };
    } else if (path.endsWith('/me') && (!signedIn || expires)) {
      status = 401;
      json = error;
    } else if (
      path.endsWith('/register') ||
      path.endsWith('/resend-verification')
    ) {
      status = 202;
      json = {
        success: true,
        data: {
          message:
            'If this address is eligible, check it for a verification code. Delivery is not confirmed; request a resend if no code arrives.',
        },
      };
    } else if (path.endsWith('/verify-email')) {
      json = { success: true, data: { emailVerified: true } };
    }
    await route.fulfill({ status, json });
  });
  return {
    expire: () => {
      expires = true;
    },
  };
}
for (const role of ['customer', 'designer', 'admin'] as const) {
  test(
    role +
      ' session restore, isolated workspace, denied cross-role route and logout',
    async ({ page }) => {
      await mockAuth(page, role);
      const destination =
        role === 'customer' ? '/account' : '/' + role + '/dashboard';
      await page.goto(destination);
      await expect(
        page.getByRole('heading', { name: 'Welcome back' }),
      ).toBeVisible();
      await page
        .getByLabel('Email', { exact: true })
        .fill('browser@example.test');
      await page.getByLabel('Password', { exact: true }).fill('test-password');
      await page.getByRole('button', { name: 'Sign in', exact: true }).click();
      await expect(page).toHaveURL(new RegExp(destination + '$'));
      await expect(
        page.getByRole('button', { name: 'Sign out' }),
      ).toBeVisible();
      await page.reload();
      await expect(
        page.getByRole('button', { name: 'Sign out' }),
      ).toBeVisible();
      expect(await page.evaluate(() => localStorage.length)).toBe(0);
      await page.goto(
        role === 'admin' ? '/designer/dashboard' : '/admin/dashboard',
      );
      await expect(
        page.getByRole('heading', { name: 'Access denied' }),
      ).toBeVisible();
      await page.goto(destination);
      await page.getByRole('button', { name: 'Sign out' }).click();
      await expect(
        page.getByRole('heading', { name: 'Welcome back' }),
      ).toBeVisible();
      await page.goto(destination);
      await expect(
        page.getByRole('heading', { name: 'Welcome back' }),
      ).toBeVisible();
    },
  );
}
test('registration and verification require a separate login', async ({
  page,
}) => {
  await mockAuth(page);
  await page.goto('/register');
  await expect(page.getByRole('radio')).toHaveCount(2);
  await page.getByLabel('Full name').fill('Browser Test');
  await page.getByLabel('Email', { exact: true }).fill('browser@example.test');
  await page.getByLabel('Password', { exact: true }).fill('test-password');
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(
    page.getByRole('heading', { name: 'Verify your email' }),
  ).toBeVisible();
  await expect(page.getByRole('status')).toContainText(
    'Delivery is not confirmed',
  );
  await page.getByLabel('Verification code').fill('012345');
  await page.getByRole('button', { name: 'Verify email', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Email verified');
  await page.goto('/account');
  await expect(
    page.getByRole('heading', { name: 'Welcome back' }),
  ).toBeVisible();
});
test('expired session closes workspace on reload', async ({ page }) => {
  const auth = await mockAuth(page);
  await page.goto('/login');
  await page.getByLabel('Email', { exact: true }).fill('browser@example.test');
  await page.getByLabel('Password', { exact: true }).fill('test-password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Customer account', exact: true }),
  ).toBeVisible();
  auth.expire();
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Welcome back' }),
  ).toBeVisible();
});
test('failed login, recovery unavailable, and keyboard password reveal', async ({
  page,
}) => {
  await page.route('**/api/auth/login', (route) =>
    route.fulfill({
      status: 401,
      json: {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
        },
      },
    }),
  );
  await page.goto('/login');
  await page.getByLabel('Email', { exact: true }).fill('browser@example.test');
  await page.getByLabel('Password', { exact: true }).fill('test-password');
  await page.getByRole('button', { name: 'Show password' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByLabel('Password', { exact: true })).toHaveAttribute(
    'type',
    'text',
  );
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Unable to sign in');
  await expect(page.getByLabel('Password', { exact: true })).toHaveValue('');
  await page.getByRole('link', { name: 'Forgot password?' }).click();
  await expect(
    page.getByRole('heading', { name: 'Password recovery unavailable' }),
  ).toBeVisible();
});
for (const width of [360, 375, 390, 768, 1024, 1440]) {
  test('authentication fits ' + width + 'px', async ({ page }, info) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/register');
    await expect(
      page.getByRole('heading', { name: 'Create your account' }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (width === 390 || width === 1440)
      await page.screenshot({
        path: info.outputPath('auth-' + width + '.png'),
        fullPage: true,
      });
  });
}

test('session failure offers retry without exposing a workspace', async ({
  page,
}) => {
  let fail = true;
  await page.route('**/api/auth/me', (route) =>
    route.fulfill(
      fail
        ? { status: 503, json: { success: false } }
        : {
            status: 401,
            json: {
              success: false,
              error: {
                code: 'UNAUTHENTICATED',
                message: 'Authentication required',
              },
            },
          },
    ),
  );
  await page.goto('/admin/dashboard');
  await expect(
    page.getByRole('heading', { name: 'Session unavailable' }),
  ).toBeVisible();
  await expect(page.getByRole('navigation')).toHaveCount(0);
  fail = false;
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(
    page.getByRole('heading', { name: 'Welcome back' }),
  ).toBeVisible();
});
test('failed logout remains honest and can be retried', async ({ page }) => {
  await mockAuth(page);
  await page.goto('/login');
  await page.getByLabel('Email', { exact: true }).fill('browser@example.test');
  await page.getByLabel('Password', { exact: true }).fill('test-password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible();
  await page.route('**/api/auth/logout', (route) =>
    route.fulfill({ status: 503, json: { success: false } }),
  );
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page.getByRole('alert')).toContainText(
    'You have not been signed out',
  );
  await page.unroute('**/api/auth/logout');
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(
    page.getByRole('heading', { name: 'Welcome back' }),
  ).toBeVisible();
});
test('verification and resend failures do not claim delivery or verification', async ({
  page,
}) => {
  await page.route('**/api/auth/verify-email', (route) =>
    route.fulfill({
      status: 400,
      json: {
        success: false,
        error: { code: 'VERIFICATION_FAILED', message: 'Unable to verify' },
      },
    }),
  );
  await page.route('**/api/auth/resend-verification', (route) =>
    route.fulfill({
      status: 429,
      json: {
        success: false,
        error: { code: 'AUTH_RATE_LIMITED', message: 'Too many attempts' },
      },
    }),
  );
  await page.goto('/verify-email');
  await page.getByLabel('Email', { exact: true }).fill('browser@example.test');
  await page.getByLabel('Verification code').fill('123456');
  await page.getByRole('button', { name: 'Verify email', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Unable to verify');
  await page.getByRole('button', { name: 'Resend code' }).click();
  await expect(page.getByRole('alert')).toContainText('Too many attempts');
  await expect(page.getByRole('status')).toHaveCount(0);
});

test('keeps the protected destination through recovery, registration and verification', async ({
  page,
}) => {
  await mockAuth(page, 'designer');
  const destination = '/designer/dashboard?tab=overview&sort=recent';
  await page.goto(destination);
  await expect(
    page.getByRole('heading', { name: 'Welcome back' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Forgot password?' }).click();
  await page.getByRole('link', { name: 'Back to sign in' }).click();
  expect(new URL(page.url()).searchParams.get('returnTo')).toBe(destination);
  await page.getByRole('link', { name: 'Create an account' }).click();
  await page.getByRole('radio', { name: 'Designer', exact: true }).check();
  await page.getByLabel('Full name').fill('Browser Test');
  await page.getByLabel('Email', { exact: true }).fill('browser@example.test');
  await page.getByLabel('Password', { exact: true }).fill('test-password');
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(
    page.getByRole('heading', { name: 'Verify your email' }),
  ).toBeVisible();
  expect(new URL(page.url()).searchParams.get('returnTo')).toBe(destination);
  await page.getByLabel('Verification code').fill('012345');
  await page.getByRole('button', { name: 'Verify email', exact: true }).click();
  await page.getByRole('link', { name: 'Sign in', exact: true }).click();
  await page.getByLabel('Email', { exact: true }).fill('browser@example.test');
  await page.getByLabel('Password', { exact: true }).fill('test-password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL('http://127.0.0.1:4173' + destination);
});
