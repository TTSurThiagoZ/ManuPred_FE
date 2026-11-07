// Detalhe do Chamado — rota: /chamados/:id (todos os usuários logados)
// Mostra os dados do chamado vindos da API. As ações mudam conforme a role:
// usuário cancela o próprio chamado aberto; técnico assume e muda o status; admin muda status, prioridade e técnico.

import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Layout from "../../../shared/components/Layout";
import { useUserStore } from "../../../store/user";
import { solicitacaoService } from "../../../shared/services/solicitacaoService";
import { userService } from "../../../shared/services/userService";
import { ADMIN, TECNICO } from "../../../utils/perfis";
import {
  STATUS_META,
  PRIORIDADE_META,
  getStatusMeta,
  getPrioridadeMeta,
  isEncerrado,
  formatarDataHora,
  codigoCurto,
  nomeTecnico,
  idTecnico,
} from "../../../utils/chamados";

const fieldClass =
  "w-full py-3 px-4 bg-[#241F1A] border border-white/10 rounded-2xl font-body text-sm text-white outline-none transition focus:border-[#F39400] focus:ring-4 focus:ring-[#F39400]/10 disabled:opacity-60 disabled:cursor-not-allowed [&>option]:bg-[#1C1814]";
const readOnlyClass = `${fieldClass} bg-white/5 text-white/70`;
const labelClass = "font-body text-sm text-white/80 mb-1.5 block";
const sectionLabelClass =
  "font-body text-xs font-semibold text-[#F39400] uppercase tracking-wider mb-4 pb-2 border-b border-white/10";

// O DTO pode mandar o anexo como texto (URL) ou objeto ({ url })
const anexoUrl = (a) => (typeof a === "string" ? a : a?.url || a?.caminho || "");

