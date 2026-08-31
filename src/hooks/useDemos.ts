import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient'; // ajuste o caminho se o seu client Supabase estiver em outro lugar
import type { Agent } from '../types/agent';

const API_URL = import.meta.env.VITE_API_URL as string;

interface UseDemosResult {
  agents: Agent[];
  loading: boolean;
  error: string | null;
}

// Busca só as demos que a role do usuário logado pode ver (backend decide,
// não o front). Substitui o import estático de `agents.ts`.
export function useDemos(): UseDemosResult {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      if (!accessToken) {
        if (!cancelled) {
          setError('Sessão não encontrada. Faça login novamente.');
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/demos`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!response.ok) throw new Error(`Erro ${response.status} ao buscar demos`);
        const data = (await response.json()) as Agent[];
        if (!cancelled) setAgents(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { agents, loading, error };
}
