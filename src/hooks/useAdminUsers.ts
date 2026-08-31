import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const API_URL = import.meta.env.VITE_API_URL as string;

export interface AdminUser {
  id: string;
  email: string | null;
  displayName: string;

  role: {
    id: string;
    name: string;
  } | null;

  permissions: {
    id: string;
    name: string;
  }[];

  demos: string[];

  createdAt: string;
  lastSignInAt: string | null;
}

export interface AdminOption {
  id: string;
  name: string;
}

export interface AdminOptions {
  roles: AdminOption[];
  permissions: AdminOption[];
  demos: AdminOption[];
}

async function getAccessToken() {
  const {
    data,
    error,
  } = await supabase.auth.getSession();

  if (error || !data.session) {
    throw new Error('Sessão não encontrada.');
  }

  return data.session.access_token;
}

async function adminFetch(
  path: string,
  options: RequestInit = {},
) {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        ...(options.headers ?? {}),
      },
    },
  );

  if (!response.ok) {
    let message = `Erro ${response.status}`;

    try {
      const body = await response.json();

      if (body?.error) {
        message = body.error;
      }
    } catch {
      // Ignora erro ao tentar interpretar resposta
    }

    throw new Error(message);
  }

  return response.json();
}

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [options, setOptions] = useState<AdminOptions>({
    roles: [],
    permissions: [],
    demos: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [usersData, optionsData] = await Promise.all([
        adminFetch('/api/admin/users'),
        adminFetch('/api/admin/users/options'),
      ]);

      setUsers(usersData);
      setOptions(optionsData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao carregar usuários',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateRole = async (
    userId: string,
    roleId: string,
  ) => {
    setSaving(true);
    setError(null);

    try {
      await adminFetch(
        `/api/admin/users/${userId}/role`,
        {
          method: 'PUT',
          body: JSON.stringify({
            roleId,
          }),
        },
      );

      await load();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao alterar role',
      );

      throw err;
    } finally {
      setSaving(false);
    }
  };

  const updatePermissions = async (
    userId: string,
    permissionIds: string[],
  ) => {
    setSaving(true);
    setError(null);

    try {
      await adminFetch(
        `/api/admin/users/${userId}/permissions`,
        {
          method: 'PUT',
          body: JSON.stringify({
            permissionIds,
          }),
        },
      );

      await load();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao atualizar permissões',
      );

      throw err;
    } finally {
      setSaving(false);
    }
  };

  const updateDemos = async (
    userId: string,
    demoIds: string[],
  ) => {
    setSaving(true);
    setError(null);

    try {
      await adminFetch(
        `/api/admin/users/${userId}/demos`,
        {
          method: 'PUT',
          body: JSON.stringify({
            demoIds,
          }),
        },
      );

      await load();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao atualizar demos',
      );

      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    users,
    options,
    loading,
    saving,
    error,

    reload: load,

    updateRole,
    updatePermissions,
    updateDemos,
  };
}