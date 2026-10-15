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

export const TECNICOS = ["Carlos Lima", "Renata Silva", "Marcos Paiva"];

export const STATUS_META = {
  aberto: { label: "Em aberto", badge: "bg-amber-100 text-amber-700" },
  andamento: { label: "Em andamento", badge: "bg-blue-100 text-blue-700" },
  externa: { label: "Aguard. externa", badge: "bg-purple-100 text-purple-700" },
  concluido: { label: "Concluída", badge: "bg-emerald-100 text-emerald-700" },
  finalizada: { label: "Finalizada", badge: "bg-slate-100 text-slate-600" },
  rejeitada: { label: "Rejeitada", badge: "bg-red-100 text-red-700" },
};

export const STATUS_ENCERRADOS = ["finalizada", "rejeitada"];

export function dataHoje() {
  return new Date().toLocaleDateString("pt-BR");
}

export function dataHoraAgora() {
  const d = new Date();
  const hora = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${d.toLocaleDateString("pt-BR")} ${hora}`;
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