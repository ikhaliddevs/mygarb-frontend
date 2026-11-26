export type ApiConfiguration =
  | { status: 'configured'; baseUrl: string }
  | { status: 'unconfigured' }
  | { status: 'invalid' };

/** Configuration is public build-time data. Never put secrets in VITE_* variables. */
export function parseApiConfiguration(
  value: string | undefined,
): ApiConfiguration {
  const input = value?.trim();
  if (!input) return { status: 'unconfigured' };
  // Reject protocol-relative URLs, backslashes, query strings and fragments.
  if (/[\\?#]/.test(input) || input.startsWith('//'))
    return { status: 'invalid' };
  if (input.startsWith('/')) {
    return {
      status: 'configured',
      baseUrl: input.endsWith('/') ? input : `${input}/`,
    };
  }
  try {
    const url = new URL(input);
    if (
      !['http:', 'https:'].includes(url.protocol) ||
      url.username ||
      url.password
    ) {
      return { status: 'invalid' };
    }
    return {
      status: 'configured',
      baseUrl: input.endsWith('/') ? input : `${input}/`,
    };
  } catch {
    return { status: 'invalid' };
  }
}

export const apiConfiguration = parseApiConfiguration(
  import.meta.env.VITE_API_BASE_URL,
);
