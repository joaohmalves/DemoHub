import { Link, Navigate, useParams } from 'react-router-dom';
import { getAgentById } from '../data/agents';
import { Badge } from '../components/common/Badge';
import { LiveDemoPanel } from '../components/agent-workspace/LiveDemoPanel';
import { FlowViewer } from '../components/agent-workspace/FlowViewer';
import { DemoScript } from '../components/agent-workspace/DemoScript';
import { SuggestedQuestions } from '../components/agent-workspace/SuggestedQuestions';
import styles from './AgentPage.module.css';

export function AgentPage() {
  const { agentId } = useParams<{ agentId: string }>();
  const agent = agentId ? getAgentById(agentId) : undefined;

  // Unknown agent id (e.g. stale link) falls through to 404 instead of crashing.
  if (!agent) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.back}>
        ← Back to Agents
      </Link>

      <header className={styles.hero}>
        <img src={agent.image} alt="" className={styles.heroImage} />
        <div className={styles.heroBody}>
          <span className={styles.heroIndustry}>{agent.industry}</span>
          <h1 className={styles.heroTitle}>{agent.name}</h1>
          <p className={styles.heroDescription}>{agent.description}</p>
          <div className={styles.heroMeta}>
            {agent.capabilities.chat && <Badge tone="accent">Chat</Badge>}
            {agent.capabilities.voice && <Badge tone="success">Voice</Badge>}
            {agent.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className={styles.grid}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Live Demo</h2>
          <LiveDemoPanel agent={agent} />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Agent Flow</h2>
          <FlowViewer image={agent.flowImage} agentName={agent.name} />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Demo Script</h2>
          <DemoScript introduction={agent.demoScript.introduction} scenarios={agent.demoScript.scenarios} />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Perguntas Sugeridas</h2>
          <SuggestedQuestions questions={agent.demoScript.suggestedQuestions} />
        </section>
      </div>
    </div>
  );
}
