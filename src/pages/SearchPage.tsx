import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

type SceneResult = {
  id: string;
  videoId: string;
  series: string;
  episode: string;
  textEn: string;
  level: string;
  startTime: number;
  duration: number;
};

const MOCK_SCENES: SceneResult[] = [
  { id: '1', videoId: 'demo123', series: 'Friends', episode: 'S01E01', textEn: "I'll be there for you", level: 'Intermediário', startTime: 45, duration: 15 },
  { id: '2', videoId: 'demo123', series: 'Friends', episode: 'S01E01', textEn: 'How you doin?', level: 'Básico', startTime: 72, duration: 15 },
  { id: '3', videoId: 'eaEMSKzqGAg', series: 'Star Wars', episode: 'Ep 3', textEn: 'Hello there', level: 'Básico', startTime: 2, duration: 15 },
  { id: '4', videoId: 'YQHsXMglC9A', series: 'Adele', episode: 'Music Video', textEn: "Hello, it's me", level: 'Básico', startTime: 75, duration: 15 },
  { id: '5', videoId: 'UF8uR6Z6KLc', series: 'Steve Jobs', episode: 'Stanford', textEn: 'Stay hungry stay foolish', level: 'Avançado', startTime: 870, duration: 15 },
  { id: '6', videoId: 'other', series: 'The Office', episode: 'S02E01', textEn: 'That is what she said', level: 'Básico', startTime: 300, duration: 15 }
];

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState(MOCK_SCENES);

  useEffect(() => {
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      const filtered = MOCK_SCENES.filter(scene =>
        scene.textEn.toLowerCase().includes(lowerQuery) ||
        scene.series.toLowerCase().includes(lowerQuery) ||
        scene.episode.toLowerCase().includes(lowerQuery)
      );
      setResults(filtered);
    } else {
      setResults(MOCK_SCENES);
    }
  }, [query]);

  const summaryText = useMemo(() => {
    if (!query.trim()) return 'Explore cenas curtas e trechos prontos para praticar.';
    return `Mostrando ${results.length} resultado${results.length === 1 ? '' : 's'} para “${query}”.`;
  }, [query, results.length]);

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{
        padding: '1.5rem 1.75rem',
        background: 'linear-gradient(135deg, rgba(79,70,229,0.25), rgba(6,182,212,0.2))',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)',
        marginBottom: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <div>
          <p style={{ margin: 0, color: 'var(--color-primary-400)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.8rem' }}>
            Busca inteligente
          </p>
          <h2 style={{ margin: '0.25rem 0', color: 'white' }}>Resultados da busca</h2>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>{summaryText}</p>
        </div>
        <div style={{
          padding: '0.7rem 1rem',
          borderRadius: '999px',
          background: 'rgba(255,255,255,0.08)',
          color: 'var(--color-text-primary)',
          fontWeight: 600
        }}>
          🎬 {results.length} trechos prontos
        </div>
      </div>

      {results.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>Nenhuma cena encontrada. Tente buscar por “Friends”, “there for you” ou “Stanford”.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {results.map((scene) => {
            const watchUrl = `/watch/${scene.videoId}?start=${scene.startTime}&duration=${scene.duration}&phrase=${encodeURIComponent(scene.textEn)}`;
            return (
              <Link key={scene.id} to={watchUrl} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.25rem 1.5rem',
                background: 'var(--color-bg-elevated)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--glass-border)',
                color: 'white',
                textDecoration: 'none',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                    <span style={{ padding: '0.3rem 0.6rem', borderRadius: '999px', background: 'rgba(99,102,241,0.2)', color: 'var(--color-primary-400)', fontSize: '0.8rem', fontWeight: 600 }}>
                      {scene.level}
                    </span>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{scene.series} • {scene.episode}</span>
                  </div>
                  <h3 style={{ margin: 0, color: 'var(--color-primary-400)' }}>{scene.textEn}</h3>
                  <p style={{ margin: '0.4rem 0 0', color: 'var(--color-text-secondary)' }}>Trecho de 15 segundos para praticar pronúncia.</p>
                </div>
                <div style={{ textAlign: 'right', minWidth: '120px' }}>
                  <p style={{ margin: 0, fontWeight: 700, color: 'white' }}>⏱ {formatTime(scene.startTime)}</p>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>▶ Ver trecho</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
