import { z } from 'zod';

export const roleSchema = z.enum(['customer', 'designer', 'admin']);
export type Role = z.infer<typeof roleSchema>;
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: roleSchema,
  status: z.enum(['active', 'suspended']),
});
export type User = z.infer<typeof userSchema>;
export const emailSchema = z
  .string()
  .trim()
  .email('Enter a valid email address.')
  .max(254);
export const passwordSchema = z
  .string()
  .refine(
    (value) =>
      [...value].length >= 8 &&
      new TextEncoder().encode(value).length <= 72 &&
      !value.includes('\0'),
    'Use at least 8 characters and at most 72 UTF-8 bytes, without null characters.',
  );
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export const registerSchema = loginSchema.extend({
  name: z.string().trim().min(1, 'Enter your name.').max(100),
  role: z.enum(['customer', 'designer']),
});
export const verifySchema = z.object({
  email: emailSchema,
  otp: z.string().regex(/^\d{6}$/, 'Enter the six-digit code.'),
});
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type VerifyInput = z.infer<typeof verifySchema>;
export const homeFor = (role: Role) =>
  role === 'customer' ? '/account' : '/' + role + '/dashboard';

/** Never send a login return destination outside the current application. */
export function safeReturn(value: string | null, role: Role) {
  if (
    !value ||
    !value.startsWith('/') ||
    value.startsWith('//') ||
    /[\\%]/.test(value) ||
    [...value].some((char) => char.charCodeAt(0) <= 32)
  )
    return homeFor(role);
  const path = value.split(/[?#]/)[0] ?? '';
  if (path.split('/').some((segment) => segment === '.' || segment === '..'))
    return homeFor(role);
  const prefix = role === 'customer' ? '/account' : '/' + role;
  return path === prefix || path.startsWith(prefix + '/')
    ? value
    : homeFor(role);
}

/** Carry only the return destination between auth pages; validate it at login. */
export function authPath(
  path: '/login' | '/register' | '/verify-email' | '/forgot-password',
  returnTo: string | null,
) {
  return returnTo
    ? `${path}?${new URLSearchParams({ returnTo }).toString()}`
    : path;
}
export function authError(error: unknown): string {
  const parsed = z
    .object({ data: z.object({ error: z.object({ code: z.string() }) }) })
    .safeParse(error);
  const code = parsed.success ? parsed.data.data.error.code : '';
  const messages: Record<string, string> = {
    INVALID_CREDENTIALS:
      'Unable to sign in. Check your email and password, and verify your email before trying again.',
    VERIFICATION_FAILED:
      'Unable to verify this email. Check the code or request another.',
    AUTH_RATE_LIMITED: 'Too many attempts. Please wait before trying again.',
    RATE_LIMITED: 'Too many requests. Please wait before trying again.',
    INVALID_INPUT: 'Check your details and try again.',
    CSRF_REJECTED: 'This application origin is not authorized by the server.',
    UNAUTHENTICATED: 'Your session has ended. Please sign in again.',
    FORBIDDEN: 'You do not have access to this action.',
  };
  return (
    messages[code] ??
    'Unable to connect or complete this action. Please try again.'
  );
}
