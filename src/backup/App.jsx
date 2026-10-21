import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SplashScreen from "./splash/SplashScreen";
import WelcomeScreen from "./components/intro/WelcomeScreen";
import LoginScreen from "./components/auth/LoginScreen";
import OAuth2Handler from "./components/auth/OAuth2Handler";
import RequireRole from "./components/auth/RequireRole";
import UserDashboard from "./components/chamados/UserDashboard";
import NovoChamado from "./components/chamados/NovoChamado";
import ChamadoDetail from "./components/chamados/ChamadoDetail";
import TecnicoDashboard from "./components/tecnico/TecnicoDashboard";
import TecnicoFinalizados from "./components/tecnico/TecnicoFinalizados";
import AdminChamados from "./components/admin/AdminChamados";
import AdminUsuarios from "./components/admin/AdminUsuarios";
import { ChamadosProvider } from "./context/ChamadosProvider";

function OnboardingFlow() {
  const [stage, setStage] = useState("splash");
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowIntro(true), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (showIntro && stage === "splash") setStage("intro");
  }, [showIntro, stage]);

  if (stage === "splash" || stage === "intro") {
    return (
      <div className="relative w-full min-h-screen">
        <div className={`absolute inset-0 transition-opacity duration-500 ${showIntro ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          <SplashScreen />
        </div>
        <div className={`absolute inset-0 transition-opacity duration-500 ${showIntro ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <WelcomeScreen onAdvance={() => setStage("login")} />
        </div>
      </div>
    );
  }

  return <LoginScreen onLogin={(data) => console.log("Login:", data)} />;
}

function App() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <ChamadosProvider>
      <Routes>
        <Route path="/" element={<OnboardingFlow />} />
        <Route path="/oauth2/redirect" element={<OAuth2Handler />} />

        {/* Rotas dos Chamados */}
        <Route path="/chamados" element={
          <RequireRole allowed={["usuario"]}>
            <UserDashboard onLogout={handleLogout} />
          </RequireRole>
        } />
        <Route path="/chamados/novo" element={
          <RequireRole allowed={["usuario"]}>
            <NovoChamado onLogout={handleLogout} />
          </RequireRole>
        } />
        <Route path="/chamados/:id" element={<ChamadoDetail />} />

        {/* Rotas do Técnico */}
        <Route path="/tecnico" element={
          <RequireRole allowed={["tecnico"]}>
            <TecnicoDashboard onLogout={handleLogout} />
          </RequireRole>
        } />
        <Route path="/tecnico/finalizados" element={
          <RequireRole allowed={["tecnico"]}>
            <TecnicoFinalizados onLogout={handleLogout} />
          </RequireRole>
        } />

        {/* Rotas do Admin */}
        <Route path="/admin/chamados" element={
          <RequireRole allowed={["admin"]}>
            <AdminChamados onLogout={handleLogout} />
          </RequireRole>
        } />
        <Route path="/admin/usuarios" element={
          <RequireRole allowed={["admin"]}>
            <AdminUsuarios onLogout={handleLogout} />
          </RequireRole>
        } />
      </Routes>
    </ChamadosProvider>
  );
}

export default App;