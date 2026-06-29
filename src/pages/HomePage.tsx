import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>🎬 InglesAsFácil</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginTop: '1rem' }}>
        Aprenda inglês com suas séries e filmes favoritos.
      </p>
      
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link to="/browse" style={{ 
          background: 'var(--color-primary-500)', 
          color: 'white', 
          padding: '0.75rem 1.5rem', 
          borderRadius: 'var(--radius-md)' 
        }}>
          Explorar Catálogo
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
