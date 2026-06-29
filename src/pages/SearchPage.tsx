import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

// Mock de dados que estariam no PostgreSQL
const MOCK_SCENES = [
  { id: '1', videoId: 'demo123', series: 'Friends', episode: 'S01E01', textEn: "I'll be there for you", level: 'Intermediário', time: '0:45' },
  { id: '2', videoId: 'demo123', series: 'Friends', episode: 'S01E01', textEn: 'How you doin?', level: 'Básico', time: '1:12' },
  { id: '3', videoId: 'eaEMSKzqGAg', series: 'Star Wars', episode: 'Ep 3', textEn: 'Hello there', level: 'Básico', time: '0:02' },
  { id: '4', videoId: 'YQHsXMglC9A', series: 'Adele', episode: 'Music Video', textEn: 'Hello, it\'s me', level: 'Básico', time: '1:15' },
  { id: '5', videoId: 'UF8uR6Z6KLc', series: 'Steve Jobs', episode: 'Stanford', textEn: 'Stay hungry stay foolish', level: 'Avançado', time: '14:30' },
  { id: '6', videoId: 'other', series: 'The Office', episode: 'S02E01', textEn: 'That is what she said', level: 'Básico', time: '5:00' }
];

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState(MOCK_SCENES);

  useEffect(() => {
    if (query) {
      const lowerQuery = query.toLowerCase();
      // Simula o Full-Text Search do PostgreSQL
      const filtered = MOCK_SCENES.filter(scene => 
        scene.textEn.toLowerCase().includes(lowerQuery) || 
        scene.series.toLowerCase().includes(lowerQuery)
      );
      setResults(filtered);
    } else {
      setResults(MOCK_SCENES);
    }
  }, [query]);

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Resultados da Busca</h2>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
        {query ? `Mostrando resultados para "${query}"` : 'Mostrando todas as cenas disponíveis'}
      </p>

      {results.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-md)' }}>
          <p>Nenhuma cena encontrada. Tente buscar por "Friends" ou "there for you".</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {results.map((scene) => (
            <Link key={scene.id} to={`/watch/${scene.videoId}`} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.5rem',
              background: 'var(--color-bg-elevated)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--glass-border)',
              color: 'white'
            }}>
              <div>
                <h3 style={{ margin: 0, color: 'var(--color-primary-400)' }}>{scene.series} - {scene.episode}</h3>
                <p style={{ fontStyle: 'italic', margin: '0.5rem 0 0 0' }}>"{scene.textEn}"</p>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                <p>Nível: {scene.level}</p>
                <p>Início: {scene.time}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
