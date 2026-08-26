import { useEffect, useState } from 'react';
import { applyTheme, getStoredTheme, type Theme } from '../../services/theme';
import styles from './ThemeToggle.module.css';

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');

  // Read the persisted preference once the component mounts on the client
  // (avoids a server/client mismatch if this were ever pre-rendered).
  useEffect(() => {
    const stored = getStoredTheme();
    setTheme(stored);
    applyTheme(stored);
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
  };

  return (
    <button
      type="button"
      className={styles.switch}
      role="switch"
      aria-checked={theme === 'light'}
      aria-label="Alternar tema claro/escuro"
      onClick={toggle}
    >
      <span className={styles.iconMoon}>🌙</span>
      <span className={[styles.thumb, theme === 'light' ? styles.thumbLight : ''].join(' ')} />
      <span className={styles.iconSun}>☀️</span>
    </button>
  );
}
