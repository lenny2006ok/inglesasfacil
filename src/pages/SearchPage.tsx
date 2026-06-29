import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

type SceneResult = {
  id: string;
  title: string;
  channelTitle: string;
  description: string;
  thumbnailUrl: string;
  startTime: number;
  durationSeconds: number;
  phrase: string;
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SceneResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadResults = async () => {
      if (!query.trim()) {
        setResults([]);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}&maxResults=6`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Não foi possível buscar vídeos no YouTube.');
        }

        setResults((data.results || []).map((item: any) => ({
          id: item.id,
          title: item.title,
          channelTitle: item.channelTitle,
          description: item.description,
          thumbnailUrl: item.thumbnailUrl,
          startTime: item.startTime,
          durationSeconds: item.durationSeconds,
          phrase: item.phrase,
        })));
      } catch (err) {
        setResults([]);
        setError(err instanceof Error ? err.message : 'Erro inesperado na busca.');
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [query]);

  const summaryText = useMemo(() => {
    if (!query.trim()) return 'Pesquise por uma palavra, frase ou tema e vamos buscar trechos reais do YouTube.';
    if (loading) return 'Buscando vídeos no YouTube…';
    if (error) return error;
    return `Mostrando ${results.length} resultado${results.length === 1 ? '' : 's'} para “${query}”.`;
  }, [query, results.length, loading, error]);

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
            Busca no YouTube
          </p>
          <h2 style={{ margin: '0.25rem 0', color: 'white' }}>Resultados reais do YouTube</h2>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>{summaryText}</p>
        </div>
        <div style={{
          padding: '0.7rem 1rem',
          borderRadius: '999px',
          background: 'rgba(255,255,255,0.08)',
          color: 'var(--color-text-primary)',
          fontWeight: 600
        }}>
          ▶ {loading ? 'Carregando…' : `${results.length} trechos`}
        </div>
      </div>

      {loading && (
        <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>Buscando vídeos e preparando o trecho de 15 segundos…</p>
        </div>
      )}

      {!loading && !error && results.length === 0 && query.trim() && (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>Nenhum vídeo encontrado para essa busca. Tente outra palavra ou frase.</p>
        </div>
      )}

      {!loading && !error && results.length > 0 && (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {results.map((scene) => {
            const watchUrl = `/watch/${scene.id}?start=${scene.startTime}&duration=${scene.durationSeconds}&phrase=${encodeURIComponent(scene.phrase)}`;
            return (
              <Link key={scene.id} to={watchUrl} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem 1.25rem',
                background: 'var(--color-bg-elevated)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--glass-border)',
                color: 'white',
                textDecoration: 'none',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                  {scene.thumbnailUrl && (
                    <img src={scene.thumbnailUrl} alt={scene.title} style={{ width: '120px', height: '68px', objectFit: 'cover', borderRadius: '0.75rem' }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                      <span style={{ padding: '0.3rem 0.6rem', borderRadius: '999px', background: 'rgba(99,102,241,0.2)', color: 'var(--color-primary-400)', fontSize: '0.8rem', fontWeight: 600 }}>
                        YouTube
                      </span>
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{scene.channelTitle}</span>
                    </div>
                    <h3 style={{ margin: 0, color: 'var(--color-primary-400)', fontSize: '1rem' }}>{scene.title}</h3>
                    <p style={{ margin: '0.35rem 0 0', color: 'var(--color-text-secondary)' }}>{scene.description}</p>
                  </div>
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
