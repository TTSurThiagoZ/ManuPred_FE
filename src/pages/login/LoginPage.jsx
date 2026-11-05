// Tela de Login — rota: /login (público)
// Entra com e-mail e senha pela API e manda cada usuário para a tela inicial da sua role.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/user';
import { getPerfil } from '../../utils/perfis';

const fieldClass =
  "w-full rounded-2xl border border-white/10 bg-[#1C1814] px-4 py-3.5 font-body text-white placeholder:text-white/30 outline-none transition focus:border-[#F39400] focus:ring-4 focus:ring-[#F39400]/10";
const labelClass = "font-body text-sm text-white/80 mb-1.5 block";

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useUserStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setEnviando(true);
    try {
      const user = await login({ email, password });
      navigate(getPerfil(user?.role).telaInicial, { replace: true });
    } catch (err) {
      // 401/403 = credenciais erradas; outros erros mostram a mensagem da API
      if (err.response?.status === 401 || err.response?.status === 403) {
        setErro("E-mail ou senha inválidos.");
      } else {
        setErro(err.response?.data?.message || err.message || "Não foi possível entrar.");
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#241F1A]">
      {/* Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-sm">
          <img src="/kipper-logo.svg" alt="Kipper" className="w-12 h-12 mb-8" />

          <span className="font-body text-xs font-semibold text-[#F39400] uppercase tracking-[0.2em]">
            Acesso
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-white mt-3 mb-3 leading-[1.05]">
            Bem-vindo <br />de volta
          </h1>
          <p className="font-body text-white/50 text-base mb-10">
            Entre para acompanhar seus chamados de manutenção.
          </p>

          {erro && (
            <div className="mb-5 p-4 bg-red-500/10 border border-red-400/20 text-red-300 rounded-2xl text-sm font-body">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className={labelClass}>E-mail</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="voce@escola.com"
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>Senha</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className={fieldClass}
              />
            </div>

            <button
              type="submit"
              disabled={enviando}
              className="w-full rounded-2xl bg-[#F39400] text-[#241F1A] font-body font-semibold py-3.5 mt-2 transition hover:bg-[#F39400]/90 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {enviando ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="font-body text-xs text-white/40 mt-10 text-center">
            Acesso exclusivo para colaboradores autorizados.
          </p>
        </div>
      </div>

      {/* Painel ilustrativo (só decoração, não é dado da API) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#1C1814] border-l border-white/10 items-center justify-center p-16">
        <div className="splash-noise absolute inset-0 pointer-events-none" />
        <div className="absolute -top-40 -right-32 w-[500px] h-[500px] rounded-full bg-[#F39400] blur-[140px] opacity-30 pointer-events-none" />
        <div className="absolute -bottom-48 -left-32 w-[420px] h-[420px] rounded-full bg-[#843B0F] blur-[120px] opacity-50 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
          <h2 className="font-serif text-3xl text-white mb-4 leading-tight">
            Manutenção,<br />sem complicação.
          </h2>
          <p className="font-body text-base text-white/70 max-w-[300px] mb-12 leading-relaxed">
            Centralizamos a abertura, o acompanhamento e a resolução dos seus
            chamados — do pedido até a conclusão.
          </p>

          <div className="relative w-full max-w-[280px]">
            <div className="absolute -top-6 -right-5 rotate-12 z-20">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center animate-[floatSoft_4s_ease-in-out_infinite]">
                <span className="material-symbols-outlined text-[#F39400] text-2xl">task_alt</span>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-6 -rotate-12 z-20">
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center animate-[floatSoft_5s_ease-in-out_infinite_0.6s]">
                <span className="material-symbols-outlined text-white text-xl">build</span>
              </div>
            </div>

            <div className="relative bg-[#241F1A] border border-white/10 rounded-2xl shadow-2xl shadow-black/40 p-5 -rotate-2 text-left">
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-sky-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-300 animate-pulse" />
                  Em andamento
                </span>
                <span className="text-[10px] text-white/40 font-mono">#0512</span>
              </div>
              <p className="font-body text-sm font-semibold text-white mb-1">
                Ar-condicionado — Sala 12
              </p>
              <p className="font-body text-xs text-white/50 mb-3">
                Técnico a caminho · previsão 40 min
              </p>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-2/3 bg-[#F39400] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
