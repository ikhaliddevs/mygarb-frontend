import { test, expect, type Page } from '@playwright/test';
const id = '000000000000000000000001';
const orderId = '000000000000000000000002';
const notificationId = '000000000000000000000003';
const snapshot = {
  unit: 'cm',
  values: [{ label: 'Chest', value: 90 }],
  capturedAt: '2026-11-20T00:00:00Z',
};
const request = {
  id,
  status: 'submitted',
  outfitType: 'Custom agbada',
  quantity: 1,
  budgetAmount: '50000.00',
  currency: 'NGN',
  desiredCompletionDate: '2027-01-20',
  createdAt: '2026-11-20T00:00:00Z',
  description: 'Custom outfit details',
  referenceImageUrls: [],
  measurementSnapshot: snapshot,
  responseText: null,
};
const order = {
  id: orderId,
  requestId: id,
  status: 'in_progress',
  outfitType: 'Custom agbada',
  quantity: 1,
  priceAmount: '50000.00',
  currency: 'NGN',
  completionDate: '2027-01-18',
  createdAt: '2026-11-20T00:00:00Z',
  description: 'Agreed outfit',
  referenceImageUrls: [],
  measurementSnapshot: snapshot,
  effectiveMeasurements: snapshot,
  history: [{ status: 'confirmed', at: '2026-11-20T00:00:00Z' }],
};
async function customer(page: Page) {
  let profile = { id, name: 'Test Customer', phone: '' };
  let measurements = {
    unit: 'cm',
    values: [{ label: 'Chest', value: 2.54 }],
    updatedAt: '2026-11-20T00:00:00Z',
  };
  const messages: {
    id: string;
    actorId: string;
    text: string;
    kind: string;
    version: null;
    at: string;
  }[] = [];
  let readAt: string | null = null;
  const writes: string[] = [];
  await page.route('http://localhost:5000/api/**', async (route) => {
    const r = route.request();
    const p = new URL(r.url()).pathname;
    let data: unknown;
    if (r.method() !== 'GET') {
      writes.push(p);
      expect(r.headers()['x-mygarb-request']).toBe('1');
    }
    if (p === '/api/auth/me')
      data = {
        user: {
          id,
          name: 'Test Customer',
          email: 'customer@example.test',
          role: 'customer',
          status: 'active',
        },
      };
    else if (p === '/api/profile') {
      if (r.method() === 'PATCH') profile = { ...profile, ...r.postDataJSON() };
      data = { profile };
    } else if (p === '/api/measurements') {
      if (r.method() === 'PUT')
        measurements = {
          ...r.postDataJSON(),
          updatedAt: '2026-11-26T00:00:00Z',
        };
      data = { measurements };
    } else if (p === '/api/requests')
      data = { requests: [request], page: 1, limit: 20, hasMore: false };
    else if (p === '/api/orders')
      data = { orders: [order], page: 1, limit: 20, hasMore: false };
    else if (p === '/api/requests/' + id) data = { request };
    else if (p === '/api/orders/' + orderId) data = { order };
    else if (p === '/api/requests/' + id + '/messages') {
      if (r.method() === 'POST') {
        const message = {
          id: '000000000000000000000004',
          actorId: id,
          text: r.postDataJSON().text,
          kind: 'text',
          version: null,
          at: '2026-11-26T00:00:00Z',
        };
        messages.push(message);
        data = { requestId: id, orderId: null, message };
      } else
        data = {
          requestId: id,
          orderId: null,
          messages,
          page: 1,
          limit: 20,
          hasMore: false,
        };
    } else if (p === '/api/notifications')
      data = {
        notifications: [
          {
            id: notificationId,
            type: 'new_message',
            requestId: id,
            orderId: null,
            at: '2026-11-26T00:00:00Z',
            readAt,
          },
        ],
        page: 1,
        limit: 20,
        hasMore: false,
        deliveryPending: false,
      };
    else if (p === '/api/notifications/' + notificationId + '/read') {
      readAt = '2026-11-26T01:00:00Z';
      data = { notification: { id: notificationId, readAt } };
    } else {
      await route.fulfill({
        status: 404,
        json: {
          success: false,
          error: { code: 'NOT_FOUND', message: 'Not found' },
        },
      });
      return;
    }
    await route.fulfill({ status: 200, json: { success: true, data } });
  });
  return { writes };
}
test('edits personal details using the documented profile fields', async ({
  page,
}) => {
  const { writes } = await customer(page);
  await page.goto('/account/profile');
  await page.getByLabel('Full name').fill('Updated Customer');
  await page.getByLabel('Phone (private)').fill('+234 800 000 0000');
  await page.getByRole('button', { name: 'Save account details' }).click();
  await expect(page.getByRole('status')).toHaveText('Account details saved.');
  await page.reload();
  await expect(page.getByLabel('Full name')).toHaveValue('Updated Customer');
  expect(writes).toEqual(['/api/profile']);
});
test('converts and saves private measurements without relabelling values', async ({
  page,
}) => {
  await customer(page);
  await page.goto('/account/measurements');
  await page.getByLabel('Unit', { exact: true }).selectOption('in');
  await expect(page.getByLabel('Value (in)')).toHaveValue('1');
  await page.getByRole('button', { name: 'Save measurements' }).click();
  await expect(page.getByRole('status')).toContainText('Measurements saved.');
  await page.reload();
  await expect(page.getByLabel('Unit', { exact: true })).toHaveValue('in');
  await expect(page.getByLabel('Value (in)')).toHaveValue('1');
});
test('validates duplicate measurements without writing', async ({ page }) => {
  const { writes } = await customer(page);
  await page.goto('/account/measurements');
  await page.getByRole('button', { name: 'Add measurement' }).click();
  await page.getByLabel('Measurement 2', { exact: true }).fill('CHEST');
  await page.getByLabel('Value (cm)').nth(1).fill('80');
  await page.getByRole('button', { name: 'Save measurements' }).click();
  await expect(
    page.getByText('Measurement names must be unique.'),
  ).toBeVisible();
  expect(writes).toEqual([]);
});
test('keeps request and order views separate and snapshots read-only', async ({
  page,
}) => {
  const { writes } = await customer(page);
  await page.goto('/account/requests');
  await page.getByRole('link', { name: 'View request', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Original measurement snapshot' }),
  ).toBeVisible();
  await expect(page.getByText('90 cm', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Back to requests and orders' }).click();
  await page.getByRole('button', { name: 'Orders', exact: true }).click();
  await page.getByRole('link', { name: 'View order', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Status history' }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Confirm completion' }),
  ).toHaveCount(0);
  expect(writes).toEqual([]);
});
test('sends literal text through a scoped conversation', async ({ page }) => {
  await customer(page);
  await page.goto('/account/messages/' + id);
  await page
    .getByLabel('Message', { exact: true })
    .fill('<img src=x onerror=alert(1)>');
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(
    page.getByText('<img src=x onerror=alert(1)>', { exact: true }),
  ).toBeVisible();
  await expect(page.locator('main img')).toHaveCount(0);
});
test('does not silently retry a failed message or discard the draft', async ({
  page,
}) => {
  await customer(page);
  let calls = 0;
  await page.route('**/api/requests/' + id + '/messages', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fallback();
      return;
    }
    calls++;
    await route.fulfill({ status: 503, json: { success: false } });
  });
  await page.goto('/account/messages/' + id);
  await page.getByLabel('Message', { exact: true }).fill('Keep my draft');
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText(
    'Check refreshed messages before sending again',
  );
  await expect(page.getByLabel('Message', { exact: true })).toHaveValue(
    'Keep my draft',
  );
  expect(calls).toBe(1);
});
test('marks a notification read and navigates to the scoped conversation', async ({
  page,
}) => {
  await customer(page);
  await page.goto('/account/notifications');
  await expect(page.getByText('1 unread on this page')).toBeVisible();
  await page.getByRole('button', { name: 'Mark as read' }).click();
  await expect(page.getByText('0 unread on this page')).toBeVisible();
  await page.getByRole('link', { name: 'View details' }).click();
  await expect(
    page.getByRole('heading', { name: 'Conversation', exact: true }),
  ).toBeVisible();
});
test('offers retry after profile load failure and preserves a dirty form during session recheck', async ({
  page,
}) => {
  await customer(page);
  let fail = true;
  await page.route('**/api/profile', async (route) => {
    if (fail) await route.fulfill({ status: 503, json: { success: false } });
    else await route.fallback();
  });
  await page.goto('/account/profile');
  await expect(page.getByRole('alert')).toContainText('Unable to load');
  fail = false;
  await page.getByRole('button', { name: 'Try again' }).click();
  await page.getByLabel('Full name').fill('Unsaved name');
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(page.getByLabel('Full name')).toHaveValue('Unsaved name');
});
test('rejects invalid record identifiers without a record API request', async ({
  page,
}) => {
  const calls: string[] = [];
  await customer(page);
  page.on('request', (r) => {
    if (r.url().includes('/api/requests/')) calls.push(r.url());
  });
  await page.goto('/account/requests/not-an-id');
  await expect(
    page.getByRole('heading', { name: 'Invalid record' }),
  ).toBeVisible();
  expect(calls).toEqual([]);
});
for (const path of [
  'profile',
  'measurements',
  'requests',
  'messages',
  'notifications',
]) {
  test(path + ' fits mobile and desktop', async ({ page }, info) => {
    await customer(page);
    await page.goto('/account/' + path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (path === 'profile' || path === 'measurements')
      await page.screenshot({
        path: info.outputPath(path + '.png'),
        fullPage: true,
      });
  });
}

test('recovers only an already confirmed pending order with an explicit same-request retry', async ({
  page,
}) => {
  await customer(page);
  let calls = 0;
  await page.route('**/api/requests/' + id, (route) =>
    route.fulfill({
      json: {
        success: true,
        data: {
          request: {
            ...request,
            status: 'confirmed',
            orderId,
            orderPending: true,
          },
        },
      },
    }),
  );
  await page.route('**/api/requests/' + id + '/confirm', async (route) => {
    calls++;
    expect(route.request().method()).toBe('PATCH');
    expect(route.request().postDataJSON()).toEqual({});
    expect(route.request().headers()['x-mygarb-request']).toBe('1');
    await route.fulfill(
      calls === 1
        ? {
            status: 503,
            json: { success: false, error: { code: 'CONFIRMATION_PENDING' } },
          }
        : { json: { success: true, data: { order } } },
    );
  });
  await page.goto('/account/requests/' + id);
  await page.getByRole('button', { name: 'Recover confirmed order' }).click();
  await expect(page.getByRole('alert')).toContainText(
    'Do not submit a replacement request',
  );
  expect(calls).toBe(1);
  await page.getByRole('button', { name: 'Recover confirmed order' }).click();
  await expect(page).toHaveURL('/account/orders/' + orderId);
  expect(calls).toBe(2);
});

test('shows accepted proposal terms without enabling unsupported specification confirmation', async ({
  page,
}) => {
  const { writes } = await customer(page);
  await page.route('**/api/requests/' + id, (route) =>
    route.fulfill({
      json: {
        success: true,
        data: {
          request: {
            ...request,
            status: 'accepted',
            proposal: { priceAmount: '65000.00', completionDate: '2027-01-15' },
          },
        },
      },
    }),
  );
  await page.goto('/account/requests/' + id);
  await expect(
    page.getByRole('heading', { name: 'Designer proposal' }),
  ).toBeVisible();
  await expect(
    page.getByText('Proposed completion date: 2027-01-15'),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: /confirm|recover/i }),
  ).toHaveCount(0);
  expect(writes).toEqual([]);
});
