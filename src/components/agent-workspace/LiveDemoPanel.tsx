import { useState } from 'react';
import type { Agent } from '../../types/agent';
import { CognigyChatEmbed } from './CognigyChatEmbed';
import { CognigyVoiceEmbed } from './CognigyVoiceEmbed';
import styles from './LiveDemoPanel.module.css';

type Mode = 'chat' | 'voice' | null;

export function LiveDemoPanel({ agent }: { agent: Agent }) {
  const [mode, setMode] = useState<Mode>(null);

  const handleModeChange = (nextMode: Mode) => {
    setMode((currentMode) => {
      /**
       * Clicking the active tab closes the current widget.
       */
      if (currentMode === nextMode) {
        return null;
      }

      /**
       * Switching directly from Chat -> Voice or Voice -> Chat
       * unmounts the previous Cognigy component.
       *
       * Its useEffect cleanup is responsible for closing the
       * current widget before the new component is mounted.
       */
      return nextMode;
    });
  };

  return (
    <div className={styles.panel}>
      <div className={styles.tabs}>
        <button
          className={[
            styles.tab,
            mode === 'chat' ? styles.tabActive : '',
          ].join(' ')}
          disabled={!agent.capabilities.chat}
          onClick={() => handleModeChange('chat')}
        >
          Chat
        </button>

        <button
          className={[
            styles.tab,
            mode === 'voice' ? styles.tabActive : '',
          ].join(' ')}
          disabled={!agent.capabilities.voice}
          onClick={() => handleModeChange('voice')}
        >
          Voice
        </button>
      </div>

      <div className={styles.content}>
        {mode === null && (
          <div className={styles.idle}>
            Escolha <strong>Chat</strong> ou <strong>Voice</strong> acima
            para carregar a demo ao vivo.
          </div>
        )}

        {mode === 'chat' && agent.capabilities.chat && (
          <CognigyChatEmbed
            key={`chat-${agent.id}`}
            endpoint={agent.cognigy?.chatEndpoint ?? ''}
          />
        )}

        {mode === 'voice' && agent.capabilities.voice && (
          <CognigyVoiceEmbed
            key={`voice-${agent.id}`}
            endpoint={agent.cognigy?.voiceEndpoint ?? ''}
          />
        )}
      </div>
    </div>
  );
}