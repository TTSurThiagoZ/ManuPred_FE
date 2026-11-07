// Rotas da aplicação — públicas (/, /login, /oauth2/redirect) e internas protegidas por role com <RotaProtegida>.

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Providers e Modais Globais
import { LoadingProvider } from './context/ContextProvider';
import { Modal } from './shared/components/Modal';
import RotaProtegida from './shared/components/RotaProtegida';
import { USUARIO, TECNICO, ADMIN } from './utils/perfis';

// Páginas (uma pasta por tela dentro de src/pages)
import SplashScreen from './pages/splash/SplashScreen';
import LoginPage from './pages/login/LoginPage';
import OAuth2Page from './pages/oauth2/OAuth2Page';
import ChamadosPage from './pages/chamados/ChamadosPage';
import ChamadoDetailPage from './pages/chamados/[id]/ChamadoDetailPage';
import NovoChamadoPage from './pages/novochamado/NovoChamadoPage';
import PainelPage from './pages/painel/PainelPage';
import FinalizadosPage from './pages/finalizados/FinalizadosPage';
import TodosChamadosPage from './pages/todoschamados/TodosChamadosPage';
import UsuariosPage from './pages/usuarios/UsuariosPage';

function App() {
  return (
    <LoadingProvider>
      {/* Modal global de carregamento acionado pelo interceptor */}
      <Modal />

      <BrowserRouter>
        <Routes>
          {/* ===== Públicas ===== */}
          {/* Ecrã Inicial / Splash */}
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/oauth2/redirect" element={<OAuth2Page />} />

          {/* ===== Usuário ===== */}
          {/* Lista de Chamados */}
          <Route path="/chamados" element={<RotaProtegida permitido={[USUARIO]}><ChamadosPage /></RotaProtegida>} />

          {/* Criação de Novo Chamado */}
          <Route path="/chamados/novo" element={<RotaProtegida permitido={[USUARIO, ADMIN]}><NovoChamadoPage /></RotaProtegida>} />

          {/* Detalhe do Chamado (com parâmetro dinâmico :id) — qualquer usuário logado */}
          <Route path="/chamados/:id" element={<RotaProtegida><ChamadoDetailPage /></RotaProtegida>} />

          {/* ===== Técnico ===== */}
          <Route path="/painel" element={<RotaProtegida permitido={[TECNICO]}><PainelPage /></RotaProtegida>} />
          <Route path="/finalizados" element={<RotaProtegida permitido={[TECNICO]}><FinalizadosPage /></RotaProtegida>} />

          {/* ===== Admin ===== */}
          <Route path="/todoschamados" element={<RotaProtegida permitido={[ADMIN]}><TodosChamadosPage /></RotaProtegida>} />
          <Route path="/usuarios" element={<RotaProtegida permitido={[ADMIN]}><UsuariosPage /></RotaProtegida>} />

          {/* Redirecionamento de segurança para rotas desconhecidas */}
          <Route path="*" element={<Navigate to="/" replace />} />

          <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />

        </Routes>
      </BrowserRouter>
    </LoadingProvider>
  );
}

export default App;
