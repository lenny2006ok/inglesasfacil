import { useState, useEffect, useRef, useCallback } from 'react';

interface SpeechResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState<SpeechResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSupport, setHasSupport] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    const speechRecognitionWindow = window as Window & typeof globalThis & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const SpeechRecognitionCtor = speechRecognitionWindow.SpeechRecognition || speechRecognitionWindow.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setHasSupport(false);
      setError('Seu navegador não suporta a Web Speech API. Tente usar o Google Chrome.');
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = 'en-US';
    recognition.interimResults = true; // Feedback em tempo real
    recognition.continuous = false;    // Para de ouvir após o silêncio
    recognition.maxAlternatives = 3;

    recognition.onresult = (event: any) => {
      const last = event.results[event.results.length - 1];
      setResult({
        transcript: last[0].transcript,
        confidence: last[0].confidence,
        isFinal: last.isFinal,
      });
    };

    recognition.onerror = (event: any) => {
      setError(`Erro no reconhecimento de voz: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      setError(null);
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Reconhecimento já estava em andamento', err);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  return { isListening, transcript: result?.transcript ?? '', result, error, hasSupport, startListening, stopListening };
}
