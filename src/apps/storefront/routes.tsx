import type { RouteObject } from 'react-router-dom';
export const storefrontRoutes: RouteObject[] = [
  {
    path: '/account',
    lazy: async () => ({
      Component: (await import('./layouts/StorefrontLayout')).StorefrontLayout,
    }),
    children: [
      {
        path: 'profile',
        lazy: async () => ({
          Component: (await import('./pages/CustomerProfilePage'))
            .CustomerProfilePage,
        }),
      },
      {
        path: 'measurements',
        lazy: async () => ({
          Component: (await import('./pages/MeasurementsPage'))
            .MeasurementsPage,
        }),
      },
      {
        path: 'requests',
        lazy: async () => ({
          Component: (await import('./pages/RequestsAndOrdersPage'))
            .RequestsAndOrdersPage,
        }),
      },
      {
        path: 'requests/:id',
        lazy: async () => {
          const { RecordDetailPage } = await import('./pages/RecordDetailPage');
          return { element: <RecordDetailPage kind="request" /> };
        },
      },
      {
        path: 'orders/:id',
        lazy: async () => {
          const { RecordDetailPage } = await import('./pages/RecordDetailPage');
          return { element: <RecordDetailPage kind="order" /> };
        },
      },
      {
        path: 'messages',
        lazy: async () => ({
          Component: (await import('./pages/ConversationsPage'))
            .ConversationsPage,
        }),
      },
      {
        path: 'messages/:id',
        lazy: async () => ({
          Component: (await import('./pages/ConversationPage'))
            .ConversationPage,
        }),
      },
      {
        path: 'notifications',
        lazy: async () => ({
          Component: (await import('./pages/NotificationsPage'))
            .NotificationsPage,
        }),
      },
      {
        index: true,
        lazy: async () => ({
          Component: (await import('./pages/AccountPage')).AccountPage,
        }),
      },
    ],
  },
];
