import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import type { Agent } from '../types/agent';

const API_URL = import.meta.env.VITE_API_URL as string;

export interface AdminDemo {
  id: string;
  payload: Agent;
  active: boolean;
  created_at: string;
  updated_at: string;
}

async function getAccessToken() {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) throw new Error('Sessão não encontrada.');
  return data.session.access_token;
}

async function adminFetch(path: string, options: RequestInit = {}) {
  const accessToken = await getAccessToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    let message = `Erro ${response.status}`;
    try {
      const body = await response.json();
      if (body?.error) message = body.error;
    } catch {
      // ignora
    }
    throw new Error(message);
  }

  return response.json();
}

export function useAdminDemos() {
  const [demos, setDemos] = useState<AdminDemo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminFetch('/api/admin/demos');
      setDemos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar flows');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const createDemo = async (id: string, payload: Agent) => {
    setSaving(true);
    setError(null);
    try {
      await adminFetch('/api/admin/demos', {
        method: 'POST',
        body: JSON.stringify({ id, payload }),
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar flow');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const updateDemo = async (id: string, payload: Agent, active = true) => {
    setSaving(true);
    setError(null);
    try {
      await adminFetch(`/api/admin/demos/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ payload, active }),
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar flow');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const deactivateDemo = async (id: string) => {
    setSaving(true);
    setError(null);
    try {
      await adminFetch(`/api/admin/demos/${id}`, { method: 'DELETE' });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao desativar flow');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return { demos, loading, saving, error, reload: load, createDemo, updateDemo, deactivateDemo };
}