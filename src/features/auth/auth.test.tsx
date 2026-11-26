import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routes } from '@/app/router';
import { createAppStore } from '@/app/store';
import { AppProviders } from '@/app/providers/AppProviders';

function open(path: string, status: number, body: unknown) {
  const fetch = vi.fn().mockImplementation(() =>
    Promise.resolve(
      new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
      }),
    ),
  );
  vi.stubGlobal('fetch', fetch);
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(
    <AppProviders appStore={createAppStore()}>
      <RouterProvider router={router} />
    </AppProviders>,
  );
  return { fetch, router };
}
afterEach(() => vi.unstubAllGlobals());
describe('authentication routes', () => {
  it.each(['customer', 'designer', 'admin'] as const)(
    'denies a suspended %s even with the matching role',
    async (role) => {
      open(role === 'customer' ? '/account' : '/' + role + '/dashboard', 200, {
        success: true,
        data: {
          user: {
            id: 'test',
            name: 'Test',
            email: 'test@example.test',
            role,
            status: 'suspended',
          },
        },
      });
      expect(
        await screen.findByRole('heading', { name: 'Access denied' }),
      ).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Sign out' }),
      ).not.toBeInTheDocument();
    },
  );
  it('redirects an unauthenticated visitor and preserves destination', async () => {
    const { router } = open('/designer/dashboard', 401, {
      success: false,
      error: { code: 'UNAUTHENTICATED', message: 'Authentication required' },
    });
    expect(
      await screen.findByRole('heading', { name: 'Welcome back' }),
    ).toBeInTheDocument();
    expect(router.state.location.search).toContain(
      'returnTo=%2Fdesigner%2Fdashboard',
    );
  });
  it('rejects a valid account with the wrong role', async () => {
    open('/admin/dashboard', 200, {
      success: true,
      data: {
        user: {
          id: 'test',
          name: 'Test',
          email: 'test@example.test',
          role: 'customer',
          status: 'active',
        },
      },
    });
    expect(
      await screen.findByRole('heading', { name: 'Access denied' }),
    ).toBeInTheDocument();
  });
  it('does not reveal cached workspace content when session lookup fails', async () => {
    open('/account', 503, { success: false });
    expect(
      await screen.findByRole('heading', { name: 'Session unavailable' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Welcome to your account'),
    ).not.toBeInTheDocument();
  });
  it('validates login before sending credentials', async () => {
    const { fetch } = open('/login', 200, {});
    await screen.findByRole('heading', { name: 'Welcome back' });
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(
      await screen.findByText('Enter a valid email address.'),
    ).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });
  it('exposes no reset action or fabricated success', async () => {
    const { fetch } = open('/reset-password', 200, {});
    expect(
      await screen.findByRole('heading', {
        name: 'Password recovery unavailable',
      }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });
});
