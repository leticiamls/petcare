import { useEffect, useState } from "react";
import { auth } from "../lib/auth";
import { api, BASE_URL } from "../lib/api";
import { Button } from "../components/ui/button";
import { Header } from "../components/ui/header";
import {
  X,
  CheckCircle,
  XCircle,
  Stethoscope,
  CalendarDays,
} from "lucide-react";

export type Consulta = {
  id: number;
  petId: number;
  veterinarioId: number;
  data: string;
  status: "ABERTA" | "FINALIZADA" | "CANCELADA";
  descricao: string;
  sintomas: string[];
  medicamentos: string[];
};
export type Pet = {
  id: number;
  nome: string;
  especie: string;
  donoId: number;
  ativo: boolean;
};
export type Veterinario = {
  id: number;
  nome: string;
  crmv: string;
  especialidade: string;
  ativo: boolean;
};

type StatusFilter = "TODAS" | "ABERTA" | "FINALIZADA" | "CANCELADA";

const DIAGNOSTICOS_FIXOS = [
  "Dermatite",
  "Oitite",
  "Gastroenterite",
  "Piometria",
  "Infecção Urinária",
  "Alergia Alimentar",
];
const REMEDIOS_FIXOS = [
  "Dipirona",
  "Probióticos",
  "Vitaminas",
  "Amoxicilina",
  "Omeprazol",
];

const STATUS_BADGE: Record<Consulta["status"], string> = {
  ABERTA: "bg-yellow-300 border-yellow-600 text-yellow-900",
  FINALIZADA: "bg-green-300 border-green-700 text-green-900",
  CANCELADA: "bg-red-200 border-red-500 text-red-800",
};

