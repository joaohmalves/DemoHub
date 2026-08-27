import { users } from '../data/users';
import { supabase } from './supabaseClient';

const SESSION_KEY = 'cognigy-demo-hub:session';

export interface Session {
  username: string;
  displayName: string;
  accessToken: string;
}

function emailForUsername(username: string): string | null {
  const match = users.find((u) => u.username === username);
  return match ? `${username}@demo.internal` : null;
}

function displayNameForUsername(username: string): string {
  const match = users.find((u) => u.username === username);
  return match?.displayName ?? username;
}

// sessionStorage (not localStorage) is deliberate: the session should not survive
// closing the tab, which fits a shared/projected demo machine where the next
// presenter should not inherit the previous one's login. See spec section 11.
export async function login(username: string, password: string): Promise<Session | null> {
  const email = emailForUsername(username);
  if (!email) return null;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.session) {
    return null;
  }

  const session: Session = {
    username,
    displayName: displayNameForUsername(username),
    accessToken: data.session.access_token,
  };

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut();
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