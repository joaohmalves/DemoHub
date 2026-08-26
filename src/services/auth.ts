import { users } from '../data/users';

const SESSION_KEY = 'cognigy-demo-hub:session';

export interface Session {
  username: string;
  displayName: string;
}

// sessionStorage (not localStorage) is deliberate: the session should not survive
// closing the tab, which fits a shared/projected demo machine where the next
// presenter should not inherit the previous one's login. See spec section 11.
export function login(username: string, password: string): Session | null {
  const match = users.find((u) => u.username === username && u.password === password);
  if (!match) return null;

  const session: Session = { username: match.username, displayName: match.displayName };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function logout(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export function getSession(): Session | null {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}
