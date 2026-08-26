import type { Agent } from '../../types/agent';
import { AgentCard } from './AgentCard';
import styles from './AgentGrid.module.css';

export function AgentGrid({ agents }: { agents: Agent[] }) {
  if (agents.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>Nenhum agente encontrado</p>
        <p className={styles.emptyHint}>Tente ajustar a busca ou o filtro de indústria.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}
