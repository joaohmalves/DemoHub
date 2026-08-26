import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  return (
    <div className={styles.page}>
      <span className={styles.code}>404</span>
      <h1 className={styles.title}>Página não encontrada</h1>
      <p className={styles.subtitle}>O link que você acessou não existe ou o agente foi removido do catálogo.</p>
      <Link to="/">
        <Button>Voltar ao Hub</Button>
      </Link>
    </div>
  );
}
