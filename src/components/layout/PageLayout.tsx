import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { SearchInput } from '../ui/SearchInput';
import { useAuth } from '../../features/auth/context/AuthContext';

const PageLayout: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{ 
        padding: '1rem 2rem', 
        borderBottom: '1px solid var(--glass-border)',
        background: 'var(--color-bg-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem'
      }}>
        <Link to="/" style={{ fontSize: '1.25rem', color: 'var(--color-primary-400)', fontWeight: 'bold' }}>
          🎬 InglesAsFácil
        </Link>
        
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <SearchInput />
        </div>

        <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ color: 'var(--color-text-secondary)', fontWeight: 'bold' }}>Olá, {user.username}</span>
              <button onClick={logout} style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--color-accent-500)', color: 'var(--color-accent-500)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>Sair</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ padding: '0.5rem 1rem', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-md)' }}>Entrar</Link>
              <Link to="/register" style={{ padding: '0.5rem 1rem', background: 'var(--color-primary-500)', color: 'white', borderRadius: 'var(--radius-md)' }}>Cadastrar</Link>
            </>
          )}
        </nav>
      </header>
      
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      
      <footer style={{ 
        padding: '2rem', 
        textAlign: 'center', 
        color: 'var(--color-text-muted)',
        borderTop: '1px solid var(--glass-border)'
      }}>
        InglesAsFácil &copy; 2026
      </footer>
    </div>
  );
};

export default PageLayout;
