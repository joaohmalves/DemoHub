import { supabase } from './supabaseClient';

const SESSION_KEY = 'cognigy-demo-hub:session';

export interface Session {
  username: string;
  displayName: string;
  accessToken: string;
}

export async function login(
  username: string,
  password: string,
): Promise<Session | null> {

  const email = `${username}@demo.internal`;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session || !data.user) {
    console.error('[Auth] Login failed:', error);
    return null;
  }

  const session: Session = {
    username,
    displayName:
      data.user.user_metadata?.displayName ?? username,
    accessToken: data.session.access_token,
  };

  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify(session),
  );

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