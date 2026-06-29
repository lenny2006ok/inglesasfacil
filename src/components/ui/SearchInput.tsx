import React from 'react';
import { useNavigate } from 'react-router-dom';

export const SearchInput: React.FC = () => {
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('q');
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query as string)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', position: 'relative', width: '300px' }}>
      <input 
        name="q"
        type="text" 
        placeholder="Buscar séries, filmes ou frases..." 
        style={{
          width: '100%',
          padding: '0.5rem 1rem 0.5rem 2.5rem',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--glass-border)',
          background: 'var(--color-bg-elevated)',
          color: 'var(--color-text-primary)',
          outline: 'none'
        }}
      />
      <span style={{ position: 'absolute', left: '0.75rem', fontSize: '1rem', color: 'var(--color-text-muted)' }}>
        🔍
      </span>
    </form>
  );
};
