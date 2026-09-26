import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SplashScreen from "./splash/SplashScreen";
import WelcomeScreen from "./components/intro/WelcomeScreen";
import LoginScreen from "./components/auth/LoginScreen";
import OAuth2Handler from "./components/auth/OAuth2Handler";
import UserDashboard from "./components/chamados/UserDashboard";
import NovoChamado from "./components/chamados/NovoChamado";
import AdminChamados from "./components/admin/AdminChamados";
import AdminUsuarios from "./components/admin/AdminUsuarios";

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

const initialTickets = [
  {
    id: "0512",
    titulo: "Vazamento no encanamento do banheiro",
    status: "andamento",
    tipo: "Hidráulico",
    local: "Sala 12",
    patrimonio: "4821",
    descricao: "Está vazando água constantemente embaixo da pia do banheiro da sala 12, formando poça no chão.",
    anexos: 2,
    abertoPor: "Ana Souza",
    abertoPorId: "1043",
    dataAbertura: "12/08/2026",
  },
];

function App() {
  const [tickets, setTickets] = useState(initialTickets);
  const navigate = useNavigate();

  const addTicket = (data) => {
    const novo = {
      id: String(1000 + tickets.length + 1),
      status: "aberto",
      anexos: 0,
      abertoPor: "Ana Souza",
      abertoPorId: "1043",
      dataAbertura: new Date().toLocaleDateString("pt-BR"),
      ...data,
    };
    setTickets((prev) => [novo, ...prev]);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Routes>
      <Route path="/" element={<OnboardingFlow />} />
      <Route path="/oauth2/redirect" element={<OAuth2Handler />} />
      <Route path="/chamados" element={<UserDashboard tickets={tickets} onLogout={handleLogout} />} />
      <Route path="/chamados/novo" element={<NovoChamado onSubmit={addTicket} onLogout={handleLogout} />} />
      <Route path="/admin/chamados" element={<AdminChamados onLogout={handleLogout} />} />
      <Route path="/admin/usuarios" element={<AdminUsuarios onLogout={handleLogout} />} />
    </Routes>
  );
}

export default App;