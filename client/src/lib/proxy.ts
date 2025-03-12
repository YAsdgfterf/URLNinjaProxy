/**
 * Helper functions for working with the proxy service
 */

/**
 * Creates a proxy URL from a target URL
 */
export function createProxyUrl(targetUrl: string): string {
  return `/api/proxy/serve?url=${encodeURIComponent(targetUrl)}`;
}

/**
 * Validates if a URL is in a format that can be proxied
 */
export function isValidProxyUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Extracts the original URL from a proxy URL
 */
export function extractOriginalUrl(proxyUrl: string): string | null {
  try {
    const url = new URL(proxyUrl);
    const originalUrl = url.searchParams.get('url');
    return originalUrl ? decodeURIComponent(originalUrl) : null;
  } catch {
    return null;
  }
}

/**
 * Error messages for proxy-related operations
 */
export const ProxyErrors = {
  INVALID_URL: "Please enter a valid HTTP or HTTPS URL",
  NETWORK_ERROR: "Failed to connect to the proxy service",
  SERVER_ERROR: "The proxy service encountered an error",
  UNSUPPORTED_PROTOCOL: "Only HTTP and HTTPS URLs are supported"
} as const;

/**
 * Type for proxy service errors
 */
export type ProxyError = {
  code: keyof typeof ProxyErrors;
  message: string;
  details?: string;
};

/**
 * Creates a standardized proxy error object
 */
export function createProxyError(code: keyof typeof ProxyErrors, details?: string): ProxyError {
  return {
    code,
    message: ProxyErrors[code],
    details
  };
}
