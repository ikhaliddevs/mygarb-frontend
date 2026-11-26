import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { RouteErrorPage } from '@/shared/components/feedback/RouteErrorPage';
import { LoadingPage } from '@/shared/components/feedback/LoadingPage';

import { RequireRole } from '@/features/auth/RequireRole';
import { AuthLayout } from '@/features/auth/AuthLayout';
import { storefrontRoutes } from '@/apps/storefront/routes';
import { designerRoutes } from '@/apps/designer/routes';
import { adminRoutes } from '@/apps/admin/routes';

export const routes: RouteObject[] = [
  {
    element: <AuthLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        path: '/login',
        lazy: async () => ({
          Component: (await import('@/features/auth/LoginPage')).LoginPage,
        }),
      },
      {
        path: '/register',
        lazy: async () => ({
          Component: (await import('@/features/auth/RegisterPage'))
            .RegisterPage,
        }),
      },
      {
        path: '/verify-email',
        lazy: async () => ({
          Component: (await import('@/features/auth/VerifyPage')).VerifyPage,
        }),
      },
      ...['/forgot-password', '/reset-password'].map((path) => ({
        path,
        lazy: async () => ({
          Component: (await import('@/features/auth/UnavailableRecoveryPage'))
            .UnavailableRecoveryPage,
        }),
      })),
    ],
  },
  {
    path: '/access-denied',
    lazy: async () => ({
      Component: (await import('@/features/auth/AccessDeniedPage'))
        .AccessDeniedPage,
    }),
    errorElement: <RouteErrorPage />,
  },
  {
    element: <RequireRole role="customer" />,
    children: storefrontRoutes,
    errorElement: <RouteErrorPage />,
  },
  {
    element: <RequireRole role="designer" />,
    children: designerRoutes,
    errorElement: <RouteErrorPage />,
  },
  {
    element: <RequireRole role="admin" />,
    children: adminRoutes,
    errorElement: <RouteErrorPage />,
  },
  {
    path: '/',
    HydrateFallback: LoadingPage,
    lazy: async () => {
      const { FoundationPage } =
        await import('@/apps/storefront/pages/FoundationPage');
      return { Component: FoundationPage };
    },
    errorElement: <RouteErrorPage />,
  },
  {
    path: '*',
    HydrateFallback: LoadingPage,
    lazy: async () => {
      const { NotFoundPage } =
        await import('@/shared/components/feedback/NotFoundPage');
      return { Component: NotFoundPage };
    },
    errorElement: <RouteErrorPage />,
  },
];

export function createAppRouter() {
  return createBrowserRouter(routes);
}
