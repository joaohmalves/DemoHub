import { useState } from 'react';
import type { DemoScenario } from '../../types/agent';
import styles from './DemoScript.module.css';

export function DemoScript({ introduction, scenarios }: { introduction: string; scenarios: DemoScenario[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={styles.wrapper}>
      <p className={styles.introduction}>{introduction}</p>

      <div className={styles.accordion}>
        {scenarios.map((scenario, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={scenario.title} className={styles.item}>
              <button
                className={styles.itemHeader}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
              >
                <span className={styles.itemNumber}>{String(index + 1).padStart(2, '0')}</span>
                <span className={styles.itemTitle}>{scenario.title}</span>
                <span className={[styles.chevron, isOpen ? styles.chevronOpen : ''].join(' ')}>⌄</span>
              </button>

              {isOpen && (
                <div className={styles.itemBody}>
                  <DetailRow label="Objetivo" value={scenario.objective} />
                  <DetailRow label="Prompt sugerido" value={scenario.prompt} emphasized />
                  <DetailRow label="Comportamento esperado" value={scenario.expectedBehavior} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DetailRow({ label, value, emphasized }: { label: string; value: string; emphasized?: boolean }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <p className={[styles.rowValue, emphasized ? styles.rowValueEmphasized : ''].join(' ')}>{value}</p>
    </div>
  );
}
