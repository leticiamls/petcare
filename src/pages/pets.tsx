import { useEffect, useState } from "react";
import { api } from "../lib/mockDb";
import type { Pet, Cliente } from "../lib/mockDb";
import { Button } from "../components/ui/button";
import { Dog, Cat, Plus, Search, X, Trash2, Rabbit } from "lucide-react";

const PetIcon = ({ especie }: { especie: Pet["especie"] }) => {
  if (especie === "Gato") return <Cat size={32} />;
  if (especie === "Cachorro") return <Dog size={32} />;
  return <Rabbit size={32} />;
};

const calcAge = (dataNascimento: string) => {
  const years = new Date().getFullYear() - new Date(dataNascimento).getFullYear();
  return years <= 0 ? "< 1 ano" : years === 1 ? "1 ano" : `${years} anos`;
};

interface FormState {
  nome: string; especie: Pet["especie"]; raca: string;
  dataNascimento: string; clienteId: string;
}
const emptyForm: FormState = { nome: "", especie: "Cachorro", raca: "", dataNascimento: "", clienteId: "" };

export default function Pets() {
  const [pets, setPets]         = useState<Pet[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [modal, setModal]       = useState(false);
  const [form, setForm]         = useState<FormState>(emptyForm);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const load = () =>
    Promise.all([api.pets.getAll(), api.clientes.getAll()])
      .then(([p, c]) => { setPets(p); setClientes(c); })
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const clienteNome = (id: number) => clientes.find((c) => c.id === id)?.nome ?? "—";

  const filtered = pets.filter(
    (p) =>
      p.nome.toLowerCase().includes(search.toLowerCase()) ||
      p.raca.toLowerCase().includes(search.toLowerCase()) ||
      p.especie.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await api.pets.create({
        nome: form.nome,
        especie: form.especie,
        raca: form.raca,
        dataNascimento: form.dataNascimento,
        clienteId: Number(form.clienteId),
      });
      await load();
      setModal(false);
      setForm(emptyForm);
    } catch (err: unknown) {
      const e = err as { mensagem?: string };
      setError(e?.mensagem ?? "Erro ao cadastrar pet");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Inativar este pet?")) return;
    await api.pets.delete(id);
    load();
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-ciano font-texto font-semibold text-5xl p-3">
          Pets
        </h1>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, raça ou espécie..."
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
          {[...Array(6)].map((_, i) => <div key={i} className="h-48 rounded-3xl bg-black/10 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-black/40 font-texto text-lg">Nenhum pet encontrado.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((pet) => (
            <div
              key={pet.id}
              className="bg-ciano border-4 border-black rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
                <div className="p-3 bg-bege border-2 border-black rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <PetIcon especie={pet.especie} />
                </div>
                <span className="text-xs font-black bg-bege border-2 border-black px-3 py-1 rounded-full uppercase">{pet.especie}</span>
              </div>

              <h3 className="font-titulo text-bege text-4xl">{pet.nome}</h3>

              <div className="font-texto font-semibold text-bege/80 text-sm space-y-1">
                <p>Raça: <span className="text-bege">{pet.raca}</span></p>
                <p>Idade: <span className="text-bege">{calcAge(pet.dataNascimento)}</span></p>
                <p>Tutor: <span className="text-bege">{clienteNome(pet.clienteId)}</span></p>
              </div>

              <div className="mt-auto pt-3 border-t-2 border-bege/20 flex justify-between items-center">
                <span className="text-xs font-bold text-bege/60 uppercase">
                  Nasc.: {new Date(pet.dataNascimento + "T00:00:00").toLocaleDateString("pt-BR")}
                </span>
                <button
                  onClick={() => handleDelete(pet.id)}
                  className="flex items-center gap-1 text-xs font-bold text-red-300 hover:text-red-100 transition-colors"
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
            <h2 className="font-titulo text-ciano text-4xl">Novo Pet</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Cliente */}
              <div className="flex flex-col gap-1">
                <label className="text-ciano font-bold text-sm ml-1">Tutor (Cliente)</label>
                <select
                  required
                  value={form.clienteId}
                  onChange={(e) => setForm((f) => ({ ...f, clienteId: e.target.value }))}
                  className="w-full p-3 rounded-xl border-2 border-ciano bg-white text-black focus:ring-2 focus:ring-cianoEscuro outline-none"
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </div>

              {/* Nome */}
              <div className="flex flex-col gap-1">
                <label className="text-ciano font-bold text-sm ml-1">Nome do Pet</label>
                <input type="text" required placeholder="Ex.: Lola" value={form.nome}
                  onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                  className="w-full p-3 rounded-xl border-2 border-ciano bg-white text-black focus:ring-2 focus:ring-cianoEscuro outline-none" />
              </div>

              {/* Espécie */}
              <div className="flex flex-col gap-1">
                <label className="text-ciano font-bold text-sm ml-1">Espécie</label>
                <select value={form.especie} onChange={(e) => setForm((f) => ({ ...f, especie: e.target.value as Pet["especie"] }))}
                  className="w-full p-3 rounded-xl border-2 border-ciano bg-white text-black focus:ring-2 focus:ring-cianoEscuro outline-none">
                  <option>Cachorro</option>
                  <option>Gato</option>
                  <option>Outro</option>
                </select>
              </div>

              {/* Raça */}
              <div className="flex flex-col gap-1">
                <label className="text-ciano font-bold text-sm ml-1">Raça</label>
                <input type="text" required placeholder="Ex.: Golden Retriever" value={form.raca}
                  onChange={(e) => setForm((f) => ({ ...f, raca: e.target.value }))}
                  className="w-full p-3 rounded-xl border-2 border-ciano bg-white text-black focus:ring-2 focus:ring-cianoEscuro outline-none" />
              </div>

              {/* Data de nascimento */}
              <div className="flex flex-col gap-1">
                <label className="text-ciano font-bold text-sm ml-1">Data de Nascimento</label>
                <input type="date" required value={form.dataNascimento}
                  onChange={(e) => setForm((f) => ({ ...f, dataNascimento: e.target.value }))}
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
