import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { Header } from "../components/ui/header";
import { Dog, Cat, X, Trash2, Rabbit, ShieldAlert } from "lucide-react";
import { BASE_URL } from "../lib/api";
import { auth } from "../lib/auth"; // 🎯 Importando o utilitário real de autenticação

export interface Pet {
  id: number;
  nome: string;
  especie: string;
  raca: string;
  dataNascimento: string;
  clienteId: number;
  ativo?: boolean; // Adicionado para o controle visual do Soft Delete
}

export interface Cliente {
  id: number;
  nome: string;
  ativo?: boolean;
}

const PetIcon = ({ especie }: { especie: string }) => {
  const esp = especie.toLowerCase();
  if (esp === "gato") return <Cat size={32}/>;
  if (esp === "cachorro") return <Dog size={32} />;
  return <Rabbit size={32} />;
};

const calcAge = (dataNascimento: string) => {
  const birthYear = new Date(dataNascimento).getFullYear();
  if (isNaN(birthYear)) return "Idade desc."; 
  const years = new Date().getFullYear() - birthYear;
  return years <= 0 ? "< 1 ano" : years === 1 ? "1 ano" : `${years} anos`;
};

interface FormState {
  nome: string; 
  especie: string; 
  raca: string;
  dataNascimento: string; 
  clienteId: string;
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

  // 1. Pegamos o perfil do usuário logado
  const userRole = auth.getRole();

  // 2. Montamos os Headers com o JWT
  const getHeaders = () => ({
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
    "Authorization": `Bearer ${auth.getToken()}`
  });

  const load = async () => {
    setLoading(true);
    try {
      // Dispara as requisições em paralelo para a API real
      const [resPets, resClientes] = await Promise.all([
        fetch(`${BASE_URL}/pets`, { headers: getHeaders() }).catch(() => null),
        fetch(`${BASE_URL}/clientes`, { headers: getHeaders() }).catch(() => null)
      ]);

      const petsData = resPets?.ok ? await resPets.json() : [];
      const clientesData = resClientes?.ok ? await resClientes.json() : [];

      setPets(petsData);
      // Filtra apenas os clientes ativos para aparecerem no select de Tutor
      setClientes(clientesData.filter((c: Cliente) => c.ativo !== false));
    } catch (err) {
      console.error("Erro ao carregar os dados:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    // Só carrega os dados se o usuário tiver permissão
    if (userRole === "ADMIN" || userRole === "FUNCIONARIO") {
      load(); 
    } else {
      setLoading(false);
    }
  }, [userRole]);

  // 🔒 BARREIRA DE SEGURANÇA: Bloqueia o VET
  if (userRole === "VET") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center p-8">
        <div className="p-4 bg-red-100 rounded-full">
          <ShieldAlert size={48} className="text-red-500" />
        </div>
        <h2 className="font-titulo text-cianoEscuro text-3xl">Acesso Restrito</h2>
        <p className="font-texto text-gray-600 text-lg max-w-md">
          Seu perfil de Veterinário não tem permissão para gerenciar cadastros de pets. Acesse suas Consultas para visualizar os pets agendados.
        </p>
      </div>
    );
  }

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
      const resposta = await fetch(`${BASE_URL}/pets`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          nome: form.nome,
          especie: form.especie,
          raca: form.raca,
          dataNascimento: form.dataNascimento,
          clienteId: Number(form.clienteId),
        })
      });

      if (!resposta.ok) {
        const errData = await resposta.json().catch(() => ({}));
        throw new Error(errData.mensagem || "Erro ao cadastrar pet.");
      }

      await load();
      setModal(false);
      setForm(emptyForm);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Atenção: Inativar este pet cancelará automaticamente suas consultas abertas. Deseja continuar?")) return;
    
    try {
      const resposta = await fetch(`${BASE_URL}/pets/${id}`, {
        method: "DELETE", // Se o seu back usar PATCH para inativar, altere aqui
        headers: getHeaders()
      });

      if (!resposta.ok) throw new Error("Erro ao inativar pet");
      load();
    } catch (err) {
      alert("Falha ao inativar o pet. Verifique sua conexão.");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <Header 
        title="Pets"
        buttonText="Novo Pet"
        searchPlaceholder="Buscar por nome, raça ou espécie"
        search={search}
        setSearch={setSearch}
        onActionClick={() => setModal(true)} 
      />

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
              className={`bg-white border-4 border-cianoEscuro rounded-3xl p-6 shadow-3xl flex flex-col gap-3 transition-all ${pet.ativo === false ? "opacity-60 grayscale" : ""}`}
            >
            <div className="flex w-full items-center gap-3 border-b-2 border-cianoEscuro pb-3">
               <div className="p-2 bg-ciano border-2 border-cianoEscuro rounded-lg text-white">
                  <PetIcon especie={pet.especie} />
               </div>

               <h3 className="font-titulo text-cianoEscuro truncate text-4xl">
                {pet.nome}
               </h3>

                <span className="ml-auto text-xs font-black bg-ciano text-white border-2 border-cianoEscuro px-3 py-1 rounded-full uppercase">
                  {pet.especie}
                </span>
            </div>

              <div className="font-texto font-semibold text-cianoEscuro text-sm space-y-1">
                <p>Raça: <span className="text-cianoEscuro font-bold">{pet.raca}</span></p>
                <p>Idade: <span className="text-cianoEscuro font-bold">{calcAge(pet.dataNascimento)}</span></p>
                <p>Tutor: <span className="text-cianoEscuro font-bold">{clienteNome(pet.clienteId)}</span></p>
              </div>

              <div className="mt-auto pt-3 flex justify-between items-center">
                <span className="text-xs font-bold text-cianoEscuro uppercase self-end">
                  Nasc.: {new Date(pet.dataNascimento + "T00:00:00").toLocaleDateString("pt-BR")}
                </span>
                <Button variant="exclude"
                  disabled={pet.ativo === false}
                  onClick={() => handleDelete(pet.id)} 
                >
                  <Trash2 size={14} /> {pet.ativo === false ? "Inativo" : "Inativar"}
                </Button>
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
                  <option value="">Selecione um cliente ativo</option>
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
                <select value={form.especie} onChange={(e) => setForm((f) => ({ ...f, especie: e.target.value }))}
                  className="w-full p-3 rounded-xl border-2 border-ciano bg-white text-black focus:ring-2 focus:ring-cianoEscuro outline-none">
                  <option value="Cachorro">Cachorro</option>
                  <option value="Gato">Gato</option>
                  <option value="Outro">Outro</option>
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
                  // Impede que o usuário selecione uma data no futuro
                  max={new Date().toISOString().split("T")[0]} 
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