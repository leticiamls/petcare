import { useEffect, useState } from "react";
import { api } from "../lib/mockDb";
import type { Veterinario } from "../lib/mockDb";
import { Button } from "../components/ui/button";
import { Stethoscope, Phone, Plus, Search, X, ShieldCheck, Trash2 } from "lucide-react";

function formatPhone(tel: string) {
  const d = tel.replace(/\D/g, "");
  if (d.length === 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  return tel;
}

interface FormState { nome: string; crmv: string; telefone: string }
const emptyForm: FormState = { nome: "", crmv: "", telefone: "" };

const CARD_COLORS = ["bg-ciano", "bg-yellow-300", "bg-bege", "bg-green-300", "bg-pink-300"];

export default function Veterinarios() {
  const [vets, setVets]       = useState<Veterinario[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [modal, setModal]     = useState(false);
  const [form, setForm]       = useState<FormState>(emptyForm);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const load = () => api.veterinarios.getAll().then(setVets).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const filtered = vets.filter(
    (v) => v.nome.toLowerCase().includes(search.toLowerCase()) || v.crmv.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await api.veterinarios.create({
        nome: form.nome,
        crmv: form.crmv,
        telefone: form.telefone.replace(/\D/g, ""),
      });
      await load();
      setModal(false);
      setForm(emptyForm);
    } catch (err: unknown) {
      const e = err as { mensagem?: string };
      setError(e?.mensagem ?? "Erro ao cadastrar veterinário");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Inativar este veterinário?")) return;
    await api.veterinarios.delete(id);
    load();
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-ciano font-texto font-semibold text-5xl p-3">
            Veterinários
          </h1>
          <p className="font-texto text-black/60 mt-1">Gerencie a equipe de especialistas do PetCare.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou CRMV..."
              className="w-full pl-10 pr-4 py-2 border-2 border-black rounded-xl bg-white focus:ring-2 focus:ring-ciano outline-none font-texto"
            />
          </div>
          <Button
            onClick={() => setModal(true)}
            className="bg-ciano text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            <Plus size={20} /> Novo
          </Button>
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <div key={i} className="h-52 rounded-3xl bg-black/10 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-black/40 font-texto text-lg">Nenhum veterinário encontrado.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((vet, i) => (
            <div key={vet.id} className="bg-white border-4 border-black rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group">
              <div className={`h-3 border-b-2 border-black ${CARD_COLORS[i % CARD_COLORS.length]}`} />
              <div className="p-6 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:-rotate-3 transition-transform">
                    <Stethoscope size={28} className="text-cianoEscuro" />
                  </div>
                </div>
                <div>
                  <h3 className="font-titulo text-3xl text-black">{vet.nome}</h3>
                </div>
                <div className="space-y-2 py-3 border-y-2 border-dashed border-black/10">
                  <div className="flex items-center justify-between text-sm font-texto font-bold">
                    <span className="text-black/40 uppercase text-xs">Registro</span>
                    <span className="flex items-center gap-1 bg-black text-white px-2 py-0.5 rounded-md text-xs">
                      <ShieldCheck size={12} /> {vet.crmv}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-black/70">
                    <Phone size={16} className="text-cianoEscuro" />
                    <span>{formatPhone(vet.telefone)}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(vet.id)}
                  className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={14} /> Inativar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative flex flex-col gap-5 p-8 bg-bege border-4 border-cianoEscuro shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-[2rem] w-full max-w-md font-texto">
            <button onClick={() => { setModal(false); setForm(emptyForm); setError(null); }}
              className="absolute top-5 right-5 p-1 border-2 border-cianoEscuro rounded-xl hover:bg-red-500 hover:border-red-500 hover:text-white transition-all">
              <X size={22} />
            </button>
            <h2 className="font-titulo text-ciano text-4xl">Novo Veterinário</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-ciano font-bold text-sm ml-1">Nome completo</label>
                <input type="text" required placeholder="Dr. Nome Sobrenome" value={form.nome}
                  onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                  className="w-full p-3 rounded-xl border-2 border-ciano bg-white text-black focus:ring-2 focus:ring-cianoEscuro outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-ciano font-bold text-sm ml-1">CRMV</label>
                <input type="text" required placeholder="CRMV-CE 00000" value={form.crmv}
                  onChange={(e) => setForm((f) => ({ ...f, crmv: e.target.value }))}
                  className="w-full p-3 rounded-xl border-2 border-ciano bg-white text-black focus:ring-2 focus:ring-cianoEscuro outline-none" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-ciano font-bold text-sm ml-1">Telefone</label>
                <input type="tel" required placeholder="(85) 99999-9999" value={form.telefone}
                  onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value }))}
                  className="w-full p-3 rounded-xl border-2 border-ciano bg-white text-black focus:ring-2 focus:ring-cianoEscuro outline-none" />
              </div>

              {error && <p className="text-red-500 text-sm font-semibold text-center bg-red-50 border border-red-200 rounded-xl p-2">{error}</p>}
              <Button variant="primary" type="submit" disabled={saving} className="mt-1 w-full justify-center">
                {saving ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
