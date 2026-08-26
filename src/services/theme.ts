const THEME_KEY = 'cognigy-demo-hub:theme';
export type Theme = 'dark' | 'light';

// Persisted in localStorage (not sessionStorage): a display preference like theme
// should survive across tabs/sessions, unlike the login session which is
// deliberately tab-scoped (see services/auth.ts).
export function getStoredTheme(): Theme {
  const stored = localStorage.getItem(THEME_KEY);
  return stored === 'light' ? 'light' : 'dark';
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}
