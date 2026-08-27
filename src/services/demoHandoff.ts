import { getSession } from './auth';

const API_URL = import.meta.env.VITE_API_URL as string;

export type DemoType = 'chat' | 'voice' | 'multimodal';

export async function buildDemoUrl(
  baseUrl: string,
  type: DemoType,
): Promise<string> {
  const session = getSession();

  if (!session) {
    throw new Error('SESSION_EXPIRED');
  }

  // Apenas demos multimodais precisam do handoff autenticado.
  if (type !== 'multimodal') {
    return baseUrl;
  }

  const res = await fetch(`${API_URL}/api/auth/exchange-code`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (res.status === 401) {
    throw new Error('SESSION_EXPIRED');
  }

  if (!res.ok) {
    throw new Error('GENERIC_ERROR');
  }

  const { code } = await res.json();

  const url = new URL(baseUrl);
  url.searchParams.set('code', code);

  return url.toString();
}