export default function ChamadoDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user); // Dados do usuário logado

  const [chamado, setChamado] = useState(null);
  const [tecnicos, setTecnicos] = useState([]);
  const [error, setError] = useState(null);
  const [acaoErro, setAcaoErro] = useState("");
  const [saving, setSaving] = useState(false);

  const admin = user?.role === ADMIN;
  const tecnico = user?.role === TECNICO;

  const carregarChamado = useCallback(async () => {
    setError(null);
    try {
      const data = await solicitacaoService.buscarPorId(id);
      setChamado(data);
    } catch (err) {
      console.error("Erro ao carregar o chamado:", err);
      setError(err.response?.status === 404 ? "Chamado não encontrado." : err.response?.data?.message || err.message);
    }
  }, [id]);

  useEffect(() => {
    carregarChamado();
  }, [carregarChamado]);

  // Só o admin precisa da lista de técnicos para atribuir
  useEffect(() => {
    if (!admin) return;
    async function carregarTecnicos() {
      try {
        const lista = await userService.findAll();
        const soTecnicos = lista.filter((u) => u.role === TECNICO);
        // Se o DTO ainda não trouxer a role, mostra todos
        setTecnicos(soTecnicos.length > 0 ? soTecnicos : lista);
      } catch (err) {
        console.error("Erro ao carregar técnicos:", err);
      }
    }
    carregarTecnicos();
  }, [admin]);

  // Executa uma ação na API e atualiza a tela com o chamado que voltou
  async function executar(acao) {
    setAcaoErro("");
    setSaving(true);
    try {
      const atualizado = await acao();
      if (atualizado) setChamado(atualizado);
      else await carregarChamado();
    } catch (err) {
      console.error("Erro na ação do chamado:", err);
      setAcaoErro(err.response?.data?.message || err.message || "Não foi possível concluir a ação.");
    } finally {
      setSaving(false);
    }
  }

  const alterarStatus = (status) => executar(() => solicitacaoService.atualizarStatus(id, status));
  const alterarPrioridade = (prioridade) => executar(() => solicitacaoService.atualizarPrioridade(id, prioridade));
  const atribuirTecnico = (tecnicoId) => executar(() => solicitacaoService.atribuirTecnico(id, tecnicoId));

  // Técnico pega o chamado para si e já coloca em andamento
  const assumirChamado = () =>
    executar(async () => {
      await solicitacaoService.atribuirTecnico(id, user.id);
      return solicitacaoService.atualizarStatus(id, "EM_ANDAMENTO");
    });

  function handleCancelar() {
    const confirmou = window.confirm("Tem certeza que deseja cancelar este chamado?");
    if (!confirmou) return;
    alterarStatus("CANCELADO");
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-8 py-12 text-center">
          <div className="bg-red-500/10 border border-red-400/20 rounded-2xl p-6 text-red-300 font-body">
            <p className="font-bold text-red-200 mb-2">Ops! Ocorreu um erro</p>
            <p className="text-sm mb-4">{error}</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={carregarChamado}
                className="px-4 py-2 bg-white/5 border border-white/10 text-white/80 rounded-2xl text-sm font-semibold hover:bg-white/10 transition cursor-pointer"
              >
                Tentar de novo
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-[#F39400] text-[#241F1A] rounded-2xl text-sm font-semibold hover:bg-[#F39400]/90 transition cursor-pointer"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Enquanto carrega, o Modal global de loading cobre a tela
  if (!chamado) return <Layout />;

  const statusMeta = getStatusMeta(chamado.status);
  const prioridadeMeta = getPrioridadeMeta(chamado.prioridade);
  const encerrado = isEncerrado(chamado.status);
  const souSolicitante = chamado.usuarioSolicitanteId
    ? chamado.usuarioSolicitanteId === user?.id
    : !admin && !tecnico;
  const podeCancelar = chamado.status === "ABERTO" && (souSolicitante || admin);
  const anexos = (chamado.anexos || []).map(anexoUrl).filter(Boolean);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusMeta.badge}`}>{statusMeta.label}</span>
              {prioridadeMeta && (
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${prioridadeMeta.badge}`}>{prioridadeMeta.label}</span>
              )}
            </div>
            <h1 className="font-serif text-3xl text-white">Detalhes do chamado</h1>
            <p className="font-body text-xs text-white/40 mt-1">Código: #{codigoCurto(chamado.id)}</p>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="font-body text-sm text-white/80 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 hover:bg-white/10 transition-colors w-fit shrink-0 cursor-pointer"
          >
            ← Voltar
          </button>
        </div>

        {/* Erro de alguma ação (mudar status, prioridade...) */}
        {acaoErro && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-400/20 text-red-300 rounded-2xl text-sm font-body">
            {acaoErro}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dados do chamado (somente leitura) */}
          <div className="bg-[#1C1814] rounded-2xl border border-white/10 p-6 md:p-8 lg:col-span-2 space-y-8">
            {/* DADOS DO SOLICITANTE */}
            <div>
              <p className={sectionLabelClass}>Dados do solicitante</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Aberto por</label>
                  <input className={readOnlyClass} value={chamado.usuarioSolicitanteNome || "—"} readOnly />
                </div>
                <div>
                  <label className={labelClass}>Aberto em</label>
                  <input className={readOnlyClass} value={formatarDataHora(chamado.dataAbertura)} readOnly />
                </div>
                {chamado.dataFinalizacao && (
                  <div>
                    <label className={labelClass}>Finalizado em</label>
                    <input className={readOnlyClass} value={formatarDataHora(chamado.dataFinalizacao)} readOnly />
                  </div>
                )}
              </div>
            </div>

            {/* DETALHES DO PROBLEMA */}
            <div>
              <p className={sectionLabelClass}>Detalhes do problema</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Tipo de chamado</label>
                  <input className={readOnlyClass} value={chamado.tipo || "—"} readOnly />
                </div>
                <div>
                  <label className={labelClass}>Localização</label>
                  <input className={readOnlyClass} value={chamado.localizacaoProblema || "—"} readOnly />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Descrição do problema</label>
                  <textarea className={`${readOnlyClass} min-h-[110px] resize-none`} value={chamado.descricao || ""} readOnly />
                </div>
                <div>
                  <label className={labelClass}>Nº de patrimônio</label>
                  <input className={readOnlyClass} value={chamado.numeroPatrimonio || "—"} readOnly />
                </div>
                <div>
                  <label className={labelClass}>Técnico responsável</label>
                  <input className={readOnlyClass} value={nomeTecnico(chamado) || "Não atribuído"} readOnly />
                </div>
              </div>
            </div>

            {/* ANEXOS / FOTO DO PROBLEMA */}
            <div>
              <p className={sectionLabelClass}>Anexos</p>
              {anexos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {anexos.map((url) => (
                    <a key={url} href={url} target="_blank" rel="noreferrer">
                      <img
                        src={url}
                        alt="Anexo do chamado"
                        className="w-full h-32 object-cover rounded-xl border border-white/10 hover:opacity-80 transition"
                      />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="border border-white/10 rounded-2xl p-6 text-center font-body text-sm text-white/40">
                  Nenhum anexo enviado neste chamado.
                </div>
              )}
            </div>
          </div>

          {/* AÇÕES (variam conforme a role) */}
          <aside className="bg-[#1C1814] rounded-2xl border border-white/10 p-6 h-fit space-y-6">
            <p className={sectionLabelClass}>Ações</p>

            {tecnico && chamado.status === "ABERTO" && (
              <button
                onClick={assumirChamado}
                disabled={saving}
                className="w-full font-body text-sm font-semibold bg-[#F39400] text-[#241F1A] rounded-2xl px-6 py-3 hover:bg-[#F39400]/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">front_hand</span>
                Assumir chamado
              </button>
            )}

            {(admin || tecnico) && (
              <div>
                <label htmlFor="status" className={labelClass}>Status</label>
                <select
                  id="status"
                  className={fieldClass}
                  value={chamado.status ?? ""}
                  disabled={saving}
                  onChange={(e) => alterarStatus(e.target.value)}
                >
                  {Object.entries(STATUS_META).map(([key, s]) => (
                    <option key={key} value={key}>{s.label}</option>
                  ))}
                </select>
              </div>
            )}

            {admin && (
              <>
                <div>
                  <label htmlFor="prioridade" className={labelClass}>Prioridade</label>
                  <select
                    id="prioridade"
                    className={fieldClass}
                    value={chamado.prioridade ?? ""}
                    disabled={saving}
                    onChange={(e) => alterarPrioridade(e.target.value)}
                  >
                    <option value="" disabled>Selecione...</option>
                    {Object.entries(PRIORIDADE_META).map(([key, p]) => (
                      <option key={key} value={key}>{p.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="tecnico" className={labelClass}>Técnico responsável</label>
                  <select
                    id="tecnico"
                    className={fieldClass}
                    value={idTecnico(chamado) ?? ""}
                    disabled={saving || encerrado}
                    onChange={(e) => atribuirTecnico(e.target.value)}
                  >
                    <option value="" disabled>Selecione...</option>
                    {tecnicos.map((t) => (
                      <option key={t.id} value={t.id}>{t.nome ?? t.name}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {podeCancelar && (
              <button
                type="button"
                onClick={handleCancelar}
                disabled={saving}
                className="w-full font-body text-sm font-semibold text-red-300 bg-red-500/10 border border-red-400/20 rounded-2xl px-5 py-3 hover:bg-red-500/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">cancel</span>
                Cancelar chamado
              </button>
            )}

            {!admin && !tecnico && !podeCancelar && (
              <p className="font-body text-sm text-white/50">
                {encerrado
                  ? "Este chamado já foi encerrado."
                  : "Seu chamado está sendo atendido. Você será avisado quando houver novidades."}
              </p>
            )}
          </aside>
        </div>
      </div>
    </Layout>
  );
}
