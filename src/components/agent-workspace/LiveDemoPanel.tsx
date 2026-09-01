import { useState } from 'react';
import type { Agent } from '../../types/agent';
import { buildDemoUrl } from '../../services/demoHandoff';
import { CognigyChatEmbed } from './CognigyChatEmbed';
import { CognigyVoiceEmbed } from './CognigyVoiceEmbed';
import styles from './LiveDemoPanel.module.css';

type Tab = 'chat' | 'voice' | 'multimodal';

export function LiveDemoPanel({ agent }: { agent: Agent }) {
  const [activeTab, setActiveTab] = useState<Tab | null>(null);
  const [loadingMultimodal, setLoadingMultimodal] = useState(false);
  const [errorType, setErrorType] = useState<
    'generic' | 'session-expired' | null
  >(null);

  const chatAvailable =
    !!agent.capabilities.chat && !!agent.cognigy?.chatEndpoint;

  const voiceAvailable =
    !!agent.capabilities.voice && !!agent.cognigy?.voiceEndpoint;

  const multimodalAvailable =
    !!agent.capabilities.multimodal && !!agent.demoUrls?.multimodal;

  // Chat e Voice abrem os widgets oficiais da Cognigy embutidos
  // na própria página (cantos da tela) — sem popup, sem nova aba.
  const selectEmbeddedTab = (tab: 'chat' | 'voice') => {
    setErrorType(null);
    setActiveTab((current) => (current === tab ? null : tab));
  };

  // Multimodal continua abrindo em uma nova aba, via handoff
  // autenticado (o app OneBank precisa rodar isolado).
  const openMultimodal = async () => {
    if (!agent.demoUrls?.multimodal) return;

    setErrorType(null);
    setLoadingMultimodal(true);

    try {
      const url = await buildDemoUrl(
        agent.demoUrls.multimodal,
        'multimodal',
      );

      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error(
        '[LiveDemoPanel] multimodal handoff failed',
        err,
      );

      if (err instanceof Error && err.message === 'SESSION_EXPIRED') {
        setErrorType('session-expired');
      } else {
        setErrorType('generic');
      }
    } finally {
      setLoadingMultimodal(false);
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === 'chat' ? styles.tabActive : ''
          }`}
          disabled={!chatAvailable}
          onClick={() => selectEmbeddedTab('chat')}
        >
          Chat
        </button>

        <button
          className={`${styles.tab} ${
            activeTab === 'voice' ? styles.tabActive : ''
          }`}
          disabled={!voiceAvailable}
          onClick={() => selectEmbeddedTab('voice')}
        >
          Voice
        </button>

        <button
          className={styles.tab}
          disabled={!multimodalAvailable || loadingMultimodal}
          onClick={openMultimodal}
        >
          {loadingMultimodal ? 'Abrindo...' : 'Voice + Multimodal ↗'}
        </button>
      </div>

      <div className={styles.content}>
        {errorType === 'session-expired' && (
          <div className={styles.idle}>
            Sua sessão expirou.{' '}
            <a href="/login" className={styles.link}>
              Faça login novamente
            </a>
            .
          </div>
        )}

        {errorType === 'generic' && (
          <div className={styles.idle}>
            Não foi possível abrir a demo. Tente novamente.
          </div>
        )}

        {!errorType && activeTab === 'chat' && (
          <CognigyChatEmbed endpoint={agent.cognigy?.chatEndpoint ?? ''} />
        )}

        {!errorType && activeTab === 'voice' && (
          <CognigyVoiceEmbed endpoint={agent.cognigy?.voiceEndpoint ?? ''} />
        )}

        {!errorType && activeTab === null && (
          <div className={styles.idle}>
            Escolha <strong>Chat</strong> ou <strong>Voice</strong> para
            abrir o widget aqui na página, ou{' '}
            <strong>Voice + Multimodal</strong> para abrir a experiência
            completa em uma nova aba.
          </div>
        )}
      </div>
    </div>
  );
}