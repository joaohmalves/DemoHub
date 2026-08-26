import { Link } from 'react-router-dom';
import type { Agent } from '../../types/agent';
import { Badge } from '../common/Badge';
import styles from './AgentCard.module.css';

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    // Whole card is a single <Link>, not a button nested inside a clickable div,
    // so the entire surface is clickable/keyboard-focusable per spec section 9.
    <Link to={`/agents/${agent.id}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <img src={agent.image} alt="" className={styles.image} />
        <span className={styles.industry}>{agent.industry}</span>
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{agent.name}</h3>
        <p className={styles.description}>{agent.shortDescription}</p>

        <div className={styles.footer}>
          <div className={styles.capabilities}>
            {agent.capabilities.chat && <Badge tone="accent">Chat</Badge>}
            {agent.capabilities.voice && <Badge tone="success">Voice</Badge>}
          </div>
          <div className={styles.tags}>
            {agent.tags.slice(0, 2).map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
