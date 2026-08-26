import { FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { isAuthenticated, login } from '../services/auth';
import { Button } from '../components/common/Button';
import { ThemeToggle } from '../components/layout/ThemeToggle';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Already logged in? Skip the form entirely.
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? '/';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const session = login(username.trim(), password);
    if (!session) {
      setError('Usuário ou senha inválidos.');
      return;
    }
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className={styles.page}>
      <div className={styles.themeToggleWrap}>
        <ThemeToggle />
      </div>
      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.logoDot} />
          <span>Cognigy Demo Hub</span>
        </div>
        <p className={styles.subtitle}>Acesso interno para equipe de vendas e pré-vendas.</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span className={styles.label}>Usuário</span>
            <input
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              autoComplete="username"
            />
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Senha</span>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <Button type="submit" className={styles.submit}>
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}