export default function Consultas() {
  const role = auth.getRole();
  const vetId = auth.getVeterinarioId()
    ? Number(auth.getVeterinarioId())
    : null;

  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [vets, setVets] = useState<Veterinario[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("TODAS");

  const [novaModal, setNovaModal] = useState(false);
  const [novaForm, setNovaForm] = useState({
    petId: "",
    veterinarioId: "",
    data: "",
    descricao: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editModal, setEditModal] = useState<Consulta | null>(null);
  const [editForm, setEditForm] = useState({
    descricao: "",
    sintomas: [] as string[],
    medicamentos: [] as string[],
  });
  const [outroDiagnostico, setOutroDiagnostico] = useState("");
  const [outroRemedio, setOutroRemedio] = useState("");

  const load = async () => {
    try {
      const [resC, resP, resV] = await Promise.all([
        api.consultas.getAll(role === "VET" ? vetId : null).catch((err) => {
          console.error("Erro ao buscar consultas:", err);
          return [];
        }),
        api.pets.getAll().catch((err) => {
          console.error("Erro ao buscar pets:", err);
          return [];
        }),
        api.veterinarios.getAll().catch((err) => {
          console.error("Erro ao buscar veterinários:", err);
          return [];
        }),
      ]);

      setConsultas(resC);
      setPets(resP);
      setVets(resV);
    } catch (err) {
      console.error("Erro ao carregar dados", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const petNome = (id: number) =>
    pets.find((p) => p.id === id)?.nome ?? `Pet #${id} (inativo)`;
  const vetNome = (id: number) => vets.find((v) => v.id === id)?.nome ?? "—";
  const sintomasNomes = (nomes: string[]) =>
    nomes?.length ? nomes.join(", ") : "—";
  const medsNomes = (nomes: string[]) =>
    nomes?.length ? nomes.join(", ") : "—";

  const filtered = consultas.filter((c) => {
    const matchSearch =
      petNome(c.petId).toLowerCase().includes(search.toLowerCase()) ||
      vetNome(c.veterinarioId).toLowerCase().includes(search.toLowerCase()) ||
      c.descricao.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "TODAS" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleNova = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await api.consultas.create({
        petId: Number(novaForm.petId),
        veterinarioId: Number(novaForm.veterinarioId),
        data: novaForm.data,
        descricao: novaForm.descricao,
      });

      await load();
      setNovaModal(false);
      setNovaForm({ petId: "", veterinarioId: "", data: "", descricao: "" });
    } catch (err: unknown) {
      const eObj = err as { message: string };
      setError(eObj.message || "Erro ao abrir consulta.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelar = async (id: number) => {
    if (!confirm("Cancelar esta consulta?")) return;
    try {
      await api.consultas.cancelar(id);
      load();
    } catch (err: unknown) {
      const eObj = err as { message: string };
      alert(eObj.message);
    }
  };

  const openEdit = (c: Consulta) => {
    const sintomasSalvos = c.sintomas || [];
    const medicamentosSalvos = c.medicamentos || [];

    const diagnosticosFixosMarcados = sintomasSalvos.filter((s) =>
      DIAGNOSTICOS_FIXOS.includes(s),
    );
    const outroDiagnosticoSalvo = sintomasSalvos
      .filter((s) => !DIAGNOSTICOS_FIXOS.includes(s))
      .join(", ");

    const remediosFixosMarcados = medicamentosSalvos.filter((m) =>
      REMEDIOS_FIXOS.includes(m),
    );
    const outroRemedioSalvo = medicamentosSalvos
      .filter((m) => !REMEDIOS_FIXOS.includes(m))
      .join(", ");

    setEditForm({
      descricao: c.descricao,
      sintomas: diagnosticosFixosMarcados,
      medicamentos: remediosFixosMarcados,
    });
    setOutroDiagnostico(outroDiagnosticoSalvo);
    setOutroRemedio(outroRemedioSalvo);
    setEditModal(c);
  };

  const toggleItem = (
    nome: string,
    list: string[],
    setter: (v: string[]) => void,
  ) => {
    setter(
      list.includes(nome) ? list.filter((n) => n !== nome) : [...list, nome],
    );
  };

  const handleSaveEdit = async () => {
    try {
      const sintomasFinais = [
        ...editForm.sintomas,
        ...outroDiagnostico
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      ];
      const medicamentosFinais = [
        ...editForm.medicamentos,
        ...outroRemedio
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      ];
      const payload = {
        ...editModal,
        descricao: editForm.descricao,
        sintomas: sintomasFinais,
        medicamentos: medicamentosFinais,
      };

      const res = await fetch(`${BASE_URL}/consultas/${editModal!.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.mensagem || "Erro ao salvar prontuário");
      }
      load();
      setEditModal(null);
    } catch (err: unknown) {
      const eObj = err as { message: string };
      alert(eObj.message || "Erro ao salvar!");
    }
  };

  const handleFinalizar = async (id: number) => {
    if (!confirm("Finalizar esta consulta?")) return;
    try {
      await api.consultas.finalizar(id);

      if (editModal && editModal.id === id) {
        setEditModal(null);
      }

      load();
    } catch (err: unknown) {
      const eObj = err as { message: string };
      alert(eObj.message);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <Header
        title="Consultas"
        buttonText={
          role === "FUNCIONARIO" || role === "ADMIN"
            ? "Nova Consulta"
            : undefined
        }
        searchPlaceholder="Buscar paciente ou motivo..."
        search={search}
        setSearch={setSearch}
        onActionClick={
          role === "FUNCIONARIO" || role === "ADMIN"
            ? () => setNovaModal(true)
            : undefined
        }
      />

      <div className="flex gap-2 flex-wrap">
        {(["TODAS", "ABERTA", "FINALIZADA", "CANCELADA"] as StatusFilter[]).map(
          (s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-xs font-black px-4 py-2 rounded-full border-2 transition-all ${
                statusFilter === s
                  ? "bg-cianoEscuro text-white border-cianoEscuro"
                  : "bg-white text-black/50 border-black/20 hover:border-cianoEscuro hover:text-cianoEscuro"
              }`}
            >
              {s === "TODAS" ? "Todas" : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ),
        )}
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-2xl bg-black/10 animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-black/40 font-texto text-lg">
          Nenhuma consulta encontrada.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((c) => (
            <div key={c.id}>
              {/* ── Card VET ── */}
              {role === "VET" ? (
                <div className="bg-whitePet border-2 border-cianoEscuro rounded-2xl p-5 shadow-[3px_3px_0px_0px_rgba(22,61,52,0.5)] flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="flex-1 flex flex-col gap-1">
                    {/* Nome do pet grande */}
                    <span className="font-titulo text-4xl text-black">
                      {petNome(c.petId)}
                    </span>

                    {/* Descrição */}
                    <p className="font-texto font-bold text-black text-sm">
                      {c.descricao}
                    </p>

                    {/* Sintomas e Medicamentos */}
                    {c.sintomas?.length > 0 && (
                      <p className="font-texto text-sm text-black">
                        <span className="font-bold">Sintomas:</span>{" "}
                        {sintomasNomes(c.sintomas)}
                      </p>
                    )}
                    {c.medicamentos?.length > 0 && (
                      <p className="font-texto text-sm text-black">
                        <span className="font-bold">Medicamentos:</span>{" "}
                        {medsNomes(c.medicamentos)}
                      </p>
                    )}

                    {/* Data */}
                    <span className="flex items-center gap-1 font-texto text-sm text-black mt-1">
                      <CalendarDays size={14} />
                      {c.data
                        ? new Date(c.data + "T00:00:00").toLocaleDateString(
                            "pt-BR",
                          )
                        : "—"}
                    </span>
                  </div>

                  {/* Status + Ações à direita */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {/* Badge de status estilizado */}
                    {c.status === "FINALIZADA" && (
                      <span className="flex items-center gap-2 px-5 py-2 rounded-full border-2 border-cianoEscuro bg-ciano/20 text-cianoEscuro font-texto font-black text-sm">
                        <CheckCircle size={16} /> Finalizada
                      </span>
                    )}
                    {c.status === "CANCELADA" && (
                      <span className="flex items-center gap-2 px-5 py-2 rounded-full border-2 border-red-500 bg-red-100 text-red-700 font-texto font-black text-sm">
                        <XCircle size={16} /> Cancelada
                      </span>
                    )}
                    {c.status === "ABERTA" && (
                      <span className="flex items-center gap-2 px-5 py-2 rounded-full border-2 border-yellow-600 bg-yellow-100 text-yellow-800 font-texto font-black text-sm">
                        Aberta
                      </span>
                    )}

                    {/* Botões apenas para ABERTA */}
                    {c.status === "ABERTA" && (
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={() => openEdit(c)}
                          className="flex items-center gap-1 px-3 py-2 border-2 border-black rounded-xl text-xs font-bold bg-bege hover:bg-yellow-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                        >
                          <Stethoscope size={14} /> Preencher
                        </button>
                        <button
                          onClick={() => handleFinalizar(c.id)}
                          className="flex items-center gap-1 px-3 py-2 border-2 border-green-700 rounded-xl text-xs font-bold bg-green-300 hover:bg-green-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                        >
                          <CheckCircle size={14} /> Finalizar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-whitePet border-2 border-cianoEscuro rounded-2xl p-5 shadow-[3px_3px_0px_0px_rgba(22,61,52,0.5)] flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="flex-1 flex flex-col gap-1">
                    {/* Nome do pet + veterinário */}
                    <div className="flex items-baseline gap-3">
                      <span className="font-titulo text-4xl text-black">
                        {petNome(c.petId)}
                      </span>
                      <span className="font-texto text-sm text-black/50">
                        com {vetNome(c.veterinarioId)}
                      </span>
                    </div>

                    {/* Descrição */}
                    <p className="font-texto font-bold text-black text-sm">
                      {c.descricao}
                    </p>

                    {/* Sintomas e Medicamentos */}
                    {c.sintomas?.length > 0 && (
                      <p className="font-texto text-sm text-black">
                        <span className="font-bold">Sintomas:</span>{" "}
                        {sintomasNomes(c.sintomas)}
                      </p>
                    )}
                    {c.medicamentos?.length > 0 && (
                      <p className="font-texto text-sm text-black">
                        <span className="font-bold">Medicamentos:</span>{" "}
                        {medsNomes(c.medicamentos)}
                      </p>
                    )}

                    {/* Data */}
                    <span className="flex items-center gap-1 font-texto text-sm text-black mt-1">
                      <CalendarDays size={14} />
                      {c.data
                        ? new Date(c.data + "T00:00:00").toLocaleDateString(
                            "pt-BR",
                          )
                        : "—"}
                    </span>
                  </div>

                  {/* Status + Ações à direita */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {c.status === "FINALIZADA" && (
                      <span className="flex items-center gap-2 px-5 py-2 rounded-full border-2 border-cianoEscuro bg-ciano/20 text-cianoEscuro font-texto font-black text-sm">
                        <CheckCircle size={16} /> Finalizada
                      </span>
                    )}
                    {c.status === "CANCELADA" && (
                      <span className="flex items-center gap-2 px-5 py-2 rounded-full border-2 border-red-500 bg-red-100 text-red-700 font-texto font-black text-sm">
                        <XCircle size={16} /> Cancelada
                      </span>
                    )}
                    {c.status === "ABERTA" && (
                      <span className="flex items-center gap-2 px-5 py-2 rounded-full border-2 border-yellow-600 bg-yellow-100 text-yellow-800 font-texto font-black text-sm">
                        Aberta
                      </span>
                    )}

                    {/* Botão cancelar apenas para ABERTA */}
                    {(role === "FUNCIONARIO" || role === "ADMIN") &&
                      c.status === "ABERTA" && (
                        <button
                          onClick={() => handleCancelar(c.id)}
                          className="flex items-center gap-1 px-3 py-2 border-2 border-red-500 rounded-xl text-xs font-bold bg-red-100 hover:bg-red-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                        >
                          <XCircle size={14} /> Cancelar
                        </button>
                      )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {novaModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative flex flex-col gap-5 p-8 bg-bege border-4 border-cianoEscuro shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-[2rem] w-full max-w-md font-texto max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setNovaModal(false);
                setError(null);
              }}
              className="absolute top-5 right-5 p-1 border-2 border-cianoEscuro rounded-xl hover:bg-red-500 hover:border-red-500 hover:text-white transition-all"
            >
              <X size={22} />
            </button>
            <h2 className="font-titulo text-ciano text-4xl">Abrir Consulta</h2>

            <form onSubmit={handleNova} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-ciano font-bold text-sm ml-1">Pet</label>
                <select
                  required
                  value={novaForm.petId}
                  onChange={(e) =>
                    setNovaForm((f) => ({ ...f, petId: e.target.value }))
                  }
                  className="w-full p-3 rounded-xl border-2 border-ciano bg-white text-black focus:ring-2 focus:ring-cianoEscuro outline-none"
                >
                  <option value="">Selecione o pet</option>
                  {pets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-ciano font-bold text-sm ml-1">
                  Veterinário
                </label>
                <select
                  required
                  value={novaForm.veterinarioId}
                  onChange={(e) =>
                    setNovaForm((f) => ({
                      ...f,
                      veterinarioId: e.target.value,
                    }))
                  }
                  className="w-full p-3 rounded-xl border-2 border-ciano bg-white text-black focus:ring-2 focus:ring-cianoEscuro outline-none"
                >
                  <option value="">Selecione o veterinário</option>
                  {vets.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-ciano font-bold text-sm ml-1">
                  Data
                </label>
                <input
                  type="date"
                  required
                  value={novaForm.data}
                  onChange={(e) =>
                    setNovaForm((f) => ({ ...f, data: e.target.value }))
                  }
                  className="w-full p-3 rounded-xl border-2 border-ciano bg-white text-black focus:ring-2 focus:ring-cianoEscuro outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-ciano font-bold text-sm ml-1">
                  Descrição / Motivo
                </label>
                <textarea
                  required
                  rows={3}
                  value={novaForm.descricao}
                  onChange={(e) =>
                    setNovaForm((f) => ({ ...f, descricao: e.target.value }))
                  }
                  placeholder="Ex.: Pet apresentou febre e apatia..."
                  className="w-full p-3 rounded-xl border-2 border-ciano bg-white text-black focus:ring-2 focus:ring-cianoEscuro outline-none resize-none"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm font-semibold text-center bg-red-50 border border-red-200 rounded-xl p-2">
                  {error}
                </p>
              )}
              <Button
                variant="primary"
                type="submit"
                disabled={saving}
                className="mt-1 w-full justify-center"
              >
                {saving ? "Abrindo..." : "Abrir Consulta"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {editModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative flex flex-col gap-6 p-8 bg-bege border-4 border-cianoEscuro shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-[2rem] w-full max-w-lg font-texto max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setEditModal(null);
                setOutroDiagnostico("");
                setOutroRemedio("");
              }}
              className="absolute top-5 right-5 p-1 border-2 border-cianoEscuro rounded-xl hover:bg-red-500 hover:border-red-500 hover:text-white transition-all"
            >
              <X size={22} />
            </button>

            <h2 className="font-titulo text-ciano text-4xl text-center">
              Preencher Consulta
            </h2>

            {/* Pet e Vet — somente leitura */}
            <div className="flex flex-col gap-1">
              <label className="text-cianoEscuro font-titulo text-3xl">
                {petNome(editModal.petId)}
              </label>
              <label className="text-cianoEscuro font-medium text-base">
                {editModal.data
                  ? new Date(editModal.data + "T00:00:00").toLocaleDateString(
                      "pt-BR",
                    )
                  : "—"}
              </label>
            </div>

            {/* Diagnósticos */}
            <div className="flex flex-col gap-2">
              <label className="text-cianoEscuro font-black text-base">
                Diagnósticos
              </label>
              <div className="border-2 border-ciano rounded-xl p-4 bg-white flex flex-col gap-2">
                {DIAGNOSTICOS_FIXOS.map((nome) => (
                  <label
                    key={nome}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={editForm.sintomas.includes(nome)}
                      onChange={() =>
                        toggleItem(nome, editForm.sintomas, (v) =>
                          setEditForm({ ...editForm, sintomas: v }),
                        )
                      }
                      className="w-4 h-4 accent-ciano cursor-pointer"
                    />
                    <span className="font-texto text-black text-sm group-hover:text-ciano transition-colors">
                      {nome}
                    </span>
                  </label>
                ))}
                <label className="flex items-center gap-2 text-sm font-texto mt-1">
                  <span className="shrink-0 text-black/50">Outro:</span>
                  <input
                    type="text"
                    value={outroDiagnostico}
                    onChange={(e) => setOutroDiagnostico(e.target.value)}
                    placeholder="separar por vírgula se mais de um"
                    className="flex-1 border-b-2 border-cianoEscuro/40 outline-none focus:border-cianoEscuro bg-transparent py-1 text-black"
                  />
                </label>
              </div>
            </div>

            {/* Remédios Prescritos */}
            <div className="flex flex-col gap-2">
              <label className="text-cianoEscuro font-black text-base">
                Remédios Prescritos
              </label>
              <div className="border-2 border-ciano rounded-xl p-4 bg-white flex flex-col gap-2">
                {REMEDIOS_FIXOS.map((nome) => (
                  <label
                    key={nome}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={editForm.medicamentos.includes(nome)}
                      onChange={() =>
                        toggleItem(nome, editForm.medicamentos, (v) =>
                          setEditForm({ ...editForm, medicamentos: v }),
                        )
                      }
                      className="w-4 h-4 accent-ciano cursor-pointer"
                    />
                    <span className="font-texto text-black text-sm group-hover:text-ciano transition-colors">
                      {nome}
                    </span>
                  </label>
                ))}
                <label className="flex items-center gap-2 text-sm font-texto mt-1">
                  <span className="shrink-0 text-black/50">Outro:</span>
                  <input
                    type="text"
                    value={outroRemedio}
                    onChange={(e) => setOutroRemedio(e.target.value)}
                    placeholder="separar por vírgula se mais de um"
                    className="flex-1 border-b-2 border-cianoEscuro/40 outline-none focus:border-cianoEscuro bg-transparent py-1 text-black"
                  />
                </label>
              </div>
            </div>

            {/* Observações */}
            <div className="flex flex-col gap-1">
              <label className="text-cianoEscuro font-black text-base">
                Observações
              </label>
              <textarea
                rows={3}
                value={editForm.descricao}
                onChange={(e) =>
                  setEditForm({ ...editForm, descricao: e.target.value })
                }
                placeholder="Anotações adicionais sobre a consulta..."
                className="w-full p-3 rounded-xl border-2 border-ciano bg-white text-black focus:ring-2 focus:ring-cianoEscuro outline-none resize-none"
              />
            </div>

            {/* Botões */}
            <div className="flex gap-3 mt-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setEditModal(null);
                  setOutroDiagnostico("");
                  setOutroRemedio("");
                }}
                className="flex-1 justify-center"
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveEdit}
                className="flex-1 justify-center"
              >
                Registrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
