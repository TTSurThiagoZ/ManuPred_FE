// Chamados Finalizados — rota: /finalizados (TECNICO_ROLE)
// Busca nos chamados já encerrados (vindos da API) por código, patrimônio, solicitante, datas e local.

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../../shared/components/Layout";
import { solicitacaoService } from "../../shared/services/solicitacaoService";
import {
  LOCAIS,
  getStatusMeta,
  isEncerrado,
  formatarData,
  codigoCurto,
  nomeTecnico,
  tituloChamado,
} from "../../utils/chamados";

const fieldClass =
  "w-full py-2.5 px-3 bg-[#241F1A] border border-white/10 rounded-2xl font-body text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#F39400] focus:ring-4 focus:ring-[#F39400]/10 [color-scheme:dark] [&>option]:bg-[#1C1814]";
const labelClass = "font-body text-sm text-white/80 mb-1.5 block";
const chipClass = "font-body text-xs text-white/70 bg-white/5 rounded-full px-3 py-1";

const vazio = { codigo: "", patrimonio: "", solicitante: "", dataAbertura: "", dataFinalizacao: "", local: "" };

// Compara a data ISO da API com o valor do <input type="date"> (aaaa-mm-dd)
const mesmaData = (iso, alvo) => !alvo || (iso && String(iso).startsWith(alvo));
const contem = (valor, busca) => !busca || String(valor ?? "").toLowerCase().includes(busca.trim().toLowerCase());

export default function FinalizadosPage() {
  const navigate = useNavigate();
  const [finalizados, setFinalizados] = useState([]);
  const [filtros, setFiltros] = useState(vazio);
  const [aplicados, setAplicados] = useState(vazio);
  const [carregado, setCarregado] = useState(false);
  const [erro, setErro] = useState("");

  async function carregarFinalizados() {
    setErro("");
    try {
      const data = await solicitacaoService.search({ page: 0, size: 200, sort: "dataAbertura,desc" });
      setFinalizados((data.content || []).filter((t) => isEncerrado(t.status)));
    } catch (error) {
      console.error("Erro ao carregar finalizados:", error);
      setErro(error.response?.data?.message || error.message || "Erro desconhecido");
    } finally {
      setCarregado(true);
    }
  }

  useEffect(() => {
    carregarFinalizados();
  }, []);

  const campo = (chave) => (e) => setFiltros((f) => ({ ...f, [chave]: e.target.value }));

  // Os filtros só valem depois de clicar em "Buscar"
  const resultados = finalizados.filter(
    (t) =>
      contem(t.id, aplicados.codigo) &&
      contem(t.numeroPatrimonio, aplicados.patrimonio) &&
      contem(t.usuarioSolicitanteNome, aplicados.solicitante) &&
      mesmaData(t.dataAbertura, aplicados.dataAbertura) &&
      mesmaData(t.dataFinalizacao, aplicados.dataFinalizacao) &&
      (!aplicados.local || t.localizacaoProblema === aplicados.local)
  );

  const buscar = (e) => {
    e.preventDefault();
    setAplicados(filtros);
  };

  const limparFiltros = () => {
    setFiltros(vazio);
    setAplicados(vazio);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-4xl text-white">Chamados finalizados</h1>
          <button
            onClick={() => navigate("/painel")}
            className="font-body text-sm text-white/80 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 hover:bg-white/10 transition-colors cursor-pointer"
          >
            ← Voltar ao painel
          </button>
        </div>

        <form onSubmit={buscar} className="bg-[#1C1814] rounded-2xl border border-white/10 p-6 mb-6">
          <p className="font-body text-xs font-semibold text-[#F39400] uppercase tracking-wider mb-4">Buscar por</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <div>
              <label className={labelClass}>Código do chamado</label>
              <input className={fieldClass} placeholder="Ex: 3fa85f64" value={filtros.codigo} onChange={campo("codigo")} />
            </div>
            <div>
              <label className={labelClass}>Número de patrimônio</label>
              <input className={fieldClass} placeholder="Ex: 4821" value={filtros.patrimonio} onChange={campo("patrimonio")} />
            </div>
            <div>
              <label className={labelClass}>Solicitante</label>
              <input className={fieldClass} placeholder="Nome de quem abriu" value={filtros.solicitante} onChange={campo("solicitante")} />
            </div>
            <div>
              <label className={labelClass}>Data de abertura</label>
              <input type="date" className={fieldClass} value={filtros.dataAbertura} onChange={campo("dataAbertura")} />
            </div>
            <div>
              <label className={labelClass}>Data de finalização</label>
              <input type="date" className={fieldClass} value={filtros.dataFinalizacao} onChange={campo("dataFinalizacao")} />
            </div>
            <div>
              <label className={labelClass}>Localização</label>
              <select className={fieldClass} value={filtros.local} onChange={campo("local")}>
                <option value="">Todas</option>
                {LOCAIS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="font-body text-sm font-semibold text-[#241F1A] bg-[#F39400] rounded-full px-5 py-2.5 hover:bg-[#F39400]/90 transition-colors cursor-pointer">
              Buscar
            </button>
            <button type="button" onClick={limparFiltros} className="font-body text-sm font-semibold text-white/80 bg-white/5 border border-white/10 rounded-full px-5 py-2.5 hover:bg-white/10 transition-colors cursor-pointer">
              Limpar filtros
            </button>
          </div>
        </form>

        {erro && (
          <div className="mb-6 bg-red-500/10 border border-red-400/20 rounded-2xl px-5 py-4">
            <p className="font-body text-sm text-red-200 font-semibold mb-1">Não foi possível carregar os chamados</p>
            <p className="font-body text-xs text-red-300/80 mb-3">{erro}</p>
            <button
              onClick={carregarFinalizados}
              className="font-body text-xs font-semibold text-red-200 border border-red-400/30 rounded-full px-3 py-1.5 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              Tentar de novo
            </button>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {resultados.map((t) => {
            const meta = getStatusMeta(t.status);
            return (
              <div
                key={t.id}
                onClick={() => navigate(`/chamados/${t.id}`)}
                className="bg-[#1C1814] rounded-2xl border border-white/10 p-5 cursor-pointer hover:border-[#F39400]/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-body text-xs text-white/40">Chamado #{codigoCurto(t.id)}</p>
                    <p className="font-serif text-lg text-white">{tituloChamado(t)}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${meta.badge}`}>{meta.label}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {t.tipo && <span className={chipClass}>🔧 {t.tipo}</span>}
                  {t.localizacaoProblema && <span className={chipClass}>📍 {t.localizacaoProblema}</span>}
                  {t.usuarioSolicitanteNome && <span className={chipClass}>👤 {t.usuarioSolicitanteNome}</span>}
                  {nomeTecnico(t) && <span className={chipClass}>🛠️ {nomeTecnico(t)}</span>}
                  {t.numeroPatrimonio && <span className={chipClass}>🏷️ Patrimônio: {t.numeroPatrimonio}</span>}
                </div>
                <div className="flex justify-between font-body text-xs text-white/40 pt-3 border-t border-white/10">
                  <span>Aberto em {formatarData(t.dataAbertura)}</span>
                  <span>Finalizado em {formatarData(t.dataFinalizacao)}</span>
                </div>
              </div>
            );
          })}

          {carregado && !erro && resultados.length === 0 && (
            <div className="border border-dashed border-white/15 rounded-2xl p-12 text-center">
              <p className="font-body text-sm text-white/50">Nenhum chamado encontrado com esses filtros.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
