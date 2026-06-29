import React from 'react';
import { Link } from 'react-router-dom';

const BrowsePage: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Catálogo de Séries</h2>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
        Escolha uma série para começar a praticar.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/watch/demo123" style={{
          display: 'block',
          padding: '1rem',
          background: 'var(--color-bg-elevated)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--glass-border)'
        }}>
          <h3>Friends - S01E01</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Nível: Intermediário</p>
        </Link>
      </div>
    </div>
  );
};

export default BrowsePage;
