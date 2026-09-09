export default function SplashScreen() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#241F1A]">
      <div className="splash-noise absolute inset-0 pointer-events-none" />
      <div className="absolute -top-40 -right-32 w-[600px] h-[600px] rounded-full bg-[#F39400] blur-[140px] opacity-40 pointer-events-none" />
      <div className="absolute -bottom-48 -left-32 w-[480px] h-[480px] rounded-full bg-[#843B0F] blur-[120px] opacity-50 pointer-events-none" />

      <img src="/kipper-logo.svg" alt="Kipper" className="relative z-10 w-20 h-20 mb-8 drop-shadow-xl" />
      <h1 className="relative z-10 font-serif text-4xl text-white mb-2 leading-tight">Kipper</h1>
      <p className="relative z-10 font-body text-sm text-white/80 mb-10">Gestão de Manutenção</p>

      <div className="relative z-10 flex gap-2">
        <span className="w-2 h-2 rounded-full bg-white/70 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 rounded-full bg-white/70 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 rounded-full bg-white/70 animate-bounce" />
      </div>
    </div>
  );
}