export {};

interface CognigyWebchatInstance {
  close?: () => void;
  disconnect?: () => void;
  open?: () => void;
}

declare global {
  interface Window {
    initWebchat: (
      endpoint: string
    ) => Promise<CognigyWebchatInstance>;

    initWebRTCWidget: (
      endpoint: string
    ) => void;
  }
}

