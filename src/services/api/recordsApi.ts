import { z } from 'zod';
import { baseApi } from './baseApi';
import {
  requestSummary,
  orderSummary,
  requestDetail,
  orderDetail,
  pagination,
  conversationSchema,
  messageSchema,
  notificationSchema,
} from '@/apps/storefront/features/records/model';
const requests = z.object({ requests: z.array(requestSummary), ...pagination });
const orders = z.object({ orders: z.array(orderSummary), ...pagination });
const notifications = z.object({
  notifications: z.array(notificationSchema),
  deliveryPending: z.boolean(),
  ...pagination,
});
function unwrap<T extends z.ZodType>(schema: T, value: unknown): z.infer<T> {
  const envelope = z
    .object({ success: z.literal(true), data: z.unknown() })
    .parse(value);
  return schema.parse(envelope.data);
}
type ListInput = { page: number; status?: string };
export const recordsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    recoverConfirmedOrder: builder.mutation<
      z.infer<typeof orderDetail>,
      string
    >({
      query: (id) => ({
        url: 'requests/' + id + '/confirm',
        method: 'PATCH',
        body: {},
      }),
      transformResponse: (value: unknown) =>
        unwrap(z.object({ order: orderDetail }), value).order,
      invalidatesTags: ['Request', 'Order'],
    }),
    requests: builder.query<z.infer<typeof requests>, ListInput>({
      query: (params) => ({
        url: 'requests',
        params: { ...params, limit: 20 },
      }),
      transformResponse: (value: unknown) => unwrap(requests, value),
      providesTags: ['Request'],
      keepUnusedDataFor: 0,
    }),
    orders: builder.query<z.infer<typeof orders>, ListInput>({
      query: (params) => ({ url: 'orders', params: { ...params, limit: 20 } }),
      transformResponse: (value: unknown) => unwrap(orders, value),
      providesTags: ['Order'],
      keepUnusedDataFor: 0,
    }),
    requestDetail: builder.query<z.infer<typeof requestDetail>, string>({
      query: (id) => 'requests/' + id,
      transformResponse: (value: unknown) =>
        unwrap(z.object({ request: requestDetail }), value).request,
      providesTags: ['Request'],
      keepUnusedDataFor: 0,
    }),
    orderDetail: builder.query<z.infer<typeof orderDetail>, string>({
      query: (id) => 'orders/' + id,
      transformResponse: (value: unknown) =>
        unwrap(z.object({ order: orderDetail }), value).order,
      providesTags: ['Order'],
      keepUnusedDataFor: 0,
    }),
    conversation: builder.query<
      z.infer<typeof conversationSchema>,
      { id: string; page: number }
    >({
      query: ({ id, page }) => ({
        url: 'requests/' + id + '/messages',
        params: { page, limit: 20 },
      }),
      transformResponse: (value: unknown) => unwrap(conversationSchema, value),
      providesTags: (_result, _error, arg) => [
        { type: 'Conversation', id: arg.id },
      ],
      keepUnusedDataFor: 0,
    }),
    sendMessage: builder.mutation<
      z.infer<typeof messageSchema>,
      { id: string; text: string }
    >({
      query: ({ id, text }) => ({
        url: 'requests/' + id + '/messages',
        method: 'POST',
        body: { text },
      }),
      transformResponse: (value: unknown) =>
        unwrap(z.object({ message: messageSchema }), value).message,
      invalidatesTags: (_result, _error, arg) => [
        { type: 'Conversation', id: arg.id },
      ],
    }),
    notifications: builder.query<z.infer<typeof notifications>, number>({
      query: (page) => ({ url: 'notifications', params: { page, limit: 20 } }),
      transformResponse: (value: unknown) => unwrap(notifications, value),
      providesTags: ['Notification'],
      keepUnusedDataFor: 0,
    }),
    readNotification: builder.mutation<void, string>({
      query: (id) => ({
        url: 'notifications/' + id + '/read',
        method: 'PATCH',
        body: {},
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});
export const {
  useRecoverConfirmedOrderMutation,
  useRequestsQuery,
  useOrdersQuery,
  useRequestDetailQuery,
  useOrderDetailQuery,
  useConversationQuery,
  useSendMessageMutation,
  useNotificationsQuery,
  useReadNotificationMutation,
} = recordsApi;
