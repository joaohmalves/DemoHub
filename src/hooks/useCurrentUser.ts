import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const API_URL = import.meta.env.VITE_API_URL as string;

export interface CurrentUser {
    id: string;
    email: string | null;
    displayName: string;

    role: {
        id: string;
        name: string;
    } | null;

    permissions: string[];

    createdAt: string;
    lastSignInAt: string | null;
}

interface UseCurrentUserResult {
    user: CurrentUser | null;
    loading: boolean;
    error: string | null;
    hasPermission: (permission: string) => boolean;
    isAdmin: boolean;
    isSales: boolean;
    isViewer: boolean;
}

export function useCurrentUser(): UseCurrentUserResult {
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadUser() {
            setLoading(true);
            setError(null);

            try {
                const {
                    data: sessionData,
                    error: sessionError,
                } = await supabase.auth.getSession();

                if (sessionError || !sessionData.session) {
                    throw new Error(
                        'Sessão não encontrada. Faça login novamente.'
                    );
                }

                const accessToken = sessionData.session.access_token;

                const response = await fetch(
                    `${API_URL}/api/auth/me`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `Erro ${response.status} ao buscar usuário`
                    );
                }

                const data = (await response.json()) as CurrentUser;

                if (!cancelled) {
                    setUser(data);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : 'Erro desconhecido'
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadUser();

        return () => {
            cancelled = true;
        };
    }, []);

    return {
        user,
        loading,
        error,

        hasPermission: (permission: string) =>
            user?.permissions.includes(permission) ?? false,

        isAdmin: user?.role?.name === 'admin',
        isSales: user?.role?.name === 'sales',
        isViewer: user?.role?.name === 'viewer',
    };
}