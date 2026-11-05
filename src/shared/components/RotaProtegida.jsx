// Protege as rotas internas (usado no App.jsx).
// Sem token vai para /login; se der F5 carrega o /me; role não permitida volta para a tela inicial da role.

import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore } from '../../store/user';
import { getPerfil } from '../../utils/perfis';

export default function RotaProtegida({ permitido, children }) {
  const user = useUserStore((state) => state.user);
  const fetchMe = useUserStore((state) => state.fetchMe);
  const token = localStorage.getItem('token');
  const [verificando, setVerificando] = useState(!user && !!token);

  useEffect(() => {
    if (!user && token) {
      fetchMe()
        .catch(() => {})
        .finally(() => setVerificando(false));
    }
  }, [user, token, fetchMe]);

  if (!token) return <Navigate to="/login" replace />;

  // Enquanto o /me carrega, o Modal global de loading já aparece por cima
  if (verificando) return <div className="min-h-screen bg-[#241F1A]" />;

  if (!user) return <Navigate to="/login" replace />;

  if (permitido && !permitido.includes(user.role)) {
    return <Navigate to={getPerfil(user.role).telaInicial} replace />;
  }

  return children;
}
