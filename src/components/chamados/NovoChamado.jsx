import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../layout/AppShell";

const TIPOS = ["Hidráulico", "Elétrico", "Ar-condicionado", "Mobiliário", "Limpeza", "Outro"];
const LOCAIS = ["Sala 1", "Sala 2", "Sala 40", "Refeitório", "Inspetoria", "Banheiro", "Corredor"];

const fieldClass =
  "w-full py-3 px-4 bg-white border border-stone/20 rounded-2xl font-body text-sm text-charcoal outline-none transition focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10";
const labelClass = "font-body text-sm text-charcoal mb-1.5 block";
const sectionLabelClass = "font-body text-xs font-semibold text-amber-700 uppercase tracking-wider mb-4 pb-2 border-b border-stone/10";

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
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl text-charcoal">Abrir novo chamado</h1>
          <button
            onClick={() => navigate("/home")}
            className="font-body text-sm text-stone bg-white border border-stone/20 rounded-2xl px-4 py-2 hover:bg-cream transition-colors"
          >
            ← Voltar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone/10 shadow-sm p-6 md:p-8">
          <p className={sectionLabelClass}>Dados do solicitante</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div>
              <label className={labelClass}>Nome do usuário</label>
              <input className={`${fieldClass} bg-cream/50 text-stone`} value="Ana Souza" readOnly />
            </div>
            <div>
              <label className={labelClass}>ID do usuário</label>
              <input className={`${fieldClass} bg-cream/50 text-stone`} value="1043" readOnly />
            </div>
          </div>

          <p className={sectionLabelClass}>Detalhes do problema</p>
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
                className={`${fieldClass} min-h-[110px] resize-y`}
                placeholder="Descreva o problema com detalhes..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelClass}>
                Nº de patrimônio <span className="text-stone/70 font-normal">(opcional)</span>
              </label>
              <input className={fieldClass} placeholder="Ex: 4821" value={patrimonio} onChange={(e) => setPatrimonio(e.target.value)} />
            </div>
          </div>

          <p className={sectionLabelClass}>
            Anexos <span className="normal-case font-normal text-stone/70">(opcional)</span>
          </p>
          <div className="border-2 border-dashed border-stone/25 rounded-2xl p-8 text-center font-body text-sm text-stone cursor-pointer hover:border-amber-600 hover:bg-cream/40 transition-colors mb-8">
            <span className="material-symbols-outlined align-middle mr-2 text-[18px]">attach_file</span>
            Clique ou arraste fotos/arquivos do problema
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-stone/10">
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="font-body text-sm font-semibold text-charcoal bg-white border border-stone/20 rounded-2xl px-5 py-3 hover:bg-cream transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="font-body text-sm font-semibold bg-amber-600 text-white rounded-2xl px-6 py-3 shadow-sm hover:bg-amber-700 transition-colors"
            >
              Enviar chamado
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}