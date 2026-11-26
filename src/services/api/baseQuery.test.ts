import { afterEach, describe, expect, it, vi } from 'vitest';
import { createConfiguredBaseQuery } from '@/services/api/baseQuery';

const controller = new AbortController();
const context = {
  signal: controller.signal,
  abort: () => controller.abort(),
  dispatch: vi.fn(),
  getState: () => ({}),
  extra: undefined,
  endpoint: 'transportTest',
  type: 'query' as const,
};

afterEach(() => vi.unstubAllGlobals());

describe('central API transport', () => {
  it('sends the documented security header and cookies on mutations', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValue(
        new Response('{}', { headers: { 'Content-Type': 'application/json' } }),
      );
    vi.stubGlobal('fetch', fetch);
    await createConfiguredBaseQuery({
      status: 'configured',
      baseUrl: 'https://example.test/api/',
    })(
      { url: 'auth/logout', method: 'POST', body: {} },
      { ...context, type: 'mutation' },
      {},
    );
    const request = fetch.mock.calls[0]?.[0] as Request;
    expect(request.credentials).toBe('include');
    expect(request.headers.get('X-MYGARB-Request')).toBe('1');
    expect(request.headers.get('Content-Type')).toBe('application/json');
  });
  it.each(['unconfigured', 'invalid'] as const)(
    'never fetches with %s configuration',
    async (status) => {
      const fetch = vi.fn();
      vi.stubGlobal('fetch', fetch);
      const result = await createConfiguredBaseQuery({ status })(
        'test',
        context,
        {},
      );
      expect(result.error).toMatchObject({ status: 'CUSTOM_ERROR' });
      expect(fetch).not.toHaveBeenCalled();
    },
  );

  it.each([
    'https://other.test/test',
    '//other.test/test',
    '/test',
    '../test',
    '%2e%2e/test',
    '%252e%252e/test',
    'bad%zz',
  ])('rejects an endpoint that escapes the base: %s', async (url) => {
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    const result = await createConfiguredBaseQuery({
      status: 'configured',
      baseUrl: 'https://example.test/api/',
    })(url, context, {});
    expect(result.error).toMatchObject({ status: 'CUSTOM_ERROR' });
    expect(fetch).not.toHaveBeenCalled();
  });

  it('uses the configured URL and returns real response data', async () => {
    const fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ value: 'transport fixture' }), {
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetch);
    const result = await createConfiguredBaseQuery({
      status: 'configured',
      baseUrl: 'https://example.test/api/',
    })({ url: 'test', params: { page: 2 } }, context, {});
    expect(result.data).toEqual({ value: 'transport fixture' });
    const request = fetch.mock.calls[0]?.[0] as Request;
    expect(request.url).toBe('https://example.test/api/test?page=2');
    expect(request.credentials).toBe('include');
  });

  it('preserves HTTP failures without silently returning fixtures', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'Unavailable' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );
    const result = await createConfiguredBaseQuery({
      status: 'configured',
      baseUrl: 'https://example.test/api/',
    })('test', context, {});
    expect(result.error).toMatchObject({ status: 503 });
    expect(result.data).toBeUndefined();
  });

  it('returns network failures as errors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new TypeError('Network unavailable')),
    );
    const result = await createConfiguredBaseQuery({
      status: 'configured',
      baseUrl: 'https://example.test/api/',
    })('test', context, {});
    expect(result.error).toMatchObject({ status: 'FETCH_ERROR' });
    expect(result.data).toBeUndefined();
  });
});
