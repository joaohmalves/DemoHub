import { useEffect } from 'react';
import { loadWidgetScript } from '../../services/externalWidget';
import styles from './CognigyEmbed.module.css';

const CHAT_SCRIPT_SRC =
  'https://github.com/Cognigy/Webchat/releases/latest/download/webchat.js';

const CHAT_TOGGLE_SELECTOR =
  '[data-cognigy-webchat-toggle="true"]';

interface Props {
  endpoint: string;
}

interface WebchatInstance {
  close?: () => void;
  disconnect?: () => void;
  open?: () => void;
}

export function CognigyChatEmbed({ endpoint }: Props) {
  useEffect(() => {
    if (!endpoint) return;

    let cancelled = false;
    let webchatInstance: WebchatInstance | undefined;

    const hideChatToggle = () => {
      const button = document.querySelector(
        CHAT_TOGGLE_SELECTOR
      ) as HTMLElement | null;

      if (button) {
        button.style.display = 'none';
      }
    };

    const showChatToggle = () => {
      const button = document.querySelector(
        CHAT_TOGGLE_SELECTOR
      ) as HTMLElement | null;

      if (button) {
        button.style.display = '';
      }
    };

    const initializeWebchat = () => {
      if (cancelled) return;

      if (typeof window.initWebchat !== 'function') {
        console.error(
          '[CognigyChatEmbed] window.initWebchat is not available.'
        );
        return;
      }

      console.log(
        '[CognigyChatEmbed] Initializing Webchat...'
      );

      window.initWebchat(endpoint)
        .then((instance) => {
          if (cancelled) {
            instance?.close?.();
            instance?.disconnect?.();
            return;
          }

          webchatInstance = instance;

          console.log(
            '[CognigyChatEmbed] Webchat initialized successfully.'
          );

          /**
           * Chat is the currently selected demo,
           * so the widget should be available.
           */
          showChatToggle();

          /**
           * Open the Webchat automatically.
           */
          instance?.open?.();
        })
        .catch((error: unknown) => {
          if (cancelled) return;

          console.error(
            '[CognigyChatEmbed] Failed to initialize Webchat:',
            error
          );
        });
    };

    const cleanupWidgetScript = loadWidgetScript(
      CHAT_SCRIPT_SRC,
      initializeWebchat
    );

    return () => {
      cancelled = true;

      console.log(
        '[CognigyChatEmbed] Cleaning up Webchat...'
      );

      /**
       * Close the widget before disconnecting it.
       */
      try {
        webchatInstance?.close?.();
      } catch (error) {
        console.warn(
          '[CognigyChatEmbed] Webchat close() failed:',
          error
        );
      }

      try {
        webchatInstance?.disconnect?.();
      } catch (error) {
        console.warn(
          '[CognigyChatEmbed] Webchat disconnect() failed:',
          error
        );
      }

      webchatInstance = undefined;

      /**
       * Hide the floating Chat button while
       * another demo is selected.
       */
      hideChatToggle();

      /**
       * Keep the external script loaded, but cancel
       * this component's callback.
       */
      cleanupWidgetScript();
    };
  }, [endpoint]);

  if (!endpoint) {
    return (
      <div className={styles.placeholder}>
        Chat demo coming soon.
      </div>
    );
  }

  return (
    <div className={styles.pointerCard}>
      <div
        className={styles.pointerArrow}
        aria-hidden="true"
      >
        ↘
      </div>

      <p className={styles.pointerText}>
        O chat já abriu no{' '}
        <strong>canto inferior direito da tela</strong> — a conversa
        acontece ali, ao vivo, com o widget oficial da Cognigy.
      </p>
    </div>
  );
}