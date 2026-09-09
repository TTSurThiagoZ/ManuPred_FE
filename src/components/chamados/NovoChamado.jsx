import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../layout/AppShell";

const TIPOS = ["Hidráulico", "Elétrico", "Ar-condicionado", "Mobiliário", "Limpeza", "Outro"];
const LOCAIS = ["Sala 1", "Sala 2", "Sala 40", "Refeitório", "Inspetoria", "Banheiro", "Corredor"];

const fieldClass =
  "w-full py-2.5 px-3 bg-surface-container-lowest border border-outline-variant font-mono text-sm text-on-surface outline-none transition focus:border-primary";
const labelClass = "font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 block";

export default function NovoChamado({ onSubmit, onLogout }) {
  const navigate = useNavigate();
  const jaVerificou = useRef(false);

  useEffect(() => {
    if (jaVerificou.current) return;
    jaVerificou.current = true;

    const veioDoDashboard = sessionStorage.getItem("navegacaoInterna");
    if (veioDoDashboard) {
      sessionStorage.removeItem("navegacaoInterna");
    } else {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const [tipo, setTipo] = useState("");
  const [local, setLocal] = useState("");
  const [descricao, setDescricao] = useState("");
  const [patrimonio, setPatrimonio] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ tipo, local, descricao, patrimonio, anexos: 0 });
    navigate("/home");
  };

  return (
    <AppShell onLogout={onLogout}>
      <div className="max-w-3xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-8 border-b border-outline-variant pb-4">
          <h1 className="font-display text-2xl font-bold text-on-surface uppercase tracking-tight">
            Abrir Novo Chamado
          </h1>
          <button
            onClick={() => navigate("/home")}
            className="font-mono text-xs text-on-surface-variant border border-outline-variant px-3 py-1.5 hover:bg-surface-container-low transition-colors"
          >
            ← Voltar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant p-6 md:p-8">
          <p className="font-mono text-[10px] font-bold text-primary uppercase tracking-widest mb-4 pb-2 border-b border-outline-variant/50">
            Dados do Solicitante
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div>
              <label className={labelClass}>Nome do usuário</label>
              <input className={`${fieldClass} opacity-60`} value="Ana Souza" readOnly />
            </div>
            <div>
              <label className={labelClass}>ID do usuário</label>
              <input className={`${fieldClass} opacity-60`} value="1043" readOnly />
            </div>
          </div>

          <p className="font-mono text-[10px] font-bold text-primary uppercase tracking-widest mb-4 pb-2 border-b border-outline-variant/50">
            Detalhes do Problema
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelClass}>Tipo de chamado</label>
              <select className={fieldClass} value={tipo} onChange={(e) => setTipo(e.target.value)} required>
                <option value="">Selecione...</option>
                {TIPOS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Localização</label>
              <select className={fieldClass} value={local} onChange={(e) => setLocal(e.target.value)} required>
                <option value="">Selecione...</option>
                {LOCAIS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Descrição do problema</label>
              <textarea
                className={`${fieldClass} min-h-[100px] resize-y`}
                placeholder="Descreva o problema com detalhes..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelClass}>
                Nº de patrimônio <span className="normal-case font-normal text-on-surface-variant/70">(opcional)</span>
              </label>
              <input className={fieldClass} placeholder="Ex: 4821" value={patrimonio} onChange={(e) => setPatrimonio(e.target.value)} />
            </div>
          </div>

          <p className="font-mono text-[10px] font-bold text-primary uppercase tracking-widest mb-4 pb-2 border-b border-outline-variant/50">
            Anexos <span className="normal-case font-normal text-on-surface-variant/70">(opcional)</span>
          </p>
          <div className="border border-dashed border-outline-variant p-6 text-center font-body text-sm text-on-surface-variant cursor-pointer hover:border-primary transition-colors mb-8">
            <span className="material-symbols-outlined align-middle mr-2 text-[18px]">attach_file</span>
            Clique ou arraste fotos/arquivos do problema
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-outline-variant">
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="font-mono text-xs font-bold uppercase tracking-widest border border-outline-variant px-5 py-3 hover:bg-surface-container-low transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="relative bg-primary text-on-primary font-mono text-xs font-bold uppercase tracking-widest px-6 py-3 shadow-[4px_4px_0px_#3d2b1f] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#3d2b1f] transition-all"
            >
              Enviar Chamado
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}