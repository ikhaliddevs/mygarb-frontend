import { Navigate, type RouteObject } from 'react-router-dom';
export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    lazy: async () => ({
      Component: (await import('./layouts/AdminLayout')).AdminLayout,
    }),
    children: [
      { index: true, element: <Navigate replace to="dashboard" /> },
      {
        path: 'dashboard',
        lazy: async () => ({
          Component: (await import('./pages/AdminOverviewPage'))
            .AdminOverviewPage,
        }),
      },
    ],
  },
];
