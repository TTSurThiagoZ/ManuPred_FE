// Constantes e funções dos chamados (tipos, locais, status, prioridade e datas).
// Usado por todas as telas de chamados. Status e prioridade seguem os enums da API.

export const TIPOS = ["Hidráulico", "Elétrico", "Ar-condicionado", "Mobiliário", "Limpeza", "Outro"];

export const LOCAIS = [
  "Sala 1",
  "Sala 2",
  "Sala 5",
  "Sala 8",
  "Sala 12",
  "Sala 22",
  "Sala 40",
  "Bloco A",
  "Corredor",
  "Banheiro",
  "Refeitório",
  "Inspetoria",
];

// Status no formato do Enum retornado pela API (/api/v1/solicitacoes)
// Se o back-end mudar algum nome, é só ajustar as chaves aqui.
export const STATUS_META = {
  ABERTO: { label: "Em aberto", badge: "bg-[#F39400]/15 text-[#F39400]" },
  EM_ANDAMENTO: { label: "Em andamento", badge: "bg-sky-400/15 text-sky-300" },
  AGUARDANDO_ASSISTENCIA_EXTERNA: { label: "Aguard. externa", badge: "bg-violet-400/15 text-violet-300" },
  CONCLUIDO: { label: "Concluído", badge: "bg-emerald-400/15 text-emerald-300" },
  FINALIZADA: { label: "Finalizada", badge: "bg-white/10 text-white/60" },
  REJEITADA: { label: "Rejeitada", badge: "bg-red-400/15 text-red-300" },
  CANCELADO: { label: "Cancelado", badge: "bg-red-400/15 text-red-300" },
};

export const STATUS_ENCERRADOS = ["CONCLUIDO", "FINALIZADA", "REJEITADA", "CANCELADO"];

export const PRIORIDADE_META = {
  BAIXA: { label: "Baixa", badge: "bg-white/10 text-white/60" },
  MEDIA: { label: "Média", badge: "bg-sky-400/15 text-sky-300" },
  ALTA: { label: "Alta", badge: "bg-[#F39400]/15 text-[#F39400]" },
  URGENTE: { label: "Urgente", badge: "bg-red-400/15 text-red-300" },
};

// Metadados do status com fallback seguro (caso venha um status novo da API)
export function getStatusMeta(status) {
  return STATUS_META[status] || { label: status || "—", badge: "bg-white/10 text-white/60" };
}

export function getPrioridadeMeta(prioridade) {
  return PRIORIDADE_META[prioridade] || null;
}

// Chamado encerrado = concluído, finalizado, rejeitado ou cancelado
export const isEncerrado = (status) => STATUS_ENCERRADOS.includes(status);

export function dataHoje() {
  return new Date().toLocaleDateString("pt-BR");
}

export function dataHoraAgora() {
  const d = new Date();
  const hora = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${d.toLocaleDateString("pt-BR")} ${hora}`;
}

// ISO -> dd/mm/aaaa
export function formatarData(dateString) {
  if (!dateString) return "—";
  const d = new Date(dateString);
  return Number.isNaN(d.getTime()) ? dateString : d.toLocaleDateString("pt-BR");
}

// ISO -> dd/mm/aaaa hh:mm
export function formatarDataHora(dateString) {
  if (!dateString) return "—";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return dateString;
  const hora = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${d.toLocaleDateString("pt-BR")} ${hora}`;
}

// Os 8 primeiros caracteres do UUID, para mostrar como código do chamado
export function codigoCurto(id) {
  return id ? String(id).substring(0, 8) : "";
}

// O DTO pode trazer o técnico de formas diferentes; centralizamos aqui
export function nomeTecnico(chamado) {
  return chamado?.tecnicoNome || chamado?.tecnicoResponsavelNome || chamado?.tecnico?.nome || null;
}

export function idTecnico(chamado) {
  return chamado?.tecnicoId || chamado?.tecnico?.id || null;
}

// Título exibido no card: usa o título se existir, senão "Tipo — Local"
export function tituloChamado(chamado) {
  if (chamado?.titulo) return chamado.titulo;
  if (chamado?.tipo && chamado?.localizacaoProblema) return `${chamado.tipo} — ${chamado.localizacaoProblema}`;
  return chamado?.descricao || "Chamado";
}

export function iniciais(nome) {
  if (!nome) return "—";
  return nome
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
