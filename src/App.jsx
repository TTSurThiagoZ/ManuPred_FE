import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Providers e Modais Globais


// Importação das Páginas de acordo com a estrutura da imagem
import SplashScreen from './pages/splash/SplashScreen';
import ChamadosPage from './pages/chamados/ChamadosPage';
import ChamadoDetailPage from './pages/chamados/[id]/ChamadoDetailPage';
import NovoChamadoPage from './pages/novochamado/NovoChamadoPage';
import { LoadingProvider } from './context/ContextProvider';
import { Modal } from './shared/components/Modal';

function App() {
  return (
    <LoadingProvider>
      {/* Modal global de carregamento acionado pelo interceptor */}
      <Modal />

      <BrowserRouter>
        <Routes>
          {/* Ecrã Inicial / Splash */}
          <Route path="/" element={<SplashScreen />} />

          {/* Lista de Chamados */}
          <Route path="/chamados" element={<ChamadosPage />} />

          {/* Criação de Novo Chamado */}
          <Route path="/chamados/novo" element={<NovoChamadoPage />} />
          {/* Ou caso prefiras a rota simples: <Route path="/novochamado" element={<NovoChamadoPage />} /> */}

          {/* Detalhe do Chamado (com parâmetro dinâmico :id) */}
          <Route path="/chamados/:id" element={<ChamadoDetailPage />} />

          {/* Redirecionamento de segurança para rotas desconhecidas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LoadingProvider>
  );
}

export default App;