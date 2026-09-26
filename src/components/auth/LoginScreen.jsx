import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FEATURES = [];

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin?.({ email, password });
    navigate("/chamados");
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-100">
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-sm">
          <span className="font-body text-xs font-semibold text-amber-600 uppercase tracking-[0.2em]">
            Acesso
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-slate-900 mt-3 mb-3 leading-[1.05]">
            Bem-vindo <br />de volta
          </h1>
          <p className="font-body text-slate-500 text-base mb-10">
            Entre para acompanhar seus chamados de manutenção.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="font-body text-sm text-slate-800 mb-1.5 block">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 font-body text-slate-800 outline-none transition focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="font-body text-sm text-slate-800">
                  Senha
                </label>
                <a href="#" className="font-body text-xs text-slate-500 hover:text-amber-600 transition-colors">
                  Esqueceu a senha?
                </a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 font-body text-slate-800 outline-none transition focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-amber-600 text-white font-body font-semibold py-3.5 mt-4 transition hover:bg-amber-700 active:scale-[0.99]"
            >
              Entrar
            </button>
          </form>

          <p className="font-body text-xs text-slate-500 mt-10 text-center">
            Acesso exclusivo para colaboradores autorizados.
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-linear-to-br from-amber-500 to-amber-900 items-center justify-center p-16">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
                />

        <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
          <h2 className="font-serif text-3xl text-white mb-4 leading-tight">
            Manutenção,<br />sem complicação.
          </h2>
            <p className="font-serif text-sm text-white/80 text-left max-w-65 mb-10 leading-relaxed">
              Centralizamos a abertura, o acompanhamento e a resolução dos seus
              chamados — do pedido até a conclusão.
            </p>

          <div className="relative w-full max-w-70">
            <div className="absolute -top-6 -right-5 rotate-12 z-20">
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center animate-[floatSoft_4s_ease-in-out_infinite]">
                <span className="material-symbols-outlined text-white text-2xl">task_alt</span>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-6 -rotate-12 z-20">
              <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center animate-[floatSoft_5s_ease-in-out_infinite_0.6s]">
                <span className="material-symbols-outlined text-white text-xl">build</span>
              </div>
            </div>

            <div className="relative bg-white rounded-2xl shadow-2xl p-5 -rotate-2 text-left">
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Em andamento
                </span>
                <span className="text-[10px] text-slate-400 font-mono">#0512</span>
              </div>
              <p className="font-body text-sm font-semibold text-slate-800 mb-1">
                Ar-condicionado — Sala 12
              </p>
              <p className="font-body text-xs text-slate-400 mb-3">
                Técnico a caminho · previsão 40 min
              </p>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-amber-500 rounded-full" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-6 w-full">
            {FEATURES.map((f) => (
              <div key={f.text} className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3 text-left backdrop-blur-sm">
                <span className="material-symbols-outlined text-white/90 text-xl">{f.icon}</span>
                <span className="font-body text-sm text-white/90">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}