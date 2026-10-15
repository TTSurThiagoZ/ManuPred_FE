import { STATUS_META } from "../utils/chamados";

// Monta um chamado completo a partir dos dados essenciais,
// gerando um histórico básico quando ele não é informado.
function montar(c) {
  const historico = [
    {
      data: `${c.dataAbertura} 08:15`,
      titulo: "Chamado criado",
      desc: `Aberto por ${c.abertoPor} (ID ${c.abertoPorId}) · status: Em aberto`,
    },
  ];

  if (c.responsavel) {
    historico.push({
      data: `${c.dataAbertura} 11:40`,
      titulo: "Chamado atribuído",
      desc: `Chamado atribuído a ${c.responsavel} · status: Em andamento`,
    });
  }

  if (c.status !== "aberto" && c.status !== "andamento") {
    historico.push({
      data: `${c.dataFinalizacao ?? c.dataAbertura} 16:00`,
      titulo: "Status alterado",
      desc: `Status alterado para ${STATUS_META[c.status].label}`,
    });
  }

  return {
    patrimonio: "",
    anexos: 0,
    ajudantes: [],
    urgente: false,
    responsavel: null,
    dataFinalizacao: null,
    comentarios: [],
    historico,
    ...c,
  };
}

export const SEED_CHAMADOS = [
  montar({
    id: "0513",
    titulo: "Lâmpada queimada no corredor",
    descricao: "A lâmpada do corredor principal queimou e o trecho fica escuro no fim da tarde.",
    status: "aberto",
    tipo: "Elétrico",
    local: "Corredor",
    abertoPor: "João Reis",
    abertoPorId: "1015",
    dataAbertura: "14/08/2026",
  }),
  montar({
    id: "0512",
    titulo: "Vazamento no encanamento do banheiro",
    descricao: "Está vazando água constantemente embaixo da pia do banheiro da sala 12, formando poça no chão.",
    status: "andamento",
    tipo: "Hidráulico",
    local: "Sala 12",
    patrimonio: "4821",
    anexos: 2,
    abertoPor: "Ana Souza",
    abertoPorId: "1043",
    responsavel: "Carlos Lima",
    dataAbertura: "12/08/2026",
    comentarios: [
      {
        autor: "Carlos Lima",
        data: "13/08/2026 09:12",
        texto: "Já fui até a sala, o vazamento é na conexão embaixo da pia. Vou precisar de uma peça nova.",
      },
      {
        autor: "Ana Souza",
        data: "13/08/2026 14:30",
        texto: "Certo, obrigada! A poça de água aumentou um pouco desde ontem.",
      },
    ],
    historico: [
      {
        data: "12/08/2026 08:15",
        titulo: "Chamado criado",
        desc: "Aberto por Ana Souza (ID 1043) · status: Em aberto",
      },
      {
        data: "12/08/2026 11:40",
        titulo: "Chamado atribuído",
        desc: "Fernanda Costa atribuiu o chamado a Carlos Lima · status: Em andamento",
      },
      {
        data: "13/08/2026 09:12",
        titulo: "Comentário adicionado",
        desc: "Carlos Lima comentou sobre a necessidade de peça nova",
      },
      {
        data: "13/08/2026 14:30",
        titulo: "Comentário adicionado",
        desc: "Ana Souza respondeu ao comentário",
      },
    ],
  }),
  montar({
    id: "0511",
    titulo: "Cadeira quebrada na Sala 2",
    descricao: "A cadeira do professor está com o encosto solto e pode causar acidente.",
    status: "aberto",
    tipo: "Mobiliário",
    local: "Sala 2",
    abertoPor: "Ana Souza",
    abertoPorId: "1043",
    dataAbertura: "13/08/2026",
  }),
  montar({
    id: "0509",
    titulo: "Ar-condicionado não gela",
    descricao: "O ar-condicionado liga, mas não resfria a sala e o ambiente fica muito quente.",
    status: "andamento",
    tipo: "Ar-condicionado",
    local: "Sala 22",
    abertoPor: "Beatriz Alves",
    abertoPorId: "1030",
    responsavel: "Carlos Lima",
    ajudantes: ["Marcos Paiva"],
    urgente: true,
    dataAbertura: "10/08/2026",
  }),
  montar({
    id: "0498",
    titulo: "Elevador com ruído estranho",
    descricao: "Ruído metálico durante a subida do elevador do bloco A.",
    status: "externa",
    tipo: "Elétrico",
    local: "Bloco A",
    abertoPor: "Lucas Prado",
    abertoPorId: "1012",
    responsavel: "Renata Silva",
    dataAbertura: "01/08/2026",
  }),
  montar({
    id: "0490",
    titulo: "Troca de fechadura da sala 8",
    descricao: "A fechadura da porta da sala 8 emperrou e precisa ser trocada.",
    status: "concluido",
    tipo: "Outro",
    local: "Sala 8",
    abertoPor: "Juliana Reis",
    abertoPorId: "1050",
    responsavel: "Carlos Lima",
    dataAbertura: "03/08/2026",
  }),
  montar({
    id: "0485",
    titulo: "Pintura da parede do refeitório",
    descricao: "Parede com infiltração e tinta descascando perto da entrada do refeitório.",
    status: "finalizada",
    tipo: "Outro",
    local: "Refeitório",
    abertoPor: "Ana Souza",
    abertoPorId: "1043",
    responsavel: "Marcos Paiva",
    dataAbertura: "05/08/2026",
    dataFinalizacao: "09/08/2026",
  }),
  montar({
    id: "0480",
    titulo: "Solicitação duplicada",
    descricao: "Mesma solicitação do chamado 0471, aberta duas vezes por engano.",
    status: "rejeitada",
    tipo: "Outro",
    local: "Sala 5",
    abertoPor: "Pedro Costa",
    abertoPorId: "1077",
    responsavel: "Carlos Lima",
    dataAbertura: "02/08/2026",
    dataFinalizacao: "02/08/2026",
  }),
  montar({
    id: "0471",
    titulo: "Troca de lâmpadas da Sala 1",
    descricao: "Duas lâmpadas queimadas na Sala 1.",
    status: "finalizada",
    tipo: "Elétrico",
    local: "Sala 1",
    patrimonio: "3310",
    abertoPor: "Roberto Dias",
    abertoPorId: "1022",
    responsavel: "Carlos Lima",
    dataAbertura: "28/07/2026",
    dataFinalizacao: "30/07/2026",
  }),
  montar({
    id: "0463",
    titulo: "Vazamento no bebedouro do corredor",
    descricao: "Bebedouro com vazamento na base, molhando o piso do corredor.",
    status: "finalizada",
    tipo: "Hidráulico",
    local: "Corredor",
    abertoPor: "Camila Ferraz",
    abertoPorId: "1087",
    responsavel: "Renata Silva",
    dataAbertura: "20/07/2026",
    dataFinalizacao: "22/07/2026",
  }),
  montar({
    id: "0450",
    titulo: "Ajuste na porta da Inspetoria",
    descricao: "A porta da Inspetoria está arrastando no chão e não fecha direito.",
    status: "finalizada",
    tipo: "Outro",
    local: "Inspetoria",
    patrimonio: "2894",
    abertoPor: "Paulo Mendes",
    abertoPorId: "1005",
    responsavel: "Marcos Paiva",
    dataAbertura: "10/07/2026",
    dataFinalizacao: "11/07/2026",
  }),
];