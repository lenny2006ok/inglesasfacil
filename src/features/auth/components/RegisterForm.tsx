import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export const RegisterForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validatePassword = (pass: string) => {
    // 8 a 15 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 símbolo especial
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
    return regex.test(pass);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setError('A senha deve ter entre 8 e 15 caracteres, contendo pelo menos uma letra maiúscula, uma minúscula, um número e um símbolo especial (@$!%*?&).');
      return;
    }
    setError('');
    // Simulação de cadastro
    alert('Cadastro realizado com sucesso!');
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', background: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--glass-border)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Criar Conta</h2>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Novo Usuário</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required
            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'var(--color-bg-secondary)', color: 'white' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Senha</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => { setPassword(e.target.value); setError(''); }} 
            required
            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)', background: 'var(--color-bg-secondary)', color: 'white' }}
          />
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
            A senha deve ter 8 a 15 dígitos e incluir maiúsculas, minúsculas, números e símbolos.
          </p>
        </div>
        {error && <div style={{ color: 'var(--color-incorrect)', fontSize: '0.875rem', background: 'rgba(255,82,82,0.1)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>{error}</div>}
        <button type="submit" style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--color-primary-500)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 'bold' }}>
          Cadastrar
        </button>
      </form>
      <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
        Já tem uma conta? <Link to="/login" style={{ color: 'var(--color-primary-400)' }}>Faça login</Link>
      </p>
    </div>
  );
};
