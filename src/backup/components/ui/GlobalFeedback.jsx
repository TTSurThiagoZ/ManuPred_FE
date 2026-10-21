import { useState, useEffect } from "react";
import Lottie from "lottie-react";

// Estes ficheiros devem ser descarregados do LottieFiles e colocados na pasta assets
//import loadingAnimation from "../../assets/lottie/loading.json";
//import successAnimation from "../../assets/lottie/success.json";
//import errorAnimation from "../../assets/lottie/error.json";


export default function GlobalFeedback() {
  const [feedbackState, setFeedbackState] = useState({ status: 'idle', message: '' });

  useEffect(() => {
    const handleApiStatus = (event) => {
      const { status, message } = event.detail;
      setFeedbackState({ status, message });

      // Se for sucesso ou erro, remove o feedback do ecrã após 2.5 segundos
      if (status === 'success' || status === 'error') {
        setTimeout(() => {
          setFeedbackState({ status: 'idle', message: '' });
        }, 2500);
      }
    };

    window.addEventListener('api-status', handleApiStatus);
    return () => window.removeEventListener('api-status', handleApiStatus);
  }, []);

  if (feedbackState.status === 'idle') return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all">
      <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center max-w-xs text-center">
        <div className="w-32 h-32 flex items-center justify-center">
          {feedbackState.status === 'loading' && <Lottie animationData={loadingAnimation} loop={true} />}
          {feedbackState.status === 'success' && <Lottie animationData={successAnimation} loop={false} />}
          {feedbackState.status === 'error' && <Lottie animationData={errorAnimation} loop={false} />}
        </div>
        
        {feedbackState.status === 'loading' && <p className="mt-4 font-medium text-gray-600">A carregar...</p>}
        {feedbackState.status === 'success' && <p className="mt-4 font-medium text-green-600">Concluído!</p>}
        {feedbackState.status === 'error' && (
          <p className="mt-4 font-medium text-red-600">{feedbackState.message || "Ocorreu um erro!"}</p>
        )}
      </div>
    </div>
  );
}