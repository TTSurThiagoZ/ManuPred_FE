// Modal global de carregamento (Lottie) — aparece em toda requisição à API, em qualquer tela.
import React from 'react';
import { Lottie } from 'lottie-react';
import loadingAnimation from '../../assets/loading.json'; // Seu arquivo Lottie
import './styles.css'; // Ou use Tailwind, Styled Components, etc.
import { useLoading } from '../../context/ContextProvider';

export const Modal = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="loading-overlay">
      <div className="lottie-container">
        {/* No lottie-react 3.x a animação vai na prop "src" (a antiga "animationData" não existe mais) */}
        <Lottie
          src={loadingAnimation}
          loop={true} 
          autoplay={true}
        />
        {/* Opcional: um texto de carregamento */}
        <p>Carregando...</p>
      </div>
    </div>
  );
};