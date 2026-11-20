import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../../utils/api";

const API_BASE_URL = "http://localhost:8080";

const STATUS_META = {
  ABERTO: {
    label: "Aberto",
    badge: "bg-amber-100 text-amber-800",
  },
  EM_ANDAMENTO: {
    label: "Em andamento",
    badge: "bg-blue-100 text-blue-800",
  },
  CONCLUIDO: {
    label: "Concluído",
    badge: "bg-emerald-100 text-emerald-800",
  },
  FINALIZADO: {
    label: "Finalizado",
    badge: "bg-stone/15 text-stone",
  },
  REJEITADO: {
    label: "Rejeitado",
    badge: "bg-red-100 text-red-800",
  },
};

const PRIORIDADE_META = {
  BAIXA: { label: "Prioridade Baixa", badge: "bg-cream text-stone" },
  MEDIA: { label: "Prioridade Média", badge: "bg-amber-50 text-amber-700 border border-amber-200/60" },
  ALTA: { label: "Prioridade Alta", badge: "bg-orange-100 text-orange-800" },
  URGENTE: { label: "Prioridade Urgente", badge: "bg-red-100 text-red-800" },
};

const formatDate = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const isImageFile = (fileName = "") =>
  /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(fileName);

const buildFileUrl = (url = "") => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};

