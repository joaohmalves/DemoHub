import type { Agent } from '../../types/agent';
import styles from './LiveDemoPanel.module.css';

type DemoMode = 'chat' | 'voice' | 'multimodal';

export function LiveDemoPanel({ agent }: { agent: Agent }) {
  const openDemo = (url?: string) => {
    if (!url) return;

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const chatAvailable =
    agent.capabilities.chat && !!agent.demoUrls?.chat;

  const voiceAvailable =
    agent.capabilities.voice && !!agent.demoUrls?.voice;

  const multimodalAvailable =
    !!agent.capabilities.multimodal && !!agent.demoUrls?.multimodal;

  return (
    <div className={styles.panel}>
      <div className={styles.tabs}>
        <button
          className={styles.tab}
          disabled={!chatAvailable}
          onClick={() => openDemo(agent.demoUrls?.chat)}
        >
          Chat
        </button>

        <button
          className={styles.tab}
          disabled={!voiceAvailable}
          onClick={() => openDemo(agent.demoUrls?.voice)}
        >
          Voice
        </button>

        <button
          className={styles.tab}
          disabled={!multimodalAvailable}
          onClick={() => openDemo(agent.demoUrls?.multimodal)}
        >
          Voice + Multimodal
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.idle}>
          Escolha uma das opções acima para abrir a demo em uma nova aba.
        </div>
      </div>
    </div>
  );
}