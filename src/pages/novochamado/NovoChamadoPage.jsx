// Novo Chamado — rota: /chamados/novo (USER_ROLE e ADMIN_ROLE)
// Formulário de abertura de chamado com foto opcional, enviado para a API em multipart.

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../../shared/components/Layout";
import { useUserStore } from "../../store/user";
import { solicitacaoService } from "../../shared/services/solicitacaoService";
import { TIPOS, LOCAIS } from "../../utils/chamados";

const fieldClass =
  "w-full py-3 px-4 bg-[#241F1A] border border-white/10 rounded-2xl font-body text-sm text-white placeholder:text-white/30 outline-none transition focus:border-[#F39400] focus:ring-4 focus:ring-[#F39400]/10 [&>option]:bg-[#1C1814]";
const labelClass = "font-body text-sm text-white/80 mb-1.5 block";
const sectionLabelClass = "font-body text-xs font-semibold text-[#F39400] uppercase tracking-wider mb-4 pb-2 border-b border-white/10";

const NovoChamadoPage = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user); // Dados do usuário logado

  const [tipo, setTipo] = useState("");
  const [local, setLocal] = useState("");
  const [descricao, setDescricao] = useState("");
  const [patrimonio, setPatrimonio] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // só para a pré-visualização
  const [arquivo, setArquivo] = useState(null); // arquivo real que vai para a API
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArquivo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setEnviando(true);
    try {
      // Envia os dados do chamado + a foto (se tiver) para POST /api/v1/solicitacoes
      const novo = await solicitacaoService.criar(
        {
          tipo,
          localizacaoProblema: local,
          descricao: descricao.trim(),
          numeroPatrimonio: patrimonio.trim() || null,
        },
        arquivo ? [arquivo] : []
      );
      navigate(novo?.id ? `/chamados/${novo.id}` : "/chamados", { replace: true });
    } catch (err) {
      console.error("Erro ao abrir chamado:", err);
      setErro(err.response?.data?.message || err.message || "Não foi possível abrir o chamado.");
    } finally {
      setEnviando(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    setArquivo(null);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl text-white">Abrir novo chamado</h1>
          <button
            onClick={() => navigate(-1)}
            className="font-body text-sm text-white/80 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 hover:bg-white/10 transition-colors cursor-pointer"
          >
            ← Voltar
          </button>
        </div>

        {erro && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-400/20 text-red-300 rounded-2xl text-sm font-body">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-[#1C1814] rounded-2xl border border-white/10 p-6 md:p-8">
          <p className={sectionLabelClass}>Dados do solicitante</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div>
              <label className={labelClass}>Nome do usuário</label>
              <input className={`${fieldClass} bg-white/5 text-white/50`} value={user?.nome ?? ""} readOnly />
            </div>
            <div>
              <label className={labelClass}>E-mail</label>
              <input className={`${fieldClass} bg-white/5 text-white/50`} value={user?.email ?? ""} readOnly />
            </div>
          </div>

          <p className={sectionLabelClass}>Detalhes do problema</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="tipo" className={labelClass}>Tipo de chamado</label>
              <select id="tipo" className={fieldClass} value={tipo} onChange={(e) => setTipo(e.target.value)} required>
                <option value="">Selecione...</option>
                {TIPOS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="local" className={labelClass}>Localização</label>
              <select id="local" className={fieldClass} value={local} onChange={(e) => setLocal(e.target.value)} required>
                <option value="">Selecione...</option>
                {LOCAIS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="descricao" className={labelClass}>Descrição do problema</label>
              <textarea
                id="descricao"
                className={`${fieldClass} min-h-[110px] resize-y`}
                placeholder="Descreva o problema com detalhes..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="patrimonio" className={labelClass}>
                Nº de patrimônio <span className="text-white/40 font-normal">(opcional)</span>
              </label>
              <input id="patrimonio" className={fieldClass} placeholder="Ex: 4821" value={patrimonio} onChange={(e) => setPatrimonio(e.target.value)} />
            </div>
          </div>

          <p className={sectionLabelClass}>
            Anexos <span className="normal-case font-normal text-white/40">(opcional)</span>
          </p>

          {imageUrl ? (
            <div className="border border-white/10 rounded-2xl p-4 bg-white/5 space-y-3 mb-8">
              <img
                src={imageUrl}
                alt="Pré-visualização do anexo"
                className="w-full max-h-60 object-cover rounded-xl"
              />
              <div className="flex items-center justify-between gap-3">
                <span className="font-body text-xs text-white/50 truncate">{arquivo?.name}</span>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="font-body text-xs font-semibold px-4 py-2 text-red-300 bg-red-500/10 border border-red-400/20 rounded-xl hover:bg-red-500/20 transition cursor-pointer"
                >
                  Remover foto
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-8">
              <label className="border-2 border-dashed border-white/15 rounded-2xl p-8 text-center font-body text-sm text-white/50 cursor-pointer hover:border-[#F39400] hover:bg-[#F39400]/5 transition-colors block">
                <span className="material-symbols-outlined align-middle mr-2 text-[18px]">attach_file</span>
                Clique para selecionar uma foto do problema
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="font-body text-sm font-semibold text-white/80 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="font-body text-sm font-semibold bg-[#F39400] text-[#241F1A] rounded-2xl px-6 py-3 shadow-sm hover:bg-[#F39400]/90 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {enviando ? "Enviando..." : "Enviar chamado"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default NovoChamadoPage
