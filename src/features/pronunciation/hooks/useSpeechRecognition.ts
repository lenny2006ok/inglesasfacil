import { useState, useEffect, useRef, useCallback } from 'react';

interface SpeechResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState<SpeechResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSupport, setHasSupport] = useState(true);
  
  // @ts-expect-error - SpeechRecognition is not fully typed in standard TS yet
  const recognitionRef = useRef<window.SpeechRecognition | null>(null);

  useEffect(() => {
    // @ts-expect-error - Vendor prefixes
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setHasSupport(false);
      setError('Seu navegador não suporta a Web Speech API. Tente usar o Google Chrome.');
      return;
    }

    const recognition = new SpeechRecognition();
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

  return { isListening, result, error, hasSupport, startListening, stopListening };
}
