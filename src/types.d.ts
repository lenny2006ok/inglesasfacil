/// <reference types="vite/client" />

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}
export {};
