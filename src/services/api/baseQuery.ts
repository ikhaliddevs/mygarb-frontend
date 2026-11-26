import {
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { ApiConfiguration } from '@/shared/config/environment';

/** No implicit same-origin API fallback and no simulated response on failure. */
export function createConfiguredBaseQuery(
  configuration: ApiConfiguration,
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> {
  if (configuration.status !== 'configured') {
    return () => ({
      error: {
        status: 'CUSTOM_ERROR',
        error:
          configuration.status === 'invalid'
            ? 'API configuration is invalid.'
            : 'API integration is not configured.',
      },
    });
  }

  const query = fetchBaseQuery({
    baseUrl: configuration.baseUrl,
    // The v0.7.0 backend owns the HttpOnly session cookie.
    credentials: 'include',
    prepareHeaders: (headers, { type }) => {
      if (type === 'mutation') headers.set('X-MYGARB-Request', '1');
      return headers;
    },
    timeout: 15000,
  });

  return (args, api, extraOptions) => {
    const path = typeof args === 'string' ? args : args.url;
    // Endpoint modules must stay within the configured base path.
    const pathname = path.split('?')[0] ?? '';
    let decoded: string;
    try {
      decoded = decodeURIComponent(pathname);
    } catch {
      return {
        error: { status: 'CUSTOM_ERROR', error: 'Invalid API endpoint path.' },
      };
    }
    if (
      !decoded ||
      decoded.startsWith('/') ||
      /[:\\#%]/.test(decoded) ||
      decoded.split('/').includes('..')
    ) {
      return {
        error: {
          status: 'CUSTOM_ERROR',
          error:
            'API endpoints must use relative paths within the configured base URL.',
        },
      };
    }
    return query(args, api, extraOptions);
  };
}
