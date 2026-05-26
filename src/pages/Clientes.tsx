import { useEffect, useState } from "react";
import { api } from "../lib/mockDb";
import type { Cliente } from "../lib/mockDb";
import { Button } from "../components/ui/button";
import { User, Phone, Plus, Search, X, Trash2 } from "lucide-react";

function formatPhone(tel: string) {
  const d = tel.replace(/\D/g, "");
  if (d.length === 11) return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
  return tel;
}

function formatCpf(cpf: string) {
  const d = cpf.replace(/\D/g, "");
  if (d.length === 11) return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9)}`;
  return cpf;
}

interface FormState { nome: string; cpf: string; telefone: string }
const emptyForm: FormState = { nome: "", cpf: "", telefone: "" };

export default function Clientes() {
  const [clientes, setClientes]   = useState<Cliente[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [modal, setModal]         = useState(false);
  const [form, setForm]           = useState<FormState>(emptyForm);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const load = () => api.clientes.getAll().then(setClientes).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const filtered = clientes.filter((c) =>
    c.nome.toLowerCase().includes(search.toLowerCase()) ||
    c.cpf.includes(search)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await api.clientes.create({
        nome: form.nome,
        cpf: formatCpf(form.cpf),
        telefone: form.telefone.replace(/\D/g, ""),
      });
      await load();
      setModal(false);
      setForm(emptyForm);
    } catch (err: unknown) {
      const e = err as { mensagem?: string };
      setError(e?.mensagem ?? "Erro ao cadastrar cliente");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Inativar este cliente?")) return;
    await api.clientes.delete(id);
    load();
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-ciano font-texto font-semibold text-5xl p-3">
          Clientes
        </h1>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou CPF..."
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
          {[...Array(4)].map((_, i) => <div key={i} className="h-44 rounded-3xl bg-black/10 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-black/40 font-texto text-lg">
          {search ? "Nenhum cliente encontrado." : "Nenhum cliente cadastrado ainda."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <div key={c.id} className="bg-white border-4 border-black rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-3 hover:rotate-1 transition-transform">
              <div className="flex items-center gap-3 border-b-2 border-black pb-3">
                <div className="p-2 bg-ciano rounded-lg border-2 border-black">
                  <User size={22} className="text-white" />
                </div>
                <h3 className="font-titulo text-2xl text-black truncate">{c.nome}</h3>
              </div>
              <div className="flex flex-col gap-2 font-texto text-black/80 text-sm">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-cianoEscuro" />
                  <span className="font-semibold">{formatPhone(c.telefone)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-black/40 text-xs font-bold uppercase">CPF</span>
                  <span className="text-sm">{c.cpf}</span>
                </div>
              </div>
              <div className="mt-auto pt-2">
                <button
                  onClick={() => handleDelete(c.id)}
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
            <h2 className="font-titulo text-ciano text-4xl">Novo Cliente</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {[
                { label: "Nome completo", name: "nome", type: "text", placeholder: "João da Silva", required: true },
                { label: "CPF",          name: "cpf",  type: "text", placeholder: "000.000.000-00", required: true },
                { label: "Telefone",     name: "telefone", type: "tel", placeholder: "(85) 99999-9999", required: true },
              ].map(({ label, name, type, placeholder, required }) => (
                <div key={name} className="flex flex-col gap-1">
                  <label className="text-ciano font-bold text-sm ml-1">{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    required={required}
                    value={(form as unknown as Record<string, string>)[name]}
                    onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
                    className="w-full p-3 rounded-xl border-2 border-ciano bg-white text-black focus:ring-2 focus:ring-cianoEscuro outline-none"
                  />
                </div>
              ))}

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
