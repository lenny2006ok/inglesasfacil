import React, { useEffect, useState } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { scorePronunciation, type WordScore } from '../utils/phonemeComparer';

interface PronunciationLabProps {
  expectedText: string;
}

export const PronunciationLab: React.FC<PronunciationLabProps> = ({ expectedText }) => {
  const { isListening, transcript, startListening, stopListening, hasSupport } = useSpeechRecognition();
  const [wordScores, setWordScores] = useState<WordScore[]>([]);
  const [overallScore, setOverallScore] = useState<number | null>(null);

  useEffect(() => {
    if (!isListening && transcript) {
      const { overallScore: evaluatedScore, wordScores: evaluatedWords } = scorePronunciation(expectedText, transcript);
      setOverallScore(evaluatedScore);
      setWordScores(evaluatedWords);
    }
  }, [isListening, transcript, expectedText]);

  if (!hasSupport) {
    return (
      <div style={{ padding: '2rem', background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
        ⚠️ Seu navegador não suporta reconhecimento de voz. Tente usar o Google Chrome.
      </div>
    );
  }

  return (
    <div style={{
      padding: '2.5rem',
      background: 'var(--color-bg-elevated)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--glass-border)',
      boxShadow: 'var(--shadow-lg)',
      marginTop: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2rem'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ color: 'var(--color-primary-400)', marginBottom: '0.5rem', fontSize: '1.5rem' }}>Pratique sua Pronúncia</h3>
        <p style={{ color: 'var(--color-text-muted)' }}>Ouça a cena e tente repetir a frase abaixo:</p>
      </div>

      <div style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        color: 'white',
        padding: '1.5rem 3rem',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 'var(--radius-md)',
        border: '1px dashed var(--color-primary-500)',
        textAlign: 'center'
      }}>
        "{expectedText}"
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <button
          onMouseDown={startListening}
          onMouseUp={stopListening}
          onTouchStart={startListening}
          onTouchEnd={stopListening}
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            border: 'none',
            background: isListening ? 'var(--color-accent-500)' : 'var(--color-primary-500)',
            color: 'white',
            fontSize: '3rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isListening ? '0 0 30px var(--color-accent-500)' : '0 10px 25px rgba(0,0,0,0.5)',
            transition: 'all 0.3s ease',
            animation: isListening ? 'pulse 1.5s infinite' : 'none',
            outline: 'none'
          }}
          title="Segure para falar"
        >
          🎤
        </button>
        <p style={{ color: 'var(--color-text-secondary)', fontWeight: 'bold' }}>
          {isListening ? 'Gravando... Solte para finalizar' : 'Segure o botão para falar'}
        </p>
      </div>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
            70% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
          }
        `}
      </style>

      {transcript && !isListening && (
        <div style={{ width: '100%', marginTop: '1rem', padding: '1.5rem', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-md)' }}>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>Seu resultado:</h4>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.25rem' }}>
            {wordScores.map((score, index) => {
              let color = 'var(--color-accent-500)'; // vermelho (ruim)
              if (score.score > 80) color = 'var(--color-success-500)'; // verde (ótimo)
              else if (score.score > 50) color = 'var(--color-warning-500)'; // amarelo (médio)

              return (
                <span key={index} style={{ color, fontWeight: 'bold', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                  {score.word}
                </span>
              );
            })}
          </div>

          {overallScore !== null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ flex: 1, height: '10px', background: 'var(--color-bg-tertiary)', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${overallScore}%`, 
                  height: '100%', 
                  background: overallScore > 80 ? 'var(--color-success-500)' : overallScore > 50 ? 'var(--color-warning-500)' : 'var(--color-accent-500)',
                  transition: 'width 1s ease-in-out'
                }} />
              </div>
              <span style={{ fontWeight: 'bold', fontSize: '1.25rem', color: 'white' }}>
                {Math.round(overallScore)}%
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
