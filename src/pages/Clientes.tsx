import { useEffect, useState } from "react";
import { BASE_URL } from "../lib/api";
import { Button } from "../components/ui/button";
import { Header } from "../components/ui/header";
import { User, Phone, X, Trash2, Pencil } from "lucide-react";

// 1. Mantemos apenas a interface real (removemos a importação do mockDb)
interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  ativo: boolean;
}

interface FormState { 
  nome: string; 
  cpf: string; 
  telefone: string; 
}

const emptyForm: FormState = { nome: "", cpf: "", telefone: "" };

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

export default function Clientes() {
  const [clientes, setClientes]   = useState<Cliente[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [modal, setModal]         = useState(false);
  const [form, setForm]           = useState<FormState>(emptyForm);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
      "Authorization": token ? `Bearer ${token}` : ""
    };
  };

  const loadClientes = () => {
    setLoading(true);
    fetch(`${BASE_URL}/clientes`, {
      method: "GET",
      headers: getHeaders() // 2. Correção: Injetando o Token corretamente
    })
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao buscar clientes.");
        return res.json();
      })
      .then((dados) => setClientes(dados))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };
  
  useEffect(() => { 
    loadClientes(); 
  }, []);

  // 3. Correção: Nome da variável unificado para "filtered" para bater com o HTML
  const filtered = clientes.filter((c) =>
    c.nome.toLowerCase().includes(search.toLowerCase()) ||
    c.cpf.includes(search)
  );

  const fecharModal = () => {
    setModal(false);
    setForm(emptyForm);
    setEditingId(null);
    setError(null);
  };

  const handleEdit = (cliente: Cliente) => {
    setForm({ nome: cliente.nome, cpf: cliente.cpf, telefone: cliente.telefone });
    setEditingId(cliente.id);
    setModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    
    try {
      const payload = {
        nome: form.nome,
        cpf: formatCpf(form.cpf),
        telefone: form.telefone.replace(/\D/g, ""),
      };

      const url = editingId ? `${BASE_URL}/clientes/${editingId}` : `${BASE_URL}/clientes`;
      const method = editingId ? "PUT" : "POST";

      const resposta = await fetch(url, {
        method: method,
        headers: getHeaders(), // Correção: Injetando o Token corretamente
        body: JSON.stringify(payload)
      });

      if (!resposta.ok) {
        const errData = await resposta.json().catch(() => ({}));
        throw new Error(errData.mensagem || "Erro ao salvar no servidor.");
      }
      
      await loadClientes();
      fecharModal();
      
    } catch (err: any) {
      setError(err.message || "Erro ao salvar cliente.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Atenção: Inativar este cliente cancelará todas as consultas abertas dos pets dele. Deseja continuar?")) return;
    
    try {
      const resposta = await fetch(`${BASE_URL}/clientes/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });
      
      if (!resposta.ok){
        const errData = await resposta.json().catch(() => ({}));
        throw new Error(errData.mensagem || "Falha ao inativar cliente.");
      }
      loadClientes();
    } catch (err: any) {
        alert(`Erro: ${err.message}`);    
    }
  };
  
  return (
    <div className="flex flex-col gap-8">
      <Header 
        title="Clientes"
        buttonText="Novo Cliente"
        searchPlaceholder="Buscar por CPF"
        search={search}
        setSearch={setSearch}
        onActionClick={() => setModal(true)}
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-44 rounded-3xl bg-black/10 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-black/40 font-texto text-lg">
          {search ? "Nenhum cliente encontrado." : "Nenhum cliente cadastrado ainda."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <div key={c.id} className={c.ativo ? "bg-white border-4 border-cianoEscuro rounded-3xl p-6 shadow-3xl flex flex-col gap-3" : "bg-white border-4 border-cianoEscuro rounded-3xl p-6 shadow-3xl flex flex-col gap-3 opacity-60 grayscale"}>
              
              {/* Cabeçalho do Card */}
              <div className="flex items-center gap-3 border-b-2 border-ci pb-3">
                <div className="p-2 bg-ciano rounded-lg border-2 border-cianoEscuro">
                  <User size={22} className="text-white" />
                </div>
                <h3 className="font-titulo text-2xl text-cianoEscuro truncate">{c.nome}</h3>
              </div>
              
              {/* Informações */}
              <div className="flex flex-col gap-2 font-texto text-cianoEscuro text-sm">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-cianoEscuro" />
                  <span className="font-semibold">{formatPhone(c.telefone)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cianoEscuro text-xs uppercase">CPF</span>
                  <span className="text-sm font-semibold">{c.cpf}</span>
                </div>
              </div>
              
              {/* Botões do Card */}
              <div className="mt-auto pt-2 flex flex-col sm:flex-row gap-2 w-full">
                <Button 
                  variant="primary"
                  onClick={() => handleEdit(c)}
                  className="flex-1 px-2 text-sm md:text-base hover:bg-cianoEscuro"
                >
                  <Pencil size={16} strokeWidth={2.5} /> 
                  <span>Editar</span>
                </Button>

                <Button 
                  variant="exclude"
                  onClick={() => handleDelete(c.id)}
                  className="flex-1 px-2 text-sm md:text-base hover:bg-red-900" 
                >
                  <Trash2 size={16} strokeWidth={2.5} /> 
                  <span>Inativar</span>
                </Button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative flex flex-col gap-5 p-8 bg-bege border-4 border-cianoEscuro shadow-3xl rounded-3xl w-full max-w-md font-texto">
            
            <button 
              onClick={fecharModal}
              className="absolute top-5 right-5 p-1 border-2 border-cianoEscuro rounded-xl hover:bg-red-500 hover:border-red-500 hover:text-white transition-all"
            >
              <X size={22} />
            </button>
            
            <h2 className="font-titulo text-ciano text-4xl">
               {editingId ? "Editar Cliente" : "Novo Cliente"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {(
                [
                  { label: "Nome completo", name: "nome", type: "text", placeholder: "João da Silva" },
                  { label: "CPF", name: "cpf", type: "text", placeholder: "000.000.000-00" },
                  { label: "Telefone", name: "telefone", type: "tel", placeholder: "(85) 99999-9999" },
                ] as const
              ).map(({ label, name, type, placeholder }) => (
                <div key={name} className="flex flex-col gap-1">
                  <label className="text-ciano font-bold text-sm ml-1">{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    required
                    value={form[name as keyof FormState]}
                    onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
                    className="w-full p-3 rounded-xl border-2 border-ciano bg-white text-black focus:ring-2 focus:ring-cianoEscuro outline-none"
                  />
                </div>
              ))}

              {error && (
                <p className="text-red-500 text-sm font-semibold text-center bg-red-50 border border-red-200 rounded-xl p-2">
                  {error}
                </p>
              )}

              <Button variant="primary" type="submit" disabled={saving} className="mt-1 w-full justify-center">
                {saving 
                  ? (editingId ? "A salvar..." : "A cadastrar...") 
                  : (editingId ? "Salvar Alterações" : "Cadastrar")
                }
              </Button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}