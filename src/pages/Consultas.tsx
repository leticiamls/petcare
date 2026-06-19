import { useEffect, useState } from "react";
import { auth } from "../lib/auth";
import { api, BASE_URL } from "../lib/api";
import { Button } from "../components/ui/button";
import { Header } from "../components/ui/header";
import { X, CheckCircle, XCircle, Stethoscope, CalendarDays } from "lucide-react";

// Tipagens
export type Consulta = { id: number; petId: number; veterinarioId: number; data: string; status: "ABERTA" | "FINALIZADA" | "CANCELADA"; descricao: string; sintomas: number[]; medicamentos: number[]; };
export type Pet = { id: number; nome: string; especie: string; donoId: number; ativo: boolean; };
export type Veterinario = { id: number; nome: string; crmv: string; especialidade: string; ativo: boolean; };
export type Sintoma = { id: number; nome: string; };
export type Medicamento = { id: number; nome: string; dose: string; };

type StatusFilter = "TODAS" | "ABERTA" | "FINALIZADA" | "CANCELADA";

const STATUS_BADGE: Record<Consulta["status"], string> = {
  ABERTA: "bg-yellow-300 border-yellow-600 text-yellow-900",
  FINALIZADA: "bg-green-300 border-green-700 text-green-900",
  CANCELADA: "bg-red-200 border-red-500 text-red-800",
};

