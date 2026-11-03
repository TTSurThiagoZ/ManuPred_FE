import { useEffect } from 'react';
import { useUserStore } from '../../store/user';
import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {
  const fetchMe = useUserStore((state) => state.fetchMe);
  
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMe().then(() => { navigate('/chamados'); }).catch(() => { navigate('/login'); });
    }, 1000); // Executa após 1 segundo (1000 ms)

    // Limpa o temporizador se o componente for desmontado antes de 1s
    return () => clearTimeout(timer);
  }, [fetchMe]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#241F1A]">
      <div className="splash-noise absolute inset-0 pointer-events-none" />
      <div className="absolute -top-40 -right-32 w-[600px] h-[600px] rounded-full bg-[#F39400] blur-[140px] opacity-40 pointer-events-none" />
      <div className="absolute -bottom-48 -left-32 w-[480px] h-[480px] rounded-full bg-[#843B0F] blur-[120px] opacity-50 pointer-events-none" />

      <img src="/kipper-logo.svg" alt="Kipper" className="relative z-10 w-20 h-20 mb-8 drop-shadow-xl" />
      
      {/* Classe text-center adicionada e <br /> inserido antes de Predial */}
      <h1 className="relative z-10 font-serif text-4xl text-white mb-2 leading-tight text-center">
        Sistema de Manutenção <br /> Predial
      </h1>
      
      <p className="relative z-10 font-body text-sm text-white/80 mb-10">Gestão de Manutenção</p>

      <div className="relative z-10 flex gap-2">
        <span className="w-2 h-2 rounded-full bg-white/70 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 rounded-full bg-white/70 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 rounded-full bg-white/70 animate-bounce" />
      </div>
    </div>
  );
}