import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { routes } from '@/app/router';
import { createAppStore } from '@/app/store';
import { AppProviders } from '@/app/providers/AppProviders';
import { RouteErrorPage } from '@/shared/components/feedback/RouteErrorPage';

function renderRoute(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(
    <AppProviders appStore={createAppStore()}>
      <RouterProvider router={router} />
    </AppProviders>,
  );
  return router;
}

describe('foundation routing', () => {
  it('loads the honest preview through application providers', async () => {
    renderRoute('/');
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Every stitch starts with an agreement.',
      }),
    ).toHaveTextContent('Every stitch starts with an agreement.');
    expect(
      screen.getByText(/and custom requests are not available yet/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Skip to content' }),
    ).toHaveAttribute('href', '#main');
  });

  it('recovers from an unknown route via the router', async () => {
    const user = userEvent.setup();
    const router = renderRoute('/missing');
    expect(
      await screen.findByRole('heading', { name: 'Page not found' }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Return home' }));
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Every stitch starts with an agreement.',
      }),
    ).toHaveTextContent('Every stitch starts with an agreement.');
    expect(router.state.location.pathname).toBe('/');
  });

  it('keeps unimplemented routes unavailable', async () => {
    renderRoute('/not-implemented');
    expect(
      await screen.findByRole('heading', { name: 'Page not found' }),
    ).toBeInTheDocument();
  });

  it('contains route failures without showing internal error details', async () => {
    const router = createMemoryRouter([
      {
        path: '/',
        loader: () => {
          throw new Error('private backend detail');
        },
        element: <div>Unreachable</div>,
        errorElement: <RouteErrorPage />,
      },
    ]);
    render(<RouterProvider router={router} />);
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Please try again',
    );
    expect(
      screen.queryByText('private backend detail'),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Try again' }),
    ).toBeInTheDocument();
  });
});
