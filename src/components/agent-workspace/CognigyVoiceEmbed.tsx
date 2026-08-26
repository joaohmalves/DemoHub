import { useEffect } from 'react';
import { loadWidgetScript } from '../../services/externalWidget';
import styles from './CognigyEmbed.module.css';

const VOICE_SCRIPT_SRC =
  'https://github.com/Cognigy/click-to-call-widget/releases/latest/download/webRTCWidget.js';

interface Props {
  endpoint: string;
}

export function CognigyVoiceEmbed({ endpoint }: Props) {
  useEffect(() => {
    if (!endpoint) return;

    let cancelled = false;

    const initializeVoiceWidget = () => {
      if (cancelled) return;

      if (typeof window.initWebRTCWidget !== 'function') {
        console.error(
          '[CognigyVoiceEmbed] window.initWebRTCWidget is not available.'
        );
        return;
      }

      console.log(
        '[CognigyVoiceEmbed] Initializing Click-to-Call widget...'
      );

      try {
        window.initWebRTCWidget(endpoint);

        console.log(
          '[CognigyVoiceEmbed] Click-to-Call widget initialized.'
        );
      } catch (error) {
        console.error(
          '[CognigyVoiceEmbed] Failed to initialize Click-to-Call:',
          error
        );
      }
    };

    /**
     * loadWidgetScript handles both cases:
     *
     * 1. Script is being loaded for the first time.
     * 2. Script was already loaded previously.
     *
     * We do NOT need window.addEventListener('load', ...).
     */
    const cleanupWidgetScript = loadWidgetScript(
      VOICE_SCRIPT_SRC,
      initializeVoiceWidget
    );

    return () => {
      cancelled = true;

      console.log(
        '[CognigyVoiceEmbed] Cleaning up Click-to-Call widget...'
      );

      // @ts-expect-error Cognigy injects destroyWebRTCWidget globally
      if (typeof window.destroyWebRTCWidget === 'function') {
        // Let the widget unmount its own Preact tree and remove its
        // own container div. This MUST run before the generic
        // MutationObserver-based cleanup below, otherwise the widget's
        // internal container gets ripped out of the DOM without Preact
        // knowing, corrupting its internal tree and breaking the next
        // page's widget instance.
        // @ts-expect-error Cognigy injects destroyWebRTCWidget globally
        window.destroyWebRTCWidget();
      }

      cleanupWidgetScript();
    };
  }, [endpoint]);

  if (!endpoint) {
    return (
      <div className={styles.placeholder}>
        Voice demo coming soon.
      </div>
    );
  }

  return (
    <div className={styles.pointerCard}>
      <div
        className={styles.pointerArrow}
        aria-hidden="true"
      >
        ↙
      </div>

      <p className={styles.pointerText}>
        O widget de voz foi carregado no{' '}
        <strong>canto inferior esquerdo da tela</strong>.
        Clique no ícone de telefone para iniciar a chamada — a
        transcrição da conversa aparece automaticamente ali durante
        a ligação.
      </p>
    </div>
  );
}