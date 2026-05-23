import React from "react";
import { useEffect, useState } from "react";
import { api } from "../lib/mockDb";
import type { Role } from "../lib/mockDb";
import { Button } from "../components/ui/button";
import { ShieldCheck, UserCheck, Stethoscope, Plus, X, Trash2, Search } from "lucide-react";

interface UserRow { id: number; username: string; email: string; role: Role; ativo: boolean; veterinarioId: number | null }

const ROLE_BADGE: Record<Role, string> = {
  ADMIN:       "bg-red-200 border-red-600 text-red-900",
  FUNCIONARIO: "bg-blue-200 border-blue-600 text-blue-900",
  VET:         "bg-green-200 border-green-700 text-green-900",
};
const ROLE_ICON: Record<Role, React.ReactElement> = {
  ADMIN:       <ShieldCheck size={16} />,
  FUNCIONARIO: <UserCheck size={16} />,
  VET:         <Stethoscope size={16} />,
};

interface FormState { 
  username: string; 
  email: string;
  password: string;
  role: Role;  
  veterinarioNome: string;
  veterinarioCrmv: string; 
  veterinarioTelefone: string;
}

const emptyForm: FormState = { 
  username: "",
  email: "",
  password: "",
  role: "FUNCIONARIO",
  veterinarioNome: "",
  veterinarioCrmv: "",
  veterinarioTelefone: "",
 };

export default function Equipe() {
  const [usuarios, setUsuarios] = useState<UserRow[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [modal, setModal]       = useState(false);
  const [form, setForm]         = useState<FormState>(emptyForm);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const load = () =>
    api.usuarios.getAll().then((u) => setUsuarios(u as UserRow[])).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const filtered = usuarios.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true); 
    try {
      let veterinarioId: number | null = null;

      if(form.role === "VET") {
        if(!form.veterinarioNome || !form.veterinarioCrmv || !form.veterinarioTelefone) {
          setError("Preencha os dados do veterinário.");
          setSaving(false);
          return;
        }
        const vet = await api.veterinarios.create({
          nome: form.veterinarioNome,
          crmv: form.veterinarioCrmv,
          telefone: form.veterinarioTelefone.replace(/\D/g, ""),
        });
        veterinarioId = vet.id;
      }

      await api.usuarios.create({
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
        ativo: true,
        veterinarioId,
      });

      await load();
      setModal(false);
      setForm(emptyForm);
    } catch (err: unknown) {
      setError((err as { mensagem?: string })?.mensagem ?? "Erro ao criar usuário");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Inativar este usuário?")) return;
    await api.usuarios.delete(id);
    load();
  };

  const field = (label: string, name: keyof FormState, type: string, placeholder: string, required = true) => (
    <div className="flex, flex-col gap-1">
      <label className="text-ciano font-bold text-sm ml-1">{label}</label>
      <input 
        type={type}
        required={required}
        placeholder={placeholder}
        value={form[name] as string}
        onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
        className="w-full p-3 rounded-xl  border-2 border-ciano bg-white text-black focus:ring-2 focus:ring-cianoEscuro outline-none"
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-5xl font-titulo text-cianoEscuro [text-shadow:3px_3px_0px_#000] [-webkit-text-stroke:1px_black]">
            Equipe 🔐
          </h1>
          <p className="font-texto text-black/60 mt-1">Gerencie os usuários do sistema.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar usuário..."
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
        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-2xl bg-black/10 animate-pulse" />)}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((u) => (
            <div
              key={u.id}
              className={`bg-white border-4 border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4 ${!u.ativo ? "opacity-50 grayscale" : ""}`}
            >
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 text-xs font-black ${ROLE_BADGE[u.role]}`}>
                {ROLE_ICON[u.role]} {u.role}
              </div>
              <div className="flex-1">
                <p className="font-titulo text-xl text-black">{u.username}</p>
                <p className="font-texto text-sm text-black/60">{u.email}</p>
                {u.veterinarioId && (
                  <p className="font-texto text-xs text-green-700 mt-0.5">
                    Veterinário ID: {u.veterinarioId}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                {!u.ativo && <span className="text-xs font-black text-black/40 uppercase">Inativo</span>}
                <button
                  onClick={() => handleDelete(u.id)}
                  disabled={!u.ativo}
                  className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-700 disabled:opacity-30 transition-colors"
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
          <div className="relative flex flex-col gap-5 p-8 bg-bege border-4 border-cianoEscuro shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-[2rem] w-full max-w-md font-texto max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => { setModal(false); setForm(emptyForm); setError(null); }}
              className="absolute top-5 right-5 p-1 border-2 border-cianoEscuro rounded-xl hover:bg-red-500 hover:border-red-500 hover:text-white transition-all"
            >
              <X size={22} />
            </button>
            <h2 className="font-titulo text-ciano text-4xl">Novo Usuário</h2>
 
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {field("Username",  "username", "text",     "joao.silva")}
              {field("E-mail",    "email",    "email",    "joao@petcare.com")}
              {field("Senha",     "password", "password", "••••••••")}
 
              <div className="flex flex-col gap-1">
                <label className="text-ciano font-bold text-sm ml-1">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Role }))}
                  className="w-full p-3 rounded-xl border-2 border-ciano bg-white text-black focus:ring-2 focus:ring-cianoEscuro outline-none"
                >
                  <option value="FUNCIONARIO">FUNCIONARIO</option>
                  <option value="VET">VET</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
 
              {/* Campos extras quando role = VET — cria o veterinário junto */}
              {form.role === "VET" && (
                <div className="flex flex-col gap-4 border-2 border-dashed border-ciano/50 rounded-2xl p-4 bg-white/40">
                  <p className="text-xs font-bold text-ciano uppercase tracking-wider">
                    Dados do Veterinário
                  </p>
                  {field("Nome completo",  "veterinarioNome",     "text", "Dra. Nome Sobrenome")}
                  {field("CRMV",           "veterinarioCrmv",     "text", "CRMV-CE 00000")}
                  {field("Telefone",       "veterinarioTelefone", "tel",  "(85) 99999-9999")}
                </div>
              )}
 
              {error && (
                <p className="text-red-500 text-sm font-semibold text-center bg-red-50 border border-red-200 rounded-xl p-2">
                  {error}
                </p>
              )}
 
              <Button variant="primary" type="submit" disabled={saving} className="mt-1 w-full justify-center">
                {saving ? "Criando..." : "Criar Usuário"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
 