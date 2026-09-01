import { useEffect, useMemo, useState } from 'react';
import {
  useAdminUsers,
  type AdminUser,
} from '../hooks/useAdminUsers';
import styles from './AdminUsersPage.module.css';

interface Draft {
  roleId: string | null;
  permissionIds: string[];
  demoIds: string[];
}

function draftFromUser(user: AdminUser): Draft {
  return {
    roleId: user.role?.id ?? null,
    permissionIds: user.permissions.map((permission) => permission.id),
    demoIds: [...user.demos],
  };
}

function sameIds(a: string[], b: string[]) {
  if (a.length !== b.length) return false;
  const setB = new Set(b);
  return a.every((id) => setB.has(id));
}

function CheckMark() {
  return (
    <span className={styles.checkMark}>
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M3 8.5L6.2 11.5L13 4.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function AdminUsersPage() {
  const {
    users,
    options,
    loading,
    saving,
    error,
    saveUser,
  } = useAdminUsers();

  const [search, setSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) ?? null,
    [users, selectedUserId],
  );

  // Reset the draft whenever a different user is selected, or the underlying
  // user data changes after a save.
  useEffect(() => {
    if (!selectedUser) {
      setDraft(null);
      return;
    }

    setDraft(draftFromUser(selectedUser));
  }, [selectedUser]);

  const isDirty = useMemo(() => {
    if (!selectedUser || !draft) return false;

    return (
      draft.roleId !== (selectedUser.role?.id ?? null) ||
      !sameIds(draft.permissionIds, selectedUser.permissions.map((p) => p.id)) ||
      !sameIds(draft.demoIds, selectedUser.demos)
    );
  }, [selectedUser, draft]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) =>
      [
        user.displayName,
        user.email ?? '',
        user.role?.name ?? '',
      ]
        .join(' ')
        .toLowerCase()
        .includes(query),
    );
  }, [users, search]);

  const handleSelectUser = (user: AdminUser) => {
    if (isDirty) {
      const confirmed = window.confirm(
        'Você tem alterações não salvas para este usuário. Deseja descartá-las?',
      );

      if (!confirmed) return;
    }

    setSelectedUserId(user.id);
  };

  const handleSelectRole = (roleId: string) => {
    setDraft((current) => (current ? { ...current, roleId } : current));
  };

  const handleTogglePermission = (permissionId: string) => {
    setDraft((current) => {
      if (!current) return current;

      const has = current.permissionIds.includes(permissionId);

      return {
        ...current,
        permissionIds: has
          ? current.permissionIds.filter((id) => id !== permissionId)
          : [...current.permissionIds, permissionId],
      };
    });
  };

  const handleToggleDemo = (demoId: string) => {
    setDraft((current) => {
      if (!current) return current;

      const has = current.demoIds.includes(demoId);

      return {
        ...current,
        demoIds: has
          ? current.demoIds.filter((id) => id !== demoId)
          : [...current.demoIds, demoId],
      };
    });
  };

  const handleDiscard = () => {
    if (selectedUser) setDraft(draftFromUser(selectedUser));
  };

  const handleSave = async () => {
    if (!selectedUser || !draft) return;

    try {
      await saveUser(selectedUser.id, {
        roleId: draft.roleId ?? undefined,
        permissionIds: draft.permissionIds,
        demoIds: draft.demoIds,
      });
    } catch {
      // O erro já é exposto via `error` do hook.
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <div>
          <h1 className={styles.title}>Usuários</h1>

          <p className={styles.subtitle}>
            Gerencie roles, permissões e demos disponíveis para cada usuário.
          </p>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.search}>
        <input
          type="search"
          placeholder="Buscar usuário..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {loading ? (
        <p>Carregando usuários...</p>
      ) : (
        <div className={styles.content}>
          <div className={styles.userList}>
            {filteredUsers.map((user) => (
              <button
                key={user.id}
                type="button"
                className={`${styles.userRow} ${
                  selectedUser?.id === user.id ? styles.selected : ''
                }`}
                onClick={() => handleSelectUser(user)}
              >
                <div>
                  <strong>{user.displayName}</strong>
                  <span>{user.email}</span>
                </div>

                <span
                  className={`${styles.role} ${
                    styles[`role-${user.role?.name}`]
                  }`}
                >
                  {user.role?.name ?? 'Sem role'}
                </span>
              </button>
            ))}

            {filteredUsers.length === 0 && (
              <p className={styles.empty}>Nenhum usuário encontrado.</p>
            )}
          </div>

          <div className={styles.editor}>
            {!selectedUser || !draft ? (
              <div className={styles.placeholder}>
                <h2>Selecione um usuário</h2>

                <p>Escolha um usuário na lista para editar suas configurações.</p>
              </div>
            ) : (
              <>
                <div className={styles.editorHeader}>
                  <div>
                    <h2>{selectedUser.displayName}</h2>
                    <p>{selectedUser.email}</p>
                  </div>

                  {isDirty && (
                    <span className={styles.dirtyBadge}>Alterações não salvas</span>
                  )}
                </div>

                {/* ROLE */}

                <section className={styles.section}>
                  <h3>Role</h3>

                  <div className={styles.roles}>
                    {options.roles.map((role) => (
                      <label key={role.id} className={styles.option}>
                        <input
                          type="radio"
                          name={`role-${selectedUser.id}`}
                          checked={draft.roleId === role.id}
                          onChange={() => handleSelectRole(role.id)}
                        />

                        <span>{role.name}</span>
                      </label>
                    ))}
                  </div>
                </section>

                {/* PERMISSIONS */}

                <section className={styles.section}>
                  <h3>Permissões individuais</h3>

                  <p className={styles.sectionDescription}>
                    Essas permissões são adicionadas além das permissões da
                    role.
                  </p>

                  <div className={styles.optionsList}>
                    {options.permissions.map((permission) => {
                      const checked = draft.permissionIds.includes(
                        permission.id,
                      );

                      return (
                        <label key={permission.id} className={styles.checkbox}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              handleTogglePermission(permission.id)
                            }
                          />

                          <CheckMark />
                          <span>{permission.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </section>

                {/* DEMOS */}

                <section className={styles.section}>
                  <h3>Demos disponíveis</h3>

                  <p className={styles.sectionDescription}>
                    Para usuários Viewer, essas são as demos que aparecerão no
                    catálogo.
                  </p>

                  <div className={styles.optionsList}>
                    {options.demos.map((demo) => {
                      const checked = draft.demoIds.includes(demo.id);

                      return (
                        <label key={demo.id} className={styles.checkbox}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleToggleDemo(demo.id)}
                          />

                          <CheckMark />
                          <span>{demo.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </section>

                <div className={styles.saveBar}>
                  <button
                    type="button"
                    className={styles.discardButton}
                    onClick={handleDiscard}
                    disabled={!isDirty || saving}
                  >
                    Descartar
                  </button>

                  <button
                    type="button"
                    className={styles.saveButton}
                    onClick={handleSave}
                    disabled={!isDirty || saving}
                  >
                    {saving ? 'Salvando...' : 'Salvar alterações'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}