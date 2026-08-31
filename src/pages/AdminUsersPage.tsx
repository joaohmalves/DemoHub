import { useMemo, useState } from 'react';
import {
  useAdminUsers,
  type AdminUser,
} from '../hooks/useAdminUsers';
import styles from './AdminUsersPage.module.css';

export function AdminUsersPage() {
  const {
    users,
    options,
    loading,
    saving,
    error,
    updateRole,
    updatePermissions,
    updateDemos,
  } = useAdminUsers();

  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] =
    useState<AdminUser | null>(null);

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

  const handleSaveRole = async (
    roleId: string,
  ) => {
    if (!selectedUser) return;

    await updateRole(
      selectedUser.id,
      roleId,
    );

    setSelectedUser(null);
  };

  const handleTogglePermission = async (
    permissionId: string,
  ) => {
    if (!selectedUser) return;

    const currentIds =
      selectedUser.permissions.map(
        (permission) => permission.id,
      );

    const nextIds = currentIds.includes(
      permissionId,
    )
      ? currentIds.filter(
          (id) => id !== permissionId,
        )
      : [...currentIds, permissionId];

    await updatePermissions(
      selectedUser.id,
      nextIds,
    );

    const updatedUser = users.find(
      (user) => user.id === selectedUser.id,
    );

    if (updatedUser) {
      setSelectedUser({
        ...updatedUser,
        permissions:
          options.permissions
            .filter((permission) =>
              nextIds.includes(permission.id),
            ),
      });
    }
  };

  const handleToggleDemo = async (
    demoId: string,
  ) => {
    if (!selectedUser) return;

    const nextIds = selectedUser.demos.includes(
      demoId,
    )
      ? selectedUser.demos.filter(
          (id) => id !== demoId,
        )
      : [
          ...selectedUser.demos,
          demoId,
        ];

    await updateDemos(
      selectedUser.id,
      nextIds,
    );

    setSelectedUser({
      ...selectedUser,
      demos: nextIds,
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <div>
          <h1 className={styles.title}>
            Usuários
          </h1>

          <p className={styles.subtitle}>
            Gerencie roles, permissões e demos
            disponíveis para cada usuário.
          </p>
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <div className={styles.search}>
        <input
          type="search"
          placeholder="Buscar usuário..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
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
                  selectedUser?.id === user.id
                    ? styles.selected
                    : ''
                }`}
                onClick={() =>
                  setSelectedUser(user)
                }
              >
                <div>
                  <strong>
                    {user.displayName}
                  </strong>

                  <span>
                    {user.email}
                  </span>
                </div>

                <span
                  className={`${styles.role} ${
                    styles[
                      `role-${user.role?.name}`
                    ]
                  }`}
                >
                  {user.role?.name ??
                    'Sem role'}
                </span>
              </button>
            ))}

            {filteredUsers.length === 0 && (
              <p className={styles.empty}>
                Nenhum usuário encontrado.
              </p>
            )}
          </div>

          <div className={styles.editor}>
            {!selectedUser ? (
              <div className={styles.placeholder}>
                <h2>
                  Selecione um usuário
                </h2>

                <p>
                  Escolha um usuário na lista
                  para editar suas configurações.
                </p>
              </div>
            ) : (
              <>
                <div className={styles.editorHeader}>
                  <div>
                    <h2>
                      {selectedUser.displayName}
                    </h2>

                    <p>
                      {selectedUser.email}
                    </p>
                  </div>
                </div>

                {/* ROLE */}

                <section
                  className={styles.section}
                >
                  <h3>Role</h3>

                  <div className={styles.roles}>
                    {options.roles.map(
                      (role) => (
                        <label
                          key={role.id}
                          className={
                            styles.option
                          }
                        >
                          <input
                            type="radio"
                            name={`role-${selectedUser.id}`}
                            checked={
                              selectedUser.role?.id ===
                              role.id
                            }
                            disabled={saving}
                            onChange={() =>
                              handleSaveRole(
                                role.id,
                              )
                            }
                          />

                          <span>
                            {role.name}
                          </span>
                        </label>
                      ),
                    )}
                  </div>
                </section>

                {/* PERMISSIONS */}

                <section
                  className={styles.section}
                >
                  <h3>
                    Permissões individuais
                  </h3>

                  <p
                    className={
                      styles.sectionDescription
                    }
                  >
                    Essas permissões são
                    adicionadas além das
                    permissões da role.
                  </p>

                  <div
                    className={
                      styles.optionsList
                    }
                  >
                    {options.permissions.map(
                      (permission) => {
                        const checked =
                          selectedUser.permissions.some(
                            (item) =>
                              item.id ===
                              permission.id,
                          );

                        return (
                          <label
                            key={
                              permission.id
                            }
                            className={
                              styles.checkbox
                            }
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={saving}
                              onChange={() =>
                                handleTogglePermission(
                                  permission.id,
                                )
                              }
                            />

                            <span>
                              {permission.name}
                            </span>
                          </label>
                        );
                      },
                    )}
                  </div>
                </section>

                {/* DEMOS */}

                <section
                  className={styles.section}
                >
                  <h3>
                    Demos disponíveis
                  </h3>

                  <p
                    className={
                      styles.sectionDescription
                    }
                  >
                    Para usuários Viewer,
                    essas são as demos que
                    aparecerão no catálogo.
                  </p>

                  <div
                    className={
                      styles.optionsList
                    }
                  >
                    {options.demos.map(
                      (demo) => {
                        const checked =
                          selectedUser.demos.includes(
                            demo.id,
                          );

                        return (
                          <label
                            key={demo.id}
                            className={
                              styles.checkbox
                            }
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={saving}
                              onChange={() =>
                                handleToggleDemo(
                                  demo.id,
                                )
                              }
                            />

                            <span>
                              {demo.name}
                            </span>
                          </label>
                        );
                      },
                    )}
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}