const ChamadoDetailPage = (props) => {
  const { chamado: chamadoProp, onBack } = props;
  const { id } = useParams();
  const navigate = useNavigate();

  const [chamado, setChamado] = useState(chamadoProp || null);
  const [loading, setLoading] = useState(!chamadoProp && Boolean(id));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (chamadoProp) {
      setChamado(chamadoProp);
      setLoading(false);
      return;
    }

    if (!id) return;

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    api
      .get(`/chamados/${id}`, { signal: controller.signal })
      .then(({ data }) => setChamado(data))
      .catch((err) => {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          setError(
            err.response?.data?.message ||
              "Não foi possível carregar os detalhes do chamado."
          );
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [chamadoProp, id]);

  const handleVoltar = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/chamados");
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl border border-stone/10 p-8 text-center font-body text-sm text-stone">
          Carregando detalhes do chamado...
        </div>
      </div>
    );
  }

  if (error || !chamado) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex flex-col gap-4">
        <button
          type="button"
          onClick={handleVoltar}
          className="self-start font-body text-sm text-stone hover:text-charcoal transition-colors cursor-pointer"
        >
          ← Voltar
        </button>
        <div className="bg-white rounded-2xl border border-stone/10 p-8 text-center font-body text-sm text-red-700">
          {error || "Chamado não encontrado."}
        </div>
      </div>
    );
  }

  const meta = STATUS_META[chamado.status] || {
    label: chamado.status || "Desconhecido",
    badge: "bg-cream text-stone",
  };

  const prioridadeMeta = PRIORIDADE_META[chamado.prioridade] || {
    label: chamado.prioridade,
    badge: "bg-cream text-stone",
  };

  const done = ["CONCLUIDO", "FINALIZADO"].includes(chamado.status);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 flex flex-col gap-5">
      {/* Navegação superior */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleVoltar}
          className="inline-flex items-center gap-2 font-body text-sm text-stone hover:text-charcoal transition-colors cursor-pointer"
        >
          <span>←</span>
          <span>Voltar para chamados</span>
        </button>

        <span className="font-body text-xs text-stone/60">
          ID: #{chamado.id ? chamado.id.substring(0, 8) : ""}
        </span>
      </div>

      {/* Card Principal */}
      <article className="bg-white rounded-2xl border border-stone/10 p-6 sm:p-8 shadow-sm flex flex-col gap-6">
        {/* Cabeçalho: Badges + Data de Abertura */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${meta.badge}`}>
              {meta.label}
            </span>

            {chamado.prioridade && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${prioridadeMeta.badge}`}>
                {prioridadeMeta.label}
              </span>
            )}

            {chamado.urgente && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-600 text-white">
                🚨 Urgente
              </span>
            )}
          </div>

          <span className="font-body text-xs text-stone/70">
            Aberto em {formatDate(chamado.dataAbertura)}
          </span>
        </div>

        {/* Título e Descrição */}
        <div className="flex flex-col gap-2">
          <h1
            className={`font-serif text-2xl sm:text-3xl text-charcoal leading-snug ${
              done ? "line-through decoration-stone/40" : ""
            }`}
          >
            {chamado.titulo || chamado.descricao}
          </h1>

          {chamado.descricao && (
            <p className="font-body text-base text-stone leading-relaxed whitespace-pre-line">
              {chamado.descricao}
            </p>
          )}
        </div>

        {/* Motivo de Rejeição (caso exista) */}
        {chamado.motivoRejeicao && (
          <div className="rounded-xl bg-red-50 border border-red-200/70 p-4 flex flex-col gap-1">
            <span className="font-body text-xs font-semibold uppercase tracking-wide text-red-800">
              Motivo da Rejeição
            </span>
            <p className="font-body text-sm text-red-700">{chamado.motivoRejeicao}</p>
          </div>
        )}

        {/* Tags de Classificação e Local */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-stone/10">
          {chamado.tipoNome && (
            <span className="font-body text-xs text-stone bg-cream rounded-full px-3.5 py-1.5">
              {chamado.tipoIcone || "🔧"} {chamado.tipoNome}
            </span>
          )}

          {chamado.localNome && (
            <span className="font-body text-xs text-stone bg-cream rounded-full px-3.5 py-1.5">
              🏢 Local: {chamado.localNome}
            </span>
          )}

          {chamado.setorNome && (
            <span className="font-body text-xs text-stone bg-cream rounded-full px-3.5 py-1.5">
              🗂️ Setor: {chamado.setorNome}
            </span>
          )}

          {chamado.localizacaoProblema && (
            <span className="font-body text-xs text-stone bg-cream rounded-full px-3.5 py-1.5">
              📍 {chamado.localizacaoProblema}
            </span>
          )}

          {chamado.numeroPatrimonio && (
            <span className="font-body text-xs text-stone bg-cream rounded-full px-3.5 py-1.5">
              🏷️ Patrimônio: {chamado.numeroPatrimonio}
            </span>
          )}
        </div>

        {/* Grid de Detalhes: Responsáveis e Datas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone/10">
          {/* Bloco Pessoas */}
          <div className="rounded-xl bg-cream/60 border border-stone/10 p-4 flex flex-col gap-3">
            <h2 className="font-serif text-base text-charcoal">Envolvidos</h2>

            <div className="flex flex-col gap-2 font-body text-sm">
              <div>
                <span className="text-xs text-stone/70 block">Solicitante</span>
                <span className="text-charcoal font-medium">
                  {chamado.usuarioSolicitanteNome || "Não informado"}
                </span>
              </div>

              <div>
                <span className="text-xs text-stone/70 block">Técnico Responsável</span>
                <span className="text-charcoal font-medium">
                  {chamado.tecnicoResponsavelNome || "Aguardando atribuição"}
                </span>
              </div>

              <div>
                <span className="text-xs text-stone/70 block">Ajudantes</span>
                {chamado.ajudantes && chamado.ajudantes.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {chamado.ajudantes.map((ajudante, index) => (
                      <span
                        key={ajudante.id || index}
                        className="text-xs text-stone bg-white border border-stone/10 rounded-full px-2.5 py-0.5"
                      >
                        {typeof ajudante === "string" ? ajudante : ajudante.nome}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-stone/70 text-xs">Nenhum ajudante vinculado</span>
                )}
              </div>
            </div>
          </div>

          {/* Bloco Histórico de Datas */}
          <div className="rounded-xl bg-cream/60 border border-stone/10 p-4 flex flex-col gap-3">
            <h2 className="font-serif text-base text-charcoal">Datas do Chamado</h2>

            <div className="grid grid-cols-2 gap-3 font-body text-sm">
              <div>
                <span className="text-xs text-stone/70 block">Abertura</span>
                <span className="text-charcoal">{formatDate(chamado.dataAbertura)}</span>
              </div>

              <div>
                <span className="text-xs text-stone/70 block">Última Atualização</span>
                <span className="text-charcoal">{formatDate(chamado.dataAtualizacao)}</span>
              </div>

              <div>
                <span className="text-xs text-stone/70 block">Conclusão</span>
                <span className="text-charcoal">{formatDate(chamado.dataConclusao)}</span>
              </div>

              <div>
                <span className="text-xs text-stone/70 block">Finalização</span>
                <span className="text-charcoal">{formatDate(chamado.dataFinalizacao)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Anexos */}
        {chamado.anexos && chamado.anexos.length > 0 && (
          <div className="flex flex-col gap-3 pt-4 border-t border-stone/10">
            <h2 className="font-serif text-lg text-charcoal">
              Anexos ({chamado.anexos.length})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {chamado.anexos.map((anexo) => {
                const fullUrl = buildFileUrl(anexo.url);
                const isImage = isImageFile(anexo.nomeArquivo || anexo.url);

                return (
                  <a
                    key={anexo.id}
                    href={fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-stone/10 bg-cream/40 overflow-hidden flex flex-col transition-all hover:shadow-md hover:-translate-y-0.5"
                  >
                    {isImage ? (
                      <div className="aspect-video w-full bg-cream overflow-hidden">
                        <img
                          src={fullUrl}
                          alt={anexo.nomeArquivo || "Anexo do chamado"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video w-full bg-cream flex items-center justify-center text-3xl">
                        📎
                      </div>
                    )}

                    <div className="p-3 flex flex-col gap-0.5">
                      <span
                        className="font-body text-xs font-medium text-charcoal truncate"
                        title={anexo.nomeArquivo}
                      >
                        {anexo.nomeArquivo}
                      </span>
                      <span className="font-body text-[11px] text-stone/60">
                        {formatDate(anexo.createdAt)}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Rodapé com identificador completo */}
        <div className="pt-3 border-t border-stone/10 flex flex-wrap items-center justify-between gap-2 font-body text-[11px] text-stone/60">
          <span>
            #{chamado.id} · aberto por {chamado.usuarioSolicitanteNome || "Solicitante"}
          </span>
        </div>
      </article>
    </div>
  );
};


export default ChamadoDetailPage;