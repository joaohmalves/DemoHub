import { useMemo, useState } from 'react';
import { useDemos } from '../hooks/useDemos';
import { AgentGrid } from '../components/agents/AgentGrid';
import { IndustryFilter } from '../components/agents/IndustryFilter';
import styles from './DemoHubPage.module.css';

export function DemoHubPage() {
  const { agents, loading, error } = useDemos();
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState<string | null>(null);

  const industries = useMemo(() => Array.from(new Set(agents.map((a) => a.industry))), [agents]);

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
  }, [agents, search, industry]);

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

      {loading && <p>Carregando demos...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && <AgentGrid agents={filtered} />}
    </div>
  );
}
