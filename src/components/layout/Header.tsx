import { Link, useNavigate } from 'react-router-dom';
import { getSession, logout } from '../../services/auth';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { Button } from '../common/Button';
import { ThemeToggle } from '../layout/ThemeToggle';
import styles from './Header.module.css';

export function Header() {
  const navigate = useNavigate();
  const session = getSession();

  const {
    user,
    loading: userLoading,
  } = useCurrentUser();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.brand}>
        <span className={styles.logoDot} />

        <span>
          Cognigy{' '}
          <span className={styles.brandAccent}>
            Demo Hub
          </span>
        </span>
      </Link>

      <div className={styles.right}>
        <ThemeToggle />

        {session && (
          <>
            {user?.role?.name === 'admin' && (
              <Button
                variant="ghost"
                onClick={() => navigate('/admin/users')}
              >
                Administração
              </Button>
            )}

            {!userLoading && user && (
              <span className={styles.user}>
                {user.displayName}
                {' · '}
                {user.role?.name ?? 'Sem role'}
              </span>
            )}

            <Button
              variant="ghost"
              onClick={handleLogout}
            >
              Sair
            </Button>
          </>
        )}
      </div>
    </header>
  );
}