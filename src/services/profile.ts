import { supabase } from './supabaseClient';

const API_URL = import.meta.env.VITE_API_URL as string;

async function getAccessToken() {
  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session) {
    throw new Error('Sessão não encontrada. Faça login novamente.');
  }

  return data.session.access_token;
}

async function credentialsFetch(path: string, body: unknown) {
  const accessToken = await getAccessToken();

  const response = await fetch(`${API_URL}${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.error ?? `Erro ${response.status}`);
  }

  return data;
}

export function changePassword(currentPassword: string, newPassword: string) {
  return credentialsFetch('/api/auth/password', { currentPassword, newPassword });
}

export function changeEmail(currentPassword: string, newEmail: string) {
  return credentialsFetch('/api/auth/email', { currentPassword, newEmail });
}