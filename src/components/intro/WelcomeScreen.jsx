export default function WelcomeScreen({ onAdvance }) {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center text-center p-8 overflow-hidden bg-[#241F1A]">
      <div className="splash-noise absolute inset-0 pointer-events-none" />
      <div className="absolute -top-40 -right-32 w-[600px] h-[600px] rounded-full bg-[#F39400] blur-[140px] opacity-40 pointer-events-none" />
      <div className="absolute -bottom-48 -left-32 w-[480px] h-[480px] rounded-full bg-[#843B0F] blur-[120px] opacity-50 pointer-events-none" />

      <img
        src="/kipper-logo.svg"
        alt="Kipper"
        className="relative z-10 w-24 h-24 mb-7 drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)]"
      />

      <h1 className="relative z-10 font-serif text-4xl text-white leading-tight mb-3">
        <div>Sistema de Manutenção</div>
        <div>Predial</div>
      </h1>

      <p className="relative z-10 font-body text-base text-white/80 max-w-[280px] mb-10">
        Gestão e manutenção, sempre à disposição.
      </p>

      <button
        onClick={onAdvance}
        className="relative z-10 w-full max-w-[300px] py-[0.95rem] px-6 rounded-2xl bg-white text-[#843B0F] font-body text-base font-semibold cursor-pointer transition duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-lg"
      >
        Avançar
      </button>
    </div>
  );
}