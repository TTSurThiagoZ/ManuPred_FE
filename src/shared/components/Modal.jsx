// src/components/LoadingModal/index.jsx
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
        <Lottie 
          animationData={loadingAnimation} 
          loop={true} 
          autoplay={true}
        />
        {/* Opcional: um texto de carregamento */}
        <p>Carregando...</p>
      </div>
    </div>
  );
};