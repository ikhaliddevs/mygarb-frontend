import { createApi } from '@reduxjs/toolkit/query/react';
import { apiConfiguration } from '@/shared/config/environment';
import { createConfiguredBaseQuery } from '@/services/api/baseQuery';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: createConfiguredBaseQuery(apiConfiguration),
  tagTypes: [
    'Session',
    'Designer',
    'Portfolio',
    'Measurement',
    'Request',
    'Specification',
    'Order',
    'Conversation',
    'Notification',
    'Review',
    'Issue',
    'Audit',
  ],
  // Inject feature endpoints only when their contracts have been supplied.
  endpoints: () => ({}),
});
