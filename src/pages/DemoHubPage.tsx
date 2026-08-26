import { useMemo, useState } from 'react';
import { agents } from '../data/agents';
import { AgentGrid } from '../components/agents/AgentGrid';
import { IndustryFilter } from '../components/agents/IndustryFilter';
import styles from './DemoHubPage.module.css';

export function DemoHubPage() {
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState<string | null>(null);

  const industries = useMemo(() => Array.from(new Set(agents.map((a) => a.industry))), []);

  // Client-side only filtering, per spec section 5 (no backend needed for this scale).
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return agents.filter((agent) => {
      const matchesIndustry = !industry || agent.industry === industry;
      const matchesQuery =
        !query ||
        agent.name.toLowerCase().includes(query) ||
        agent.industry.toLowerCase().includes(query) ||
        agent.tags.some((tag) => tag.toLowerCase().includes(query));
      return matchesIndustry && matchesQuery;
    });
  }, [search, industry]);

  return (
    <div>
      <div className={styles.heading}>
        <h1 className={styles.title}>Catálogo de Agentes</h1>
        <p className={styles.subtitle}>Escolha um agente para abrir o workspace de demonstração.</p>
      </div>

      <IndustryFilter
        industries={industries}
        active={industry}
        onChange={setIndustry}
        search={search}
        onSearchChange={setSearch}
      />

      <AgentGrid agents={filtered} />
    </div>
  );
}
