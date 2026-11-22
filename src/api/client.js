/**
 * The ONE axios instance the whole app uses to talk to the API.
 * Feature modules (users, kyc, compliance...) should import `api` from here
 * instead of using axios directly, so they all get the same auth and error handling.
 */
import axios from 'axios';
import { env } from '@/config/env';
import { loadSession } from '@/auth/sessionStore';

export const api = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.requestTimeoutMs,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Attach the Bearer token to every request when the admin is signed in.
api.interceptors.request.use((config) => {
  const session = loadSession();
  if (session) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

// The AuthProvider registers what should happen when the API says "401 Unauthorized"
// (token expired or revoked): clear the session and send the admin to the login page.
let handleUnauthorized = null;

export function setUnauthorizedHandler(handler) {
  handleUnauthorized = handler;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Login/2FA requests return 401 for wrong credentials; those are handled by the form,
    // so they opt out with `skipAuthRedirect: true`.
    const isUnauthorized = error.response?.status === 401;
    if (isUnauthorized && !error.config?.skipAuthRedirect && handleUnauthorized) {
      handleUnauthorized();
    }
    return Promise.reject(error);
  },
);

// Friendly messages for the API's known error codes (response body `code`).
const ERROR_CODE_MESSAGES = {
  exceeds_own_access: "You can't give a role with permissions you don't have yourself.",
  own_account: "You can't do this to your own account.",
  system_role: "The super admin role is built in and can't be changed.",
};

/**
 * Turns any API error into a short, safe message for the UI.
 * We never show raw server errors, stack traces or long messages.
 */
export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error.response) {
    return error.code === 'ECONNABORTED'
      ? 'The request took too long. Please try again.'
      : 'Unable to reach the server. Please check your connection.';
  }

  const { status, data } = error.response;

  if (ERROR_CODE_MESSAGES[data?.code]) return ERROR_CODE_MESSAGES[data.code];
  if (status === 403 && !data?.message) return "You don't have permission to do this.";
  if (status === 429) return 'Too many attempts. Please wait a moment and try again.';
  if (status >= 500) return fallback;

  const message = data?.message;
  return typeof message === 'string' && message.length <= 200 ? message : fallback;
}

/** Laravel validation errors ({ errors: { field: ['msg'] } }) as { field: 'msg' }. */
export function getFieldErrors(error) {
  const errors = error.response?.status === 422 ? error.response.data?.errors : null;
  if (!errors) return {};

  return Object.fromEntries(
    Object.entries(errors).map(([field, messages]) => [field, [].concat(messages)[0]]),
  );
}
