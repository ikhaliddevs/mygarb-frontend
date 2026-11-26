import { z } from 'zod';
import { idSchema } from '../account/model';
const common = {
  id: idSchema,
  outfitType: z.string(),
  quantity: z.number(),
  currency: z.literal('NGN'),
  createdAt: z.string(),
};
export const requestStatus = z.enum([
  'submitted',
  'accepted',
  'declined',
  'cancelled',
  'confirmed',
]);
export const orderStatus = z.enum([
  'confirmed',
  'in_progress',
  'ready',
  'completed',
]);
export const requestSummary = z.object({
  ...common,
  status: requestStatus,
  desiredCompletionDate: z.string(),
  budgetAmount: z.string(),
  orderId: idSchema.optional(),
  proposal: z
    .object({ priceAmount: z.string(), completionDate: z.string() })
    .optional(),
});
export const orderSummary = z.object({
  ...common,
  requestId: idSchema,
  status: orderStatus,
  completionDate: z.string(),
  priceAmount: z.string(),
});
export const snapshot = z.object({
  unit: z.enum(['cm', 'in']),
  values: z.array(z.object({ label: z.string(), value: z.number() })),
  capturedAt: z.string(),
});
export const requestDetail = requestSummary.extend({
  description: z.string(),
  referenceImageUrls: z.array(z.string()),
  measurementSnapshot: snapshot,
  responseText: z.string().nullable(),
  orderPending: z.boolean().optional(),
});
export const orderDetail = orderSummary.extend({
  description: z.string(),
  referenceImageUrls: z.array(z.string()),
  measurementSnapshot: snapshot,
  effectiveMeasurements: snapshot,
  history: z.array(z.object({ status: orderStatus, at: z.string() })),
});
export const pagination = {
  page: z.number().int(),
  limit: z.number().int(),
  hasMore: z.boolean(),
};
export const messageSchema = z.object({
  id: idSchema,
  actorId: idSchema,
  text: z.string(),
  kind: z.enum(['text', 'proposal', 'consent', 'withdrawal']),
  version: z.number().nullable(),
  at: z.string(),
});
export const conversationSchema = z.object({
  requestId: idSchema,
  orderId: idSchema.nullable(),
  messages: z.array(messageSchema),
  ...pagination,
});
export const notificationSchema = z.object({
  id: idSchema,
  type: z.enum([
    'new_request',
    'accepted',
    'declined',
    'confirmed',
    'new_message',
    'order_in_progress',
    'order_ready',
    'order_completed',
  ]),
  requestId: idSchema,
  orderId: idSchema.nullable(),
  at: z.string(),
  readAt: z.string().nullable(),
});
export const messageInput = z.object({
  text: z
    .string()
    .trim()
    .min(1, 'Write a message.')
    .max(2000)
    .refine(
      (value) =>
        [...value].every((char) => {
          const code = char.charCodeAt(0);
          return (code >= 32 && code !== 127) || code === 10 || code === 9;
        }),
      'Use plain text without control characters.',
    ),
});
export function pageNumber(value: string | null) {
  const number = Number(value);
  return Number.isInteger(number) && number >= 1 && number <= 1000 ? number : 1;
}
export function statusLabel(value: string) {
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
export function money(value: string) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(Number(value));
}
