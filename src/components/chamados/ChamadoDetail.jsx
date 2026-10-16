import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppShell from "../layout/AppShell";
import { useChamados } from "../../context/chamadosContext";
import { getPersona } from "../../utils/roles";
import { TIPOS, LOCAIS } from "../../utils/chamados";

const fieldClass =
  "w-full py-3 px-4 bg-white border border-stone/20 rounded-2xl font-body text-sm text-charcoal outline-none transition focus:border-amber-600 focus:ring-4 focus:ring-amber-600/10 disabled:bg-stone/5 disabled:text-stone disabled:cursor-not-allowed";
const labelClass = "font-body text-sm text-charcoal mb-1.5 block";
const sectionLabelClass =
  "font-body text-xs font-semibold text-amber-700 uppercase tracking-wider mb-4 pb-2 border-b border-stone/10";

export default function ChamadoDetail({ onLogout }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const persona = getPersona(); // Dados do usuário logado (ex: Ana Souza)
  const { chamados, atualizarChamado, excluirChamado } = useChamados();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modos de tela e controle de formulário
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [validationError, setValidationError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const encontrado = chamados.find((c) => String(c.id) === String(id));

    if (encontrado) {
      setFormData(encontrado);
      setLoading(false);
    } else if (chamados.length > 0) {
      setError("Chamado não encontrado.");
      setLoading(false);
    }
  }, [id, chamados]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // Upload local de arquivo de imagem (sem URL)
  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          imageUrl: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  }

  function handleRemoveImage() {
    setFormData((prev) => ({
      ...prev,
      imageUrl: "",
    }));
  }

  function handleCancel() {
    const original = chamados.find((c) => String(c.id) === String(id));
    setFormData(original);
    setIsEditing(false);
    setValidationError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setValidationError("");

    try {
      setSaving(true);
      // Salva no cofre central de dados do Kipper
      atualizarChamado(id, formData);
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Retorna para a tela de chamados sem pop-ups
      navigate("/chamados");
    } catch (err) {
      setValidationError(err.message || "Erro ao salvar as alterações do chamado.");
    } finally {
      setSaving(false);
    }
  }

  // Função para excluir o chamado
  async function handleDelete() {
    const confirmou = window.confirm("Tem certeza que deseja excluir este chamado? Esta ação não pode ser desfeita.");
    if (!confirmou) return;

    try {
      setSaving(true);
      if (excluirChamado) {
        excluirChamado(id);
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
      navigate("/chamados");
    } catch (err) {
      setValidationError("Erro ao excluir o chamado.");
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AppShell onLogout={onLogout}>
        <div className="max-w-3xl mx-auto px-8 py-12 text-center text-stone font-body">
          <span className="material-symbols-outlined animate-spin text-4xl text-amber-600 mb-2">
            progress_activity
          </span>
          <p>Carregando dados do chamado...</p>
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell onLogout={onLogout}>
        <div className="max-w-3xl mx-auto px-8 py-12 text-center">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700 font-body">
            <p className="font-bold mb-2">Ops! Ocorreu um erro</p>
            <p className="text-sm mb-4">{error}</p>
            <button
              onClick={() => navigate("/chamados")}
              className="px-4 py-2 bg-amber-600 text-white rounded-2xl text-sm font-semibold hover:bg-amber-700 transition"
            >
              Voltar para Chamados
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell onLogout={onLogout}>
      <div className="max-w-3xl mx-auto px-8 py-12">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl text-charcoal">
              {isEditing ? "Alterar chamado" : "Detalhes do chamado"}
            </h1>
            <p className="font-body text-xs text-stone mt-1">Código: #{id}</p>
          </div>

          <div className="flex items-center gap-3">
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="font-body text-sm font-semibold text-white bg-amber-600 border border-amber-600 rounded-2xl px-4 py-2 hover:bg-amber-700 transition-colors shadow-sm flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
                Editar chamado
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate("/chamados")}
              className="font-body text-sm text-stone bg-white border border-stone/20 rounded-2xl px-4 py-2 hover:bg-cream transition-colors"
            >
              ← Voltar
            </button>
          </div>
        </div>

        {/* Mensagem de Erro de Validação */}
        {validationError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm font-body">
            {validationError}
          </div>
        )}

        {/* Formulário Único */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone/10 shadow-sm p-6 md:p-8">
          <fieldset disabled={!isEditing} className="space-y-8">
            
            {/* DADOS DO SOLICITANTE (Sempre fixos do usuário logado) */}
            <div>
              <p className={sectionLabelClass}>Dados do solicitante</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Nome do usuário</label>
                  <input
                    className={`${fieldClass} bg-cream/50 text-stone`}
                    value={formData.solicitante || persona.nome}
                    readOnly
                  />
                </div>
                <div>
                  <label className={labelClass}>ID do usuário</label>
                  <input
                    className={`${fieldClass} bg-cream/50 text-stone`}
                    value={formData.usuarioId || persona.id}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* DETALHES DO PROBLEMA */}
            <div>
              <p className={sectionLabelClass}>Detalhes do problema</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="tipo" className={labelClass}>Tipo de chamado</label>
                  <select
                    id="tipo"
                    name="tipo"
                    className={fieldClass}
                    value={formData.tipo || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione...</option>
                    {TIPOS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="local" className={labelClass}>Localização</label>
                  <select
                    id="local"
                    name="local"
                    className={fieldClass}
                    value={formData.local || ""}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecione...</option>
                    {LOCAIS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="descricao" className={labelClass}>Descrição do problema</label>
                  <textarea
                    id="descricao"
                    name="descricao"
                    className={`${fieldClass} min-h-[110px] resize-y`}
                    placeholder="Descreva o problema com detalhes..."
                    value={formData.descricao || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="patrimonio" className={labelClass}>
                    Nº de patrimônio <span className="text-stone/70 font-normal">(opcional)</span>
                  </label>
                  <input
                    id="patrimonio"
                    name="patrimonio"
                    className={fieldClass}
                    placeholder="Ex: 4821"
                    value={formData.patrimonio || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* ANEXOS / FOTO DO PROBLEMA */}
            <div>
              <p className={sectionLabelClass}>
                Anexos <span className="normal-case font-normal text-stone/70">(opcional)</span>
              </p>

              {formData.imageUrl ? (
                <div className="border border-stone/20 rounded-2xl p-4 bg-cream/30 space-y-3">
                  <img
                    src={formData.imageUrl}
                    alt="Anexo do chamado"
                    className="w-full max-h-60 object-cover rounded-xl"
                  />
                  {isEditing && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="font-body text-xs font-semibold px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 transition"
                      >
                        Remover foto
                      </button>
                    </div>
                  )}
                </div>
              ) : isEditing ? (
                <div>
                  <label className="border-2 border-dashed border-stone/25 rounded-2xl p-8 text-center font-body text-sm text-stone cursor-pointer hover:border-amber-600 hover:bg-cream/40 transition-colors block">
                    <span className="material-symbols-outlined align-middle mr-2 text-[18px]">attach_file</span>
                    Clique para selecionar uma foto/arquivo do problema
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="border border-stone/15 rounded-2xl p-6 text-center font-body text-sm text-stone/70 bg-cream/20">
                  Nenhum anexo enviado neste chamado.
                </div>
              )}
            </div>

          </fieldset>

          {/* BOTÕES DE AÇÃO */}
          {isEditing ? (
            <div className="flex items-center justify-between pt-6 mt-8 border-t border-stone/10">
              {/* Botão de Excluir */}
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="font-body text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-2xl px-5 py-3 hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
                Excluir chamado
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="font-body text-sm font-semibold text-charcoal bg-white border border-stone/20 rounded-2xl px-5 py-3 hover:bg-cream transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="font-body text-sm font-semibold bg-amber-600 text-white rounded-2xl px-6 py-3 shadow-sm hover:bg-amber-700 transition-colors disabled:opacity-50"
                >
                  {saving ? "Salvando..." : "Salvar alterações"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-start pt-6 mt-8 border-t border-stone/10">
              <button
                type="button"
                onClick={handleDelete}
                className="font-body text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-2xl px-5 py-3 hover:bg-red-100 transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
                Excluir chamado
              </button>
            </div>
          )}
        </form>
      </div>
    </AppShell>
  );
}