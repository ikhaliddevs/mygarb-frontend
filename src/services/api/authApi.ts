import { z } from 'zod';
import { baseApi } from './baseApi';
import {
  userSchema,
  type User,
  type LoginInput,
  type RegisterInput,
  type VerifyInput,
} from '@/features/auth/model';

const userResponse = z.object({
  success: z.literal(true),
  data: z.object({ user: userSchema }),
});
const messageResponse = z.object({
  success: z.literal(true),
  data: z.object({ message: z.string() }),
});
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    session: builder.query<User, void>({
      query: () => 'auth/me',
      transformResponse: (value: unknown) =>
        userResponse.parse(value).data.user,
      providesTags: ['Session'],
      keepUnusedDataFor: 0,
    }),
    login: builder.mutation<User, LoginInput>({
      query: (body) => ({ url: 'auth/login', method: 'POST', body }),
      transformResponse: (value: unknown) =>
        userResponse.parse(value).data.user,
    }),
    register: builder.mutation<string, RegisterInput>({
      query: (body) => ({ url: 'auth/register', method: 'POST', body }),
      transformResponse: (value: unknown) =>
        messageResponse.parse(value).data.message,
    }),
    verify: builder.mutation<boolean, VerifyInput>({
      query: (body) => ({ url: 'auth/verify-email', method: 'POST', body }),
      transformResponse: (value: unknown) =>
        z
          .object({
            success: z.literal(true),
            data: z.object({ emailVerified: z.literal(true) }),
          })
          .parse(value).data.emailVerified,
    }),
    resend: builder.mutation<string, { email: string }>({
      query: (body) => ({
        url: 'auth/resend-verification',
        method: 'POST',
        body,
      }),
      transformResponse: (value: unknown) =>
        messageResponse.parse(value).data.message,
    }),
    logout: builder.mutation<string, void>({
      query: () => ({ url: 'auth/logout', method: 'POST', body: {} }),
      transformResponse: (value: unknown) =>
        messageResponse.parse(value).data.message,
    }),
  }),
});
export const {
  useSessionQuery,
  useLoginMutation,
  useRegisterMutation,
  useVerifyMutation,
  useResendMutation,
  useLogoutMutation,
} = authApi;
