import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession, logout } from '../../services/auth';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { Button } from '../common/Button';
import { ThemeToggle } from '../layout/ThemeToggle';
import styles from './Header.module.css';

export function Header() {
  const navigate = useNavigate();
  const session = getSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { user, loading: userLoading } = useCurrentUser();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const isAdmin = user?.role?.name === 'admin';

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.brand}>
        <span className={styles.logoDot} />
        <span>
          Cognigy <span className={styles.brandAccent}>Demo Hub</span>
        </span>
      </Link>

      <div className={styles.right}>
        <ThemeToggle />

        {session && (
          <>
            {!userLoading && user && (
              <div className={styles.menuWrapper} ref={menuRef}>
                <button
                  type="button"
                  className={styles.userTrigger}
                  onClick={() => setMenuOpen((open) => !open)}
                >
                  <span className={styles.user}>
                    {user.displayName}
                    {' · '}
                    {user.role?.name ?? 'Sem role'}
                  </span>
                  <span className={styles.chevron} data-open={menuOpen}>
                    ▾
                  </span>
                </button>

                {menuOpen && isAdmin && (
                  <div className={styles.dropdown}>
                    <button
                      type="button"
                      className={styles.dropdownItem}
                      onClick={() => {
                        setMenuOpen(false);
                        navigate('/admin/users');
                      }}
                    >
                      Administração
                    </button>

                    <button
                      type="button"
                      className={styles.dropdownItem}
                      onClick={() => {
                        setMenuOpen(false);
                        navigate('/admin/flows');
                      }}
                    >
                      Flows
                    </button>
                  </div>
                )}
              </div>
            )}

            <Button variant="ghost" onClick={handleLogout}>
              Sair
            </Button>
          </>
        )}
      </div>
    </header>
  );
}