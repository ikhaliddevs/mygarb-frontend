import { z } from 'zod';
import { baseApi } from './baseApi';
import {
  profileSchema,
  measurementsSchema,
  type ProfileInput,
  type MeasurementInput,
} from '@/apps/storefront/features/account/model';
const profileResponse = z.object({
  success: z.literal(true),
  data: z.object({ profile: profileSchema }),
});
const measurementResponse = z.object({
  success: z.literal(true),
  data: z.object({ measurements: measurementsSchema.nullable() }),
});
export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    customerProfile: builder.query<z.infer<typeof profileSchema>, void>({
      query: () => 'profile',
      transformResponse: (value: unknown) =>
        profileResponse.parse(value).data.profile,
      providesTags: ['Session'],
      keepUnusedDataFor: 0,
    }),
    updateCustomerProfile: builder.mutation<
      z.infer<typeof profileSchema>,
      ProfileInput
    >({
      query: (body) => ({ url: 'profile', method: 'PATCH', body }),
      transformResponse: (value: unknown) =>
        profileResponse.parse(value).data.profile,
      invalidatesTags: ['Session'],
    }),
    measurements: builder.query<
      z.infer<typeof measurementsSchema> | null,
      void
    >({
      query: () => 'measurements',
      transformResponse: (value: unknown) =>
        measurementResponse.parse(value).data.measurements,
      providesTags: ['Measurement'],
      keepUnusedDataFor: 0,
    }),
    saveMeasurements: builder.mutation<
      z.infer<typeof measurementsSchema> | null,
      MeasurementInput
    >({
      query: (body) => ({ url: 'measurements', method: 'PUT', body }),
      transformResponse: (value: unknown) =>
        measurementResponse.parse(value).data.measurements,
      invalidatesTags: ['Measurement'],
    }),
  }),
});
export const {
  useCustomerProfileQuery,
  useUpdateCustomerProfileMutation,
  useMeasurementsQuery,
  useSaveMeasurementsMutation,
} = customerApi;
