// Retorno do login com Google — rota: /oauth2/redirect (público)
// O back-end redireciona com ?token=...; a tela salva o token, carrega o /me e manda para a tela inicial da role.

import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUserStore } from '../../store/user';
import { getPerfil } from '../../utils/perfis';

export default function OAuth2Page() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fetchMe = useUserStore((state) => state.fetchMe);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    localStorage.setItem('token', token);
    fetchMe()
      .then((user) => navigate(getPerfil(user?.role).telaInicial, { replace: true }))
      .catch(() => navigate('/login', { replace: true }));
  }, [searchParams, navigate, fetchMe]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#241F1A]">
      <p className="font-body text-sm text-white/50">Entrando...</p>
    </div>
  );
}
