import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../layout/AppShell";

const LOCAIS = ["Todas", "Sala 1", "Sala 40", "Refeitório", "Inspetoria", "Corredor", "Banheiro"];

const FINALIZADOS = [
  { id: "0485", titulo: "Pintura da parede do refeitório", tipo: "Outro", local: "Refeitório", patrimonio: null, usuarioId: "1043", dataAbertura: "05/08/2026", dataFinalizacao: "09/08/2026" },
  { id: "0471", titulo: "Troca de lâmpadas da Sala 1", tipo: "Elétrico", local: "Sala 1", patrimonio: "3310", usuarioId: "1022", dataAbertura: "28/07/2026", dataFinalizacao: "30/07/2026" },
  { id: "0463", titulo: "Vazamento no bebedouro do corredor", tipo: "Hidráulico", local: "Corredor", patrimonio: null, usuarioId: "1087", dataAbertura: "20/07/2026", dataFinalizacao: "22/07/2026" },
  { id: "0450", titulo: "Ajuste na porta da Inspetoria", tipo: "Outro", local: "Inspetoria", patrimonio: "2894", usuarioId: "1005", dataAbertura: "10/07/2026", dataFinalizacao: "11/07/2026" },
];

const fieldClass =
  "w-full py-2.5 px-3 bg-white border border-stone/20 rounded-2xl font-body text-sm text-charcoal outline-none transition focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10";
const labelClass = "font-body text-sm text-charcoal mb-1.5 block";

const vazio = { id: "", patrimonio: "", dataAbertura: "", dataFinalizacao: "", local: "Todas", usuarioId: "" };

export default function TecnicoFinalizados({ onLogout }) {
  const navigate = useNavigate();
  const [filtros, setFiltros] = useState(vazio);
  const [resultados, setResultados] = useState(FINALIZADOS);

  const campo = (chave) => (e) => setFiltros((f) => ({ ...f, [chave]: e.target.value }));

  const buscar = (e) => {
    e.preventDefault();
    setResultados(
      FINALIZADOS.filter((t) => {
        if (filtros.id && !t.id.includes(filtros.id.trim())) return false;
        if (filtros.patrimonio && !(t.patrimonio ?? "").includes(filtros.patrimonio.trim())) return false;
        if (filtros.dataAbertura && !t.dataAbertura.includes(filtros.dataAbertura.trim())) return false;
        if (filtros.dataFinalizacao && !t.dataFinalizacao.includes(filtros.dataFinalizacao.trim())) return false;
        if (filtros.local !== "Todas" && t.local !== filtros.local) return false;
        if (filtros.usuarioId && !t.usuarioId.includes(filtros.usuarioId.trim())) return false;
        return true;
      })
    );
  };

  const limparFiltros = () => {
    setFiltros(vazio);
    setResultados(FINALIZADOS);
  };

  return (
    <AppShell onLogout={onLogout} userName="Carlos Lima" userRole="Técnico">
      <div className="max-w-4xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-4xl text-charcoal">Chamados finalizados</h1>
          <button
            onClick={() => navigate("/tecnico")}
            className="font-body text-sm text-stone bg-white border border-stone/20 rounded-2xl px-4 py-2 hover:bg-cream transition-colors"
          >
            ← Voltar ao painel
          </button>
        </div>

        <form onSubmit={buscar} className="bg-white rounded-2xl border border-stone/10 shadow-sm p-6 mb-6">
          <p className="font-body text-xs font-semibold text-amber-700 uppercase tracking-wider mb-4">Buscar por</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <div>
              <label className={labelClass}>ID do chamado</label>
              <input className={fieldClass} placeholder="Ex: 0485" value={filtros.id} onChange={campo("id")} />
            </div>
            <div>
              <label className={labelClass}>Número de patrimônio</label>
              <input className={fieldClass} placeholder="Ex: 4821" value={filtros.patrimonio} onChange={campo("patrimonio")} />
            </div>
            <div>
              <label className={labelClass}>ID do usuário que abriu</label>
              <input className={fieldClass} placeholder="Ex: 1043" value={filtros.usuarioId} onChange={campo("usuarioId")} />
            </div>
            <div>
              <label className={labelClass}>Data de abertura</label>
              <input className={fieldClass} placeholder="dd/mm/aaaa" value={filtros.dataAbertura} onChange={campo("dataAbertura")} />
            </div>
            <div>
              <label className={labelClass}>Data de finalização</label>
              <input className={fieldClass} placeholder="dd/mm/aaaa" value={filtros.dataFinalizacao} onChange={campo("dataFinalizacao")} />
            </div>
            <div>
              <label className={labelClass}>Localização</label>
              <select className={fieldClass} value={filtros.local} onChange={campo("local")}>
                {LOCAIS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="font-body text-sm font-semibold text-white bg-amber-600 rounded-full px-5 py-2.5 hover:bg-amber-700 transition-colors">
              Buscar
            </button>
            <button type="button" onClick={limparFiltros} className="font-body text-sm font-semibold text-stone bg-white border border-stone/20 rounded-full px-5 py-2.5 hover:bg-cream transition-colors">
              Limpar filtros
            </button>
          </div>
        </form>

        <div className="flex flex-col gap-4">
          {resultados.map((t) => (
            <div key={t.id} className="bg-white rounded-2xl border border-stone/10 shadow-sm p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-body text-xs text-stone/70">Chamado #{t.id}</p>
                  <p className="font-serif text-lg text-charcoal">{t.titulo}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 shrink-0">
                  Finalizada
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="font-body text-xs text-stone bg-cream rounded-full px-3 py-1">🔧 {t.tipo}</span>
                <span className="font-body text-xs text-stone bg-cream rounded-full px-3 py-1">📍 {t.local}</span>
                <span className="font-body text-xs text-stone bg-cream rounded-full px-3 py-1">ID usuário: {t.usuarioId}</span>
                {t.patrimonio && (
                  <span className="font-body text-xs text-stone bg-cream rounded-full px-3 py-1">🏷️ Patrimônio: {t.patrimonio}</span>
                )}
              </div>
              <div className="flex justify-between font-body text-xs text-stone/70 pt-3 border-t border-stone/10">
                <span>Aberto em {t.dataAbertura}</span>
                <span>Finalizado em {t.dataFinalizacao}</span>
              </div>
            </div>
          ))}

          {resultados.length === 0 && (
            <div className="border border-dashed border-stone/20 rounded-2xl p-12 text-center bg-white/50">
              <p className="font-body text-sm text-stone">Nenhum chamado encontrado com esses filtros.</p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}