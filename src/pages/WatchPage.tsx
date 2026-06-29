import React, { useMemo, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { VideoPlayer } from '../features/video-player/components/VideoPlayer';
import { PronunciationLab } from '../features/pronunciation/components/PronunciationLab';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const WatchPage: React.FC = () => {
  const { videoId } = useParams();
  const [searchParams] = useSearchParams();
  const [currentTime, setCurrentTime] = useState(0);

  const startTime = Number(searchParams.get('start') || 0);
  const durationSeconds = Number(searchParams.get('duration') || 15);
  const expectedPhrase = useMemo(() => searchParams.get('phrase') || 'Stay hungry stay foolish', [searchParams]);

  // Fallback para o Discurso de Stanford (sempre online e com legendas perfeitas)
  const activeVideoId = videoId && videoId !== 'demo123' ? videoId : 'UF8uR6Z6KLc';
  const clipLabel = startTime > 0 ? `Trecho de ${durationSeconds}s a partir de ${formatTime(startTime)}` : 'Vídeo completo';

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <Link to="/browse" style={{ color: 'var(--color-primary-400)', fontWeight: 'bold', textDecoration: 'none' }}>
        ← Voltar para o catálogo
      </Link>

      <div style={{
        marginTop: '1rem',
        padding: '1.25rem 1.5rem',
        background: 'linear-gradient(135deg, rgba(79,70,229,0.2), rgba(6,182,212,0.16))',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <div>
          <p style={{ margin: 0, color: 'var(--color-primary-400)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.78rem' }}>
            Prática guiada
          </p>
          <h2 style={{ margin: '0.25rem 0', color: 'white' }}>Praticando uma cena</h2>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>{clipLabel}</p>
        </div>
        <div style={{ padding: '0.6rem 0.9rem', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', color: 'white', fontWeight: 600 }}>
          🎤 {expectedPhrase}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
        <VideoPlayer
          videoId={activeVideoId}
          startTime={startTime}
          durationSeconds={durationSeconds}
          onTimeUpdate={(time) => setCurrentTime(time)}
        />

        <PronunciationLab expectedText={expectedPhrase} />
      </div>

      <div style={{ marginTop: '1.5rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
        <p style={{ margin: 0 }}>Tempo atual do vídeo: {currentTime.toFixed(2)}s</p>
      </div>
    </div>
  );
};

export default WatchPage;