export default function Consultas() {
  const role = auth.getRole();
  const vetId = auth.getVeterinarioId() ? Number(auth.getVeterinarioId()) : null;

  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [vets, setVets] = useState<Veterinario[]>([]);
  const [sintomas, setSintomas] = useState<Sintoma[]>([]);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter] = useState<StatusFilter>("TODAS");

  // Modal nova consulta
  const [novaModal, setNovaModal] = useState(false);
  const [novaForm, setNovaForm] = useState({ petId: "", veterinarioId: "", data: "", descricao: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal editar consulta
  // Dentro do seu componente Consultas
const [editModal, setEditModal] = useState<Consulta | null>(null);
const [editForm, setEditForm] = useState({
  descricao: "",
  sintomas: [] as number[], // IDs dos sintomas
  medicamentos: [] as number[] // IDs dos medicamentos
});

  const load = async () => {
    try {
      const [resC, resP, resV, resS, resM] = await Promise.all([
        api.consultas.getAll(role === "VET" ? vetId : null),
        api.pets.getAll(),
        api.veterinarios.getAll(),
        api.sintomas.getAll(),
        api.medicamentos.getAll(),
      ]);

      setConsultas(resC);
      setPets(resP);
      setVets(resV);
      setSintomas(resS);
      setMedicamentos(resM);
    } catch (err) {
      console.error("Erro ao carregar dados", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const petNome = (id: number) => pets.find((p) => p.id === id)?.nome ?? "—";
  const vetNome = (id: number) => vets.find((v) => v.id === id)?.nome ?? "—";
  const sintomasNomes = (ids: number[]) => ids.map((id) => sintomas.find((s) => s.id === id)?.nome).filter(Boolean).join(", ") || "—";
  const medsNomes = (ids: number[]) => ids.map((id) => medicamentos.find((m) => m.id === id)?.nome).filter(Boolean).join(", ") || "—";

  const filtered = consultas.filter((c) => {
    const matchSearch = petNome(c.petId).toLowerCase().includes(search.toLowerCase()) ||
                        vetNome(c.veterinarioId).toLowerCase().includes(search.toLowerCase()) ||
                        c.descricao.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "TODAS" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // ── Nova consulta (POST) ──
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

  // ── Cancelar (PATCH) ──
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

  // ── Abrir modal edição ──
  const openEdit = (c: Consulta) => {
  setEditForm({ 
    descricao: c.descricao, 
    sintomas: c.sintomas || [], 
    medicamentos: c.medicamentos || [] 
  });
  setEditModal(c);
};


  const toggleSel = (id: number, list: number[], setter: (v: number[]) => void) => {
    setter(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  };

  // ── Salvar edição (PUT) ──
  const handleSaveEdit = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/consultas/${editModal!.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${auth.getToken()}`
      },
      body: JSON.stringify(editForm)
    });
    
    if (!res.ok) throw new Error("Erro ao salvar prontuário");
    load(); // Recarrega a lista
    setEditModal(null);
  } catch (err) {
    alert("Erro ao salvar!");
  }
};

  // ── Finalizar (PATCH) ──
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
        buttonText={role === "FUNCIONARIO" || role === "ADMIN" ? "Nova Consulta" : undefined}
        searchPlaceholder="Buscar paciente ou motivo..."
        search={search}
        setSearch={setSearch}
        onActionClick={role === "FUNCIONARIO" || role === "ADMIN" ? () => setNovaModal(true) : undefined} 
      />
      
      {loading ? (
        <div className="flex flex-col gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 rounded-2xl bg-black/10 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-black/40 font-texto text-lg">Nenhuma consulta encontrada.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((c) => (
            <div key={c.id} className="bg-white border-4 border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row gap-4 items-start md:items-center">
              {/* Info principal */}
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`text-xs font-black px-3 py-1 rounded-full border-2 ${STATUS_BADGE[c.status]}`}>{c.status}</span>
                  <span className="font-titulo text-2xl text-black">{petNome(c.petId)}</span>
                  <span className="text-black/40 text-sm font-texto">com {vetNome(c.veterinarioId)}</span>
                </div>
                <p className="font-texto text-black/70 text-sm mt-1">{c.descricao}</p>
                <div className="flex gap-4 text-xs font-texto font-semibold text-black/50 mt-1 flex-wrap">
                  <span className="flex items-center gap-1"><CalendarDays size={12} /> {c.data ? new Date(c.data + "T00:00:00").toLocaleDateString("pt-BR") : "Data não definida"}</span>
                  {c.sintomas?.length > 0 && <span>Sintomas: {sintomasNomes(c.sintomas)}</span>}
                  {c.medicamentos?.length > 0 && <span>Medicamentos: {medsNomes(c.medicamentos)}</span>}
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-2 flex-wrap shrink-0">
                {/* VET: editar + finalizar */}
                {role === "VET" && c.status === "ABERTA" && (
                  <>
                    <button onClick={() => openEdit(c)}
                      className="flex items-center gap-1 px-3 py-2 border-2 border-black rounded-xl text-xs font-bold bg-bege hover:bg-yellow-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                      <Stethoscope size={14} /> Preencher
                    </button>
                    <button onClick={() => handleFinalizar(c.id)}
                      className="flex items-center gap-1 px-3 py-2 border-2 border-green-700 rounded-xl text-xs font-bold bg-green-300 hover:bg-green-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                      <CheckCircle size={14} /> Finalizar
                    </button>
                  </>
                )}
                {/* FUNCIONARIO/ADMIN: cancelar */}
                {(role === "FUNCIONARIO" || role === "ADMIN") && c.status === "ABERTA" && (
                  <button onClick={() => handleCancelar(c.id)}
                    className="flex items-center gap-1 px-3 py-2 border-2 border-red-500 rounded-xl text-xs font-bold bg-red-100 hover:bg-red-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <XCircle size={14} /> Cancelar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal: Nova Consulta ────────────────────────────── */}
      {novaModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative flex flex-col gap-5 p-8 bg-bege border-4 border-cianoEscuro shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-[2rem] w-full max-w-md font-texto max-h-[90vh] overflow-y-auto">
            <button onClick={() => { setNovaModal(false); setError(null); }}
              className="absolute top-5 right-5 p-1 border-2 border-cianoEscuro rounded-xl hover:bg-red-500 hover:border-red-500 hover:text-white transition-all">
              <X size={22} />
            </button>
            <h2 className="font-titulo text-ciano text-4xl">Abrir Consulta</h2>

            <form onSubmit={handleNova} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-ciano font-bold text-sm ml-1">Pet</label>
                <select required value={novaForm.petId} onChange={(e) => setNovaForm((f) => ({ ...f, petId: e.target.value }))}
                  className="w-full p-3 rounded-xl border-2 border-ciano bg-white text-black focus:ring-2 focus:ring-cianoEscuro outline-none">
                  <option value="">Selecione o pet</option>
                  {pets.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-ciano font-bold text-sm ml-1">Veterinário</label>
                <select required value={novaForm.veterinarioId} onChange={(e) => setNovaForm((f) => ({ ...f, veterinarioId: e.target.value }))}
                  className="w-full p-3 rounded-xl border-2 border-ciano bg-white text-black focus:ring-2 focus:ring-cianoEscuro outline-none">
                  <option value="">Selecione o veterinário</option>
                  {vets.map((v) => <option key={v.id} value={v.id}>{v.nome}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-ciano font-bold text-sm ml-1">Data</label>
                <input type="date" required value={novaForm.data} onChange={(e) => setNovaForm((f) => ({ ...f, data: e.target.value }))}
                  className="w-full p-3 rounded-xl border-2 border-ciano bg-white text-black focus:ring-2 focus:ring-cianoEscuro outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-ciano font-bold text-sm ml-1">Descrição / Motivo</label>
                <textarea required rows={3} value={novaForm.descricao} onChange={(e) => setNovaForm((f) => ({ ...f, descricao: e.target.value }))}
                  placeholder="Ex.: Pet apresentou febre e apatia..."
                  className="w-full p-3 rounded-xl border-2 border-ciano bg-white text-black focus:ring-2 focus:ring-cianoEscuro outline-none resize-none" />
              </div>

              {error && <p className="text-red-500 text-sm font-semibold text-center bg-red-50 border border-red-200 rounded-xl p-2">{error}</p>}
              <Button variant="primary" type="submit" disabled={saving} className="mt-1 w-full justify-center">
                {saving ? "Abrindo..." : "Abrir Consulta"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Editar Consulta (VET) ──────────────────────────────────── */}
      {editModal && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white border-4 border-black p-8 rounded-3xl w-full max-w-lg shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="font-titulo text-3xl mb-4">Prontuário: {petNome(editModal.petId)}</h2>
      
      <div className="flex flex-col gap-4">
        {/* Campo Diagnóstico/Descrição */}
        <textarea 
          className="w-full p-3 border-2 border-black rounded-xl font-texto"
          placeholder="Descrição do atendimento..."
          value={editForm.descricao}
          onChange={e => setEditForm({...editForm, descricao: e.target.value})}
        />

        {/* Sintomas e Medicamentos (Exemplo com Checkboxes ou Seleção) */}
        <div className="grid grid-cols-2 gap-2">
           {/* Aqui você renderiza a lista de sintomas que vem do backend */}
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        <Button onClick={() => setEditModal(null)} variant="secondary">Cancelar</Button>
        <Button onClick={handleSaveEdit} className="flex-1">Salvar Atendimento</Button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}