/**
 * The API's password rules, so we can show them as a live checklist while the person types.
 * Keep these in step with the backend. The API checks them again anyway.
 */
export const PASSWORD_RULES = [
  { id: 'length', label: 'At least 12 characters', test: (pw) => pw.length >= 12 },
  { id: 'upper', label: 'An uppercase letter (A–Z)', test: (pw) => /[A-Z]/.test(pw) },
  { id: 'lower', label: 'A lowercase letter (a–z)', test: (pw) => /[a-z]/.test(pw) },
  { id: 'number', label: 'A number (0–9)', test: (pw) => /\d/.test(pw) },
  { id: 'symbol', label: 'A symbol (e.g. ! @ # $ %)', test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

export const meetsPasswordRules = (password) => PASSWORD_RULES.every((rule) => rule.test(password));