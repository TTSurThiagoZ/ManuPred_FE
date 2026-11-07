import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function OAuth2Redirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(location.search);
      
      // Obtém o token enviado via parâmetro de URL (ex: ?token=XYZ ou ?access_token=XYZ)
      const token = searchParams.get('token') || searchParams.get('access_token');

      if (token) {
        // Grava no localStorage sob a chave 'token'
        localStorage.setItem('token', token);

        // Redireciona para o aplicativo e remove a URL com token do histórico
        navigate('/dashboard', { replace: true });
      } else {
        setError('Nenhum token foi encontrado nos parâmetros da URL.');
      }
    } catch (err) {
      setError('Erro ao processar o token de autenticação.');
    }
  }, [location, navigate]);

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Erro na Autenticação</h2>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={() => navigate('/login')}>Voltar para o Login</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Autenticando, aguarde um momento...</p>
    </div>
  );
}