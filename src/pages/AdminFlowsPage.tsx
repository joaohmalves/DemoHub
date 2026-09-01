import { useNavigate } from 'react-router-dom';
import { useAdminDemos } from '../hooks/useAdminDemos';
import styles from './AdminFlowsPage.module.css';

export function AdminFlowsPage() {
  const { demos, loading, error } = useAdminDemos();
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <div>
          <h1 className={styles.title}>Flows</h1>
          <p className={styles.subtitle}>
            Crie e edite os agentes de demonstração exibidos no catálogo.
          </p>
        </div>

        <button
          type="button"
          className={styles.addButton}
          onClick={() => navigate('/admin/flows/new')}
        >
          + Adicionar nova demo
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {loading ? (
        <p>Carregando flows...</p>
      ) : (
        <div className={styles.grid}>
          {demos.map((demo) => (
            <button
              key={demo.id}
              type="button"
              className={styles.card}
              onClick={() => navigate(`/admin/flows/${demo.id}`)}
            >
              {demo.payload.image && (
                <img src={demo.payload.image} alt="" className={styles.cardImage} />
              )}

              <div className={styles.cardBody}>
                <div className={styles.cardTop}>
                  <strong className={styles.cardName}>{demo.payload.name}</strong>
                  <span className={`${styles.status} ${demo.active ? styles.active : styles.inactive}`}>
                    {demo.active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>

                <p className={styles.cardDescription}>{demo.payload.shortDescription}</p>

                <div className={styles.cardTags}>
                  {demo.payload.capabilities?.chat && <span className={styles.tag}>Chat</span>}
                  {demo.payload.capabilities?.voice && <span className={styles.tag}>Voice</span>}
                  {demo.payload.capabilities?.multimodal && <span className={styles.tag}>Multimodal</span>}
                </div>
              </div>
            </button>
          ))}

          {demos.length === 0 && (
            <p className={styles.empty}>Nenhum flow cadastrado ainda.</p>
          )}
        </div>
      )}
    </div>
  );
}