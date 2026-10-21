export default function HomeScreen() {
  const token = localStorage.getItem("token");

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-3 bg-paper px-8 text-center">
      <h1 className="font-heading text-2xl font-bold text-ink-strong">Home</h1>
      <p className="font-body text-sm text-ink-faint max-w-xs">
        Login realizado — esta é uma tela provisória até as telas de chamados serem implementadas.
      </p>
      {token && (
        <p className="font-body text-xs text-placeholder break-all max-w-xs mt-2">
          Token salvo: {token}
        </p>
      )}
    </div>
  );
}