import { describe, expect, it } from 'vitest';
import {
  registerSchema,
  passwordSchema,
  verifySchema,
  safeReturn,
  authPath,
} from './model';
describe('authentication boundaries', () => {
  it('never permits public administrator registration', () => {
    expect(
      registerSchema.safeParse({
        name: 'Test',
        email: 'test@example.test',
        password: 'test-password',
        role: 'admin',
      }).success,
    ).toBe(false);
  });
  it('checks Unicode code points and UTF-8 bytes without trimming passwords', () => {
    expect(passwordSchema.safeParse('😀'.repeat(8)).success).toBe(true);
    expect(passwordSchema.safeParse('😀'.repeat(19)).success).toBe(false);
    expect(passwordSchema.safeParse('abcd\0efgh').success).toBe(false);
    expect(passwordSchema.parse('  abcdefgh  ')).toBe('  abcdefgh  ');
  });
  it('requires six digits including leading zeros', () => {
    expect(
      verifySchema.safeParse({ email: 'test@example.test', otp: '000123' })
        .success,
    ).toBe(true);
    expect(
      verifySchema.safeParse({ email: 'test@example.test', otp: '12345a' })
        .success,
    ).toBe(false);
  });
  it.each([
    'https://evil.test',
    '//evil.test',
    '/account/%2e%2e/admin',
    '/admin/dashboard',
    '/account\\evil',
    '/account/../admin/dashboard',
    '/account/./profile',
  ])('rejects unsafe or wrong-role return destinations: %s', (value) => {
    expect(safeReturn(value, 'customer')).toBe('/account');
  });
  it('preserves an internal role-specific destination', () =>
    expect(safeReturn('/designer/dashboard?tab=overview', 'designer')).toBe(
      '/designer/dashboard?tab=overview',
    ));
  it('carries the destination as a query value, never as the auth link target', () => {
    const link = authPath('/register', '/account?tab=requests&sort=new');
    const url = new URL(link, 'https://example.test');
    expect(url.pathname).toBe('/register');
    expect(url.searchParams.get('returnTo')).toBe(
      '/account?tab=requests&sort=new',
    );
    expect(authPath('/login', null)).toBe('/login');
  });
});
