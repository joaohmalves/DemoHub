import styles from './IndustryFilter.module.css';

interface IndustryFilterProps {
  industries: string[];
  active: string | null;
  onChange: (industry: string | null) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export function IndustryFilter({ industries, active, onChange, search, onSearchChange }: IndustryFilterProps) {
  return (
    <div className={styles.container}>
      <input
        className={styles.search}
        type="text"
        placeholder="Buscar por nome, tag ou indústria..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div className={styles.chips}>
        <button
          className={[styles.chip, active === null ? styles.chipActive : ''].join(' ')}
          onClick={() => onChange(null)}
        >
          Todos
        </button>
        {industries.map((industry) => (
          <button
            key={industry}
            className={[styles.chip, active === industry ? styles.chipActive : ''].join(' ')}
            onClick={() => onChange(industry)}
          >
            {industry}
          </button>
        ))}
      </div>
    </div>
  );
}
