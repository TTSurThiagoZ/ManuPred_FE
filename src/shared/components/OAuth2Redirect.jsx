import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { userService } from '../services/userService';
import { useUserStore } from '../../store/user';

export function OAuth2Redirect(props) {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const setAuth = useUserStore((state) => state.setAuth); // Obtém a função setAuth do Zustand

  useEffect(() => {
    try {
    
      console.log(searchParams);

      // Obtém o token enviado via parâmetro de URL (ex: ?token=XYZ ou ?access_token=XYZ)
      const token = searchParams.get('token') || searchParams.get('access_token');

      userService
        .getMe()
        .then((me) => {
          // Salva token e dados do usuário no Zustand
          setAuth(token, me);

          if (me.status === 'NOT_CONFIRMED') {
            //navigate('/cadastro', { replace: true });
            userService.setToken({ token: props.token, nome: me.nome }).catch(console.log);
            
          } else {
            // Caso você utilize envio de token do Firebase (FCM) como no exemplo da tela:
            // userService.setToken({ token: fcmToken, nome: me.nome }).catch(console.log);
            navigate('/dashboard', { replace: true });
          }
        })
        .catch((err) => {
          console.error(err);
          setError('Erro ao carregar os dados do usuário.');
          navigate('/login', { replace: true });
        });

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
  }, [searchParams, navigate]);



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