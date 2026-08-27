import { useState } from 'react';
import type { Agent } from '../../types/agent';
import { buildDemoUrl, type DemoType } from '../../services/demoHandoff';
import styles from './LiveDemoPanel.module.css';

export function LiveDemoPanel({ agent }: { agent: Agent }) {
  const [loading, setLoading] = useState<DemoType | null>(null);
  const [errorType, setErrorType] = useState<
    'generic' | 'session-expired' | null
  >(null);

  const openDemo = async (
    type: DemoType,
    baseUrl?: string,
  ) => {
    if (!baseUrl) return;

    setErrorType(null);
    setLoading(type);

    try {
      const url = await buildDemoUrl(baseUrl, type);

      window.open(
        url,
        '_blank',
        'noopener,noreferrer',
      );
    } catch (err) {
      console.error(
        `[LiveDemoPanel] ${type} handoff failed`,
        err,
      );

      if (
        err instanceof Error &&
        err.message === 'SESSION_EXPIRED'
      ) {
        setErrorType('session-expired');
      } else {
        setErrorType('generic');
      }
    } finally {
      setLoading(null);
    }
  };

  const chatAvailable =
    agent.capabilities.chat &&
    !!agent.demoUrls?.chat;

  const voiceAvailable =
    agent.capabilities.voice &&
    !!agent.demoUrls?.voice;

  const multimodalAvailable =
    !!agent.capabilities.multimodal &&
    !!agent.demoUrls?.multimodal;

  return (
    <div className={styles.panel}>
      <div className={styles.tabs}>

        <button
          className={styles.tab}
          disabled={!chatAvailable || loading !== null}
          onClick={() =>
            openDemo(
              'chat',
              agent.demoUrls?.chat,
            )
          }
        >
          {loading === 'chat'
            ? 'Abrindo...'
            : 'Chat'}
        </button>

        <button
          className={styles.tab}
          disabled={!voiceAvailable || loading !== null}
          onClick={() =>
            openDemo(
              'voice',
              agent.demoUrls?.voice,
            )
          }
        >
          {loading === 'voice'
            ? 'Abrindo...'
            : 'Voice'}
        </button>

        <button
          className={styles.tab}
          disabled={
            !multimodalAvailable ||
            loading !== null
          }
          onClick={() =>
            openDemo(
              'multimodal',
              agent.demoUrls?.multimodal,
            )
          }
        >
          {loading === 'multimodal'
            ? 'Abrindo...'
            : 'Voice + Multimodal'}
        </button>

      </div>

      <div className={styles.content}>

        {errorType === 'session-expired' && (
          <div className={styles.idle}>
            Sua sessão expirou.{' '}
            <a
              href="/login"
              className={styles.link}
            >
              Faça login novamente
            </a>
            .
          </div>
        )}

        {errorType === 'generic' && (
          <div className={styles.idle}>
            Não foi possível abrir a demo.
            Tente novamente.
          </div>
        )}

        {!errorType && (
          <div className={styles.idle}>
            Escolha uma das opções acima para
            abrir a demo em uma nova aba.
          </div>
        )}

      </div>
    </div>
  );
}