import { Navigate, type RouteObject } from 'react-router-dom';
export const designerRoutes: RouteObject[] = [
  {
    path: '/designer',
    lazy: async () => ({
      Component: (await import('./layouts/DesignerLayout')).DesignerLayout,
    }),
    children: [
      { index: true, element: <Navigate replace to="dashboard" /> },
      {
        path: 'dashboard',
        lazy: async () => ({
          Component: (await import('./pages/DesignerOverviewPage'))
            .DesignerOverviewPage,
        }),
      },
    ],
  },
];
