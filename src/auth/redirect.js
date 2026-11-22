const DEFAULT_PATH = '/dashboard';

/**
 * Only allow redirects to pages inside this app.
 * Stops "open redirect" tricks like ?redirectTo=https://evil.com or //evil.com
 */
export function getSafeRedirect(path) {
  const isInternalPath =
    typeof path === 'string' &&
    path.startsWith('/') &&
    !path.startsWith('//') &&
    !path.includes('\\') &&
    !path.startsWith('/auth');

  return isInternalPath ? path : DEFAULT_PATH;
}
