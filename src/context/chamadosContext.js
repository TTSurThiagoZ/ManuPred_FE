import React, { useState, createContext, useContext } from "react";
import { SEED_CHAMADOS } from "../data/seedChamados";
import { STATUS_META, STATUS_ENCERRADOS, dataHoje, dataHoraAgora } from "../utils/chamados";

export const ChamadosContext = createContext(null);

export function useChamados() {
  const ctx = useContext(ChamadosContext);
  if (!ctx) {
    throw new Error("useChamados precisa ser usado dentro de <ChamadosProvider>");
  }
  return ctx;
}

function proximoId(lista) {
  const maior = lista.reduce((m, c) => Math.max(m, Number(c.id) || 0), 0);
  return String(maior + 1).padStart(4, "0");
}

function evento(titulo, desc) {
  return { data: dataHoraAgora(), titulo, desc };
}

export function ChamadosProvider({ children }) {
  const [chamados, setChamados] = useState(SEED_CHAMADOS);

  const atualizar = (id, fn) =>
    setChamados((prev) => prev.map((c) => (c.id === id ? fn(c) : c)));

  // Excluir chamado definitivamente do estado
  const excluirChamado = (id) => {
    setChamados((prev) => prev.filter((c) => String(c.id) !== String(id)));
  };

  // Usuário abre um chamado novo (captura a imagem em qualquer formato enviado)
  const criarChamado = (dadosNovoChamado, autor) => {
    // Pega a imagem de qualquer propriedade que o NovoChamado possa ter enviado
    const imagemRecebida = 
      dadosNovoChamado.imageUrl || 
      dadosNovoChamado.foto || 
      dadosNovoChamado.imagem || 
      "";

    setChamados((prev) => [
      {
        id: proximoId(prev),
        titulo: `${dadosNovoChamado.tipo} — ${dadosNovoChamado.local}`,
        descricao: dadosNovoChamado.descricao,
        tipo: dadosNovoChamado.tipo,
        local: dadosNovoChamado.local,
        patrimonio: (dadosNovoChamado.patrimonio ?? "").trim(),
        // Atribui a imagem a TODAS as chaves para o Detail reconhecer sem falhas
        imageUrl: imagemRecebida,
        foto: imagemRecebida,
        imagem: imagemRecebida,
        anexos: imagemRecebida ? 1 : (dadosNovoChamado.anexos ?? 0),
        status: "aberto",
        urgente: false,
        abertoPor: autor.nome,
        abertoPorId: autor.id,
        responsavel: null,
        ajudantes: [],
        dataAbertura: dataHoje(),
        dataFinalizacao: null,
        comentarios: [],
        historico: [
          evento("Chamado criado", `Aberto por ${autor.nome} (ID ${autor.id}) · status: Em aberto`),
        ],
      },
      ...prev,
    ]);
  };

  // Atualiza os dados editados de um chamado
  const atualizarChamado = (id, dadosAtualizados, atorNome = "Usuário") => {
    atualizar(id, (c) => {
      const imagemAtualizada = 
        dadosAtualizados.imageUrl || 
        dadosAtualizados.foto || 
        dadosAtualizados.imagem || 
        c.imageUrl || 
        c.foto || 
        c.imagem || 
        "";

      return {
        ...c,
        ...dadosAtualizados,
        imageUrl: imagemAtualizada,
        foto: imagemAtualizada,
        imagem: imagemAtualizada,
        historico: [
          ...c.historico,
          evento("Chamado editado", `${atorNome} atualizou as informações do chamado`),
        ],
      };
    });
  };

  const moverChamado = (id, novoStatus, ator) => {
    atualizar(id, (c) => {
      if (c.status === novoStatus) return c;

      let responsavel = c.responsavel;
      if (novoStatus === "aberto") responsavel = null;
      if (novoStatus === "andamento" && !responsavel && ator.role === "tecnico") {
        responsavel = ator.nome;
      }

      return {
        ...c,
        status: novoStatus,
        responsavel,
        dataFinalizacao: STATUS_ENCERRADOS.includes(novoStatus) ? dataHoje() : null,
        historico: [
          ...c.historico,
          evento(
            "Status alterado",
            `${ator.nome} alterou o status: ${STATUS_META[c.status].label} → ${STATUS_META[novoStatus].label}`
          ),
        ],
      };
    });
  };

  const assumirChamado = (id, ator) => {
    atualizar(id, (c) => ({
      ...c,
      status: "andamento",
      responsavel: ator.nome,
      historico: [
        ...c.historico,
        evento("Chamado assumido", `${ator.nome} assumiu o chamado · status: Em andamento`),
      ],
    }));
  };

  const atribuirChamado = (id, tecnico, ator) => {
    atualizar(id, (c) => {
      const novoStatus = c.status === "aberto" ? "andamento" : c.status;
      const mudouStatus = novoStatus !== c.status;
      return {
        ...c,
        responsavel: tecnico,
        status: novoStatus,
        historico: [
          ...c.historico,
          evento(
            "Chamado atribuído",
            `${ator.nome} atribuiu o chamado a ${tecnico}${mudouStatus ? " · status: Em andamento" : ""}`
          ),
        ],
      };
    });
  };

  const adicionarAjudante = (id, nome, ator) => {
    atualizar(id, (c) => {
      if (c.responsavel === nome || c.ajudantes.includes(nome)) return c;
      return {
        ...c,
        ajudantes: [...c.ajudantes, nome],
        historico: [
          ...c.historico,
          evento("Ajudante adicionado", `${ator.nome} adicionou ${nome} como ajudante`),
        ],
      };
    });
  };

  const marcarUrgente = (id, ator) => {
    atualizar(id, (c) => ({
      ...c,
      urgente: true,
      historico: [
        ...c.historico,
        evento("Marcado como urgente", `${ator.nome} marcou o chamado como urgente`),
      ],
    }));
  };

  const comentar = (id, texto, ator) => {
    const limpo = texto.trim();
    if (!limpo) return;
    atualizar(id, (c) => ({
      ...c,
      comentarios: [...c.comentarios, { autor: ator.nome, data: dataHoraAgora(), texto: limpo }],
      historico: [
        ...c.historico,
        evento("Comentário adicionado", `${ator.nome} comentou no chamado`),
      ],
    }));
  };

  const cancelarChamado = (id, ator) => {
    atualizar(id, (c) => ({
      ...c,
      status: "rejeitada",
      dataFinalizacao: dataHoje(),
      historico: [
        ...c.historico,
        evento("Chamado cancelado", `${ator.nome} cancelou o chamado · status: Rejeitada`),
      ],
    }));
  };

  return React.createElement(
    ChamadosContext.Provider,
    {
      value: {
        chamados,
        criarChamado,
        atualizarChamado,
        excluirChamado,
        moverChamado,
        assumirChamado,
        atribuirChamado,
        adicionarAjudante,
        marcarUrgente,
        comentar,
        cancelarChamado,
      },
    },
    children
  );
}