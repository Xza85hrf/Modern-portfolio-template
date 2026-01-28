/**
 * Authenticated fetch wrapper for API calls
 *
 * Automatically adds Authorization header for authenticated requests
 * and handles 401 responses by clearing auth state
 */

type FetchOptions = RequestInit & {
  requiresAuth?: boolean;
};

/**
 * Make an API request with automatic auth handling
 */
export async function apiFetch<T = unknown>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const { requiresAuth = false, headers = {}, ...restOptions } = options;

  const token = localStorage.getItem('auth_token');

  // Build headers
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  // Add auth header if we have a token
  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  } else if (requiresAuth) {
    // If auth is required but no token, redirect to login
    window.location.href = '/admin/login';
    throw new Error('Authentication required');
  }

  const response = await fetch(url, {
    ...restOptions,
    headers: requestHeaders,
  });

  // Handle 401 - clear auth and redirect
  if (response.status === 401) {
    localStorage.removeItem('auth_token');
    window.location.href = '/admin/login';
    throw new Error('Session expired');
  }

  // Handle other errors
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return response.json();
}

/**
 * Helper for GET requests
 */
export function apiGet<T = unknown>(url: string, requiresAuth = false): Promise<T> {
  return apiFetch<T>(url, { method: 'GET', requiresAuth });
}

/**
 * Helper for POST requests
 */
export function apiPost<T = unknown>(url: string, data: unknown, requiresAuth = true): Promise<T> {
  return apiFetch<T>(url, {
    method: 'POST',
    body: JSON.stringify(data),
    requiresAuth,
  });
}

/**
 * Helper for PUT requests
 */
export function apiPut<T = unknown>(url: string, data: unknown, requiresAuth = true): Promise<T> {
  return apiFetch<T>(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    requiresAuth,
  });
}

/**
 * Helper for DELETE requests
 */
export function apiDelete<T = unknown>(url: string, requiresAuth = true): Promise<T> {
  return apiFetch<T>(url, { method: 'DELETE', requiresAuth });
}
