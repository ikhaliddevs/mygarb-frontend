import { describe, expect, it } from 'vitest';
import { parseApiConfiguration } from '@/shared/config/environment';

describe('API environment configuration', () => {
  it.each([undefined, '', '   '])(
    'leaves an absent base URL unconfigured: %s',
    (value) => {
      expect(parseApiConfiguration(value)).toEqual({ status: 'unconfigured' });
    },
  );
  it.each([
    '/api',
    '/api/',
    'https://example.test/api',
    'http://localhost:3000/api',
  ])('normalizes a trusted base URL: %s', (value) => {
    expect(parseApiConfiguration(value)).toEqual({
      status: 'configured',
      baseUrl: value.endsWith('/') ? value : `${value}/`,
    });
  });
  it.each([
    'api',
    '//evil.test',
    '/\\evil.test',
    'javascript:alert(1)',
    'ftp://example.test',
    'https://user:secret@example.test',
    '/api?token=secret',
    '/api#fragment',
  ])('rejects invalid configuration: %s', (value) => {
    expect(parseApiConfiguration(value)).toEqual({ status: 'invalid' });
  });
});
