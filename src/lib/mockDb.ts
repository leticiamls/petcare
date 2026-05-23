// ─── Types (alinhados ao backend Spring Boot) ─────────────────────────────────

export type Role = "ADMIN" | "FUNCIONARIO" | "VET";
export type ConsultaStatus = "ABERTA" | "FINALIZADA" | "CANCELADA";

export interface Usuario {
  id: number;
  username: string;
  email: string;
  role: Role;
  ativo: boolean;
  veterinarioId: number | null;
  password: string; // só no mock — nunca expor no frontend real
}

export interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  ativo: boolean;
}

export interface Pet {
  id: number;
  nome: string;
  especie: "Cachorro" | "Gato" | "Outro";
  raca: string;
  dataNascimento: string; // ISO date
  ativo: boolean;
  clienteId: number;
}

export interface Veterinario {
  id: number;
  nome: string;
  crmv: string;
  telefone: string;
  ativo: boolean;
}

export interface Consulta {
  id: number;
  data: string;
  descricao: string;
  status: ConsultaStatus;
  petId: number;
  veterinarioId: number;
  sintomas: number[];
  medicamentos: number[];
}

export interface Sintoma {
  id: number;
  nome: string;
}

export interface Medicamento {
  id: number;
  nome: string;
  dose: string;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

let usuarios: Usuario[] = [
  { id: 1, username: "admin",      email: "admin@petcare.com",      role: "ADMIN",       ativo: true, veterinarioId: null, password: "admin123" },
  { id: 2, username: "funcionario",email: "func@petcare.com",       role: "FUNCIONARIO", ativo: true, veterinarioId: null, password: "func123" },
  { id: 3, username: "vet.ana",    email: "ana@petcare.com",        role: "VET",         ativo: true, veterinarioId: 1,    password: "vet123" },
  { id: 4, username: "vet.marcos", email: "marcos@petcare.com",     role: "VET",         ativo: true, veterinarioId: 2,    password: "vet456" },
];

let clientes: Cliente[] = [
  { id: 1, nome: "Letícia Marreiro", cpf: "000.111.222-33", telefone: "85999999999", ativo: true },
  { id: 2, nome: "João Silva",       cpf: "111.222.333-44", telefone: "85988888888", ativo: true },
  { id: 3, nome: "Maria Oliveira",   cpf: "222.333.444-55", telefone: "85977777777", ativo: true },
  { id: 4, nome: "Carlos Souza",     cpf: "333.444.555-66", telefone: "85966666666", ativo: false },
];

let pets: Pet[] = [
  { id: 1, nome: "Lola",   especie: "Gato",     raca: "SRD",         dataNascimento: "2023-03-10", ativo: true,  clienteId: 1 },
  { id: 2, nome: "Thor",   especie: "Cachorro", raca: "Golden",      dataNascimento: "2019-07-22", ativo: true,  clienteId: 2 },
  { id: 3, nome: "Pipoca", especie: "Gato",     raca: "Persa",       dataNascimento: "2024-01-05", ativo: true,  clienteId: 3 },
  { id: 4, nome: "Mel",    especie: "Cachorro", raca: "Poodle",      dataNascimento: "2021-11-18", ativo: false, clienteId: 4 },
  { id: 5, nome: "Bibi",   especie: "Outro",    raca: "Coelho",      dataNascimento: "2024-09-01", ativo: true,  clienteId: 1 },
  { id: 6, nome: "Rex",    especie: "Cachorro", raca: "Pastor Alemão", dataNascimento: "2020-04-14", ativo: true, clienteId: 2 },
];

let veterinarios: Veterinario[] = [
  { id: 1, nome: "Dra. Ana Beatriz", crmv: "CRMV-CE 12345", telefone: "85911111111", ativo: true },
  { id: 2, nome: "Dr. Marcos Lima",  crmv: "CRMV-CE 56789", telefone: "85922222222", ativo: true },
  { id: 3, nome: "Dr. Ricardo Neto", crmv: "CRMV-CE 99012", telefone: "85933333333", ativo: false },
];

const today = new Date().toISOString().split("T")[0];
let consultas: Consulta[] = [
  { id: 1, data: today,        descricao: "Pet apresentou febre alta",     status: "ABERTA",     petId: 1, veterinarioId: 1, sintomas: [1, 2], medicamentos: [] },
  { id: 2, data: today,        descricao: "Check-up anual",                status: "ABERTA",     petId: 2, veterinarioId: 2, sintomas: [],     medicamentos: [] },
  { id: 3, data: "2025-06-20", descricao: "Dermatite recorrente",          status: "ABERTA",     petId: 3, veterinarioId: 1, sintomas: [3],    medicamentos: [2] },
  { id: 4, data: "2025-05-10", descricao: "Cirurgia de hérnia — sucesso",  status: "FINALIZADA", petId: 4, veterinarioId: 2, sintomas: [4],    medicamentos: [1, 3] },
  { id: 5, data: "2025-05-01", descricao: "Consulta cancelada pelo tutor", status: "CANCELADA",  petId: 6, veterinarioId: 1, sintomas: [],     medicamentos: [] },
];

const sintomasData: Sintoma[] = [
  { id: 1, nome: "Febre" },
  { id: 2, nome: "Apatia" },
  { id: 3, nome: "Coceira" },
  { id: 4, nome: "Vômito" },
  { id: 5, nome: "Diarreia" },
  { id: 6, nome: "Perda de apetite" },
  { id: 7, nome: "Tosse" },
];

const medicamentosData: Medicamento[] = [
  { id: 1, nome: "Amoxicilina",  dose: "500mg" },
  { id: 2, nome: "Prednisolona", dose: "20mg"  },
  { id: 3, nome: "Metronidazol", dose: "250mg" },
  { id: 4, nome: "Dipirona",     dose: "500mg" },
  { id: 5, nome: "Omeprazol",    dose: "10mg"  },
];

// ─── Counters ─────────────────────────────────────────────────────────────────
let _id = { usuarios: 10, clientes: 10, pets: 10, veterinarios: 10, consultas: 10 };

const delay = (ms = 280) => new Promise((res) => setTimeout(res, ms));

// ─── Auth Response ─────────────────────────────────────────────────────────────

export interface LoginResponse {
  token: string;
  username: string;
  role: Role;
  veterinarioId: number | null;
}

// ─── API Mock (espelha endpoints /api/*) ──────────────────────────────────────

export const api = {

  // POST /api/auth/login
  auth: {
    login: async (username: string, password: string): Promise<LoginResponse> => {
      await delay();
      const user = usuarios.find((u) => u.username === username && u.password === password && u.ativo);
      if (!user) throw { status: 401, mensagem: "Credenciais inválidas" };
      return {
        token: `mock-jwt-${user.id}-${Date.now()}`,
        username: user.username,
        role: user.role,
        veterinarioId: user.veterinarioId,
      };
    },
  },

  // /api/usuarios (ADMIN only)
  usuarios: {
    getAll: async (): Promise<Omit<Usuario, "password">[]> => {
      await delay();
      return usuarios.map(({ password: _p, ...u }) => u);
    },
    create: async (data: Omit<Usuario, "id">): Promise<Omit<Usuario, "password">> => {
      await delay();
      if (usuarios.find((u) => u.username === data.username)) throw { status: 409, mensagem: "Username já cadastrado" };
      const novo = { ...data, id: _id.usuarios++ };
      usuarios = [...usuarios, novo];
      const { password: _p, ...sem } = novo;
      return sem;
    },
    update: async (id: number, data: Partial<Omit<Usuario, "id">>): Promise<Omit<Usuario, "password">> => {
      await delay();
      usuarios = usuarios.map((u) => (u.id === id ? { ...u, ...data } : u));
      const { password: _p, ...sem } = usuarios.find((u) => u.id === id)!;
      return sem;
    },
    delete: async (id: number): Promise<void> => {
      await delay();
      usuarios = usuarios.map((u) => (u.id === id ? { ...u, ativo: false } : u));
    },
  },

  // /api/clientes
  clientes: {
    getAll: async (): Promise<Cliente[]> => {
      await delay();
      return clientes.filter((c) => c.ativo);
    },
    getByCpf: async (cpf: string): Promise<Cliente> => {
      await delay();
      const c = clientes.find((c) => c.cpf === cpf && c.ativo);
      if (!c) throw { status: 404, mensagem: "Cliente não encontrado" };
      return c;
    },
    create: async (data: Omit<Cliente, "id" | "ativo">): Promise<Cliente> => {
      await delay();
      if (clientes.find((c) => c.cpf === data.cpf)) throw { status: 409, mensagem: "CPF já cadastrado" };
      const novo = { ...data, id: _id.clientes++, ativo: true };
      clientes = [...clientes, novo];
      return novo;
    },
    update: async (id: number, data: Partial<Omit<Cliente, "id">>): Promise<Cliente> => {
      await delay();
      clientes = clientes.map((c) => (c.id === id ? { ...c, ...data } : c));
      return clientes.find((c) => c.id === id)!;
    },
    delete: async (id: number): Promise<void> => {
      await delay();
      clientes = clientes.map((c) => (c.id === id ? { ...c, ativo: false } : c));
    },
    ativar: async (id: number): Promise<void> => {
      await delay();
      clientes = clientes.map((c) => (c.id === id ? { ...c, ativo: true } : c));
    },
  },

  // /api/pets
  pets: {
    getAll: async (): Promise<Pet[]> => {
      await delay();
      return pets.filter((p) => p.ativo);
    },
    create: async (data: Omit<Pet, "id" | "ativo">): Promise<Pet> => {
      await delay();
      const novo = { ...data, id: _id.pets++, ativo: true };
      pets = [...pets, novo];
      return novo;
    },
    update: async (id: number, data: Partial<Omit<Pet, "id">>): Promise<Pet> => {
      await delay();
      pets = pets.map((p) => (p.id === id ? { ...p, ...data } : p));
      return pets.find((p) => p.id === id)!;
    },
    delete: async (id: number): Promise<void> => {
      await delay();
      pets = pets.map((p) => (p.id === id ? { ...p, ativo: false } : p));
    },
    ativar: async (id: number): Promise<void> => {
      await delay();
      pets = pets.map((p) => (p.id === id ? { ...p, ativo: true } : p));
    },
  },

  // /api/veterinarios
  veterinarios: {
    getAll: async (): Promise<Veterinario[]> => {
      await delay();
      return veterinarios.filter((v) => v.ativo);
    },
    create: async (data: Omit<Veterinario, "id" | "ativo">): Promise<Veterinario> => {
      await delay();
      if (veterinarios.find((v) => v.crmv === data.crmv)) throw { status: 409, mensagem: "CRMV já cadastrado" };
      const novo = { ...data, id: _id.veterinarios++, ativo: true };
      veterinarios = [...veterinarios, novo];
      return novo;
    },
    update: async (id: number, data: Partial<Omit<Veterinario, "id">>): Promise<Veterinario> => {
      await delay();
      veterinarios = veterinarios.map((v) => (v.id === id ? { ...v, ...data } : v));
      return veterinarios.find((v) => v.id === id)!;
    },
    delete: async (id: number): Promise<void> => {
      await delay();
      veterinarios = veterinarios.map((v) => (v.id === id ? { ...v, ativo: false } : v));
    },
    ativar: async (id: number): Promise<void> => {
      await delay();
      veterinarios = veterinarios.map((v) => (v.id === id ? { ...v, ativo: true } : v));
    },
  },

  // /api/consultas
  consultas: {
    getAll: async (): Promise<Consulta[]> => {
      await delay();
      return [...consultas];
    },
    getByPet: async (petId: number): Promise<Consulta[]> => {
      await delay();
      return consultas.filter((c) => c.petId === petId);
    },
    getByVet: async (vetId: number): Promise<Consulta[]> => {
      await delay();
      return consultas.filter((c) => c.veterinarioId === vetId);
    },
    // POST /api/consultas (FUNCIONARIO)
    create: async (data: Omit<Consulta, "id" | "status" | "sintomas" | "medicamentos">): Promise<Consulta> => {
      await delay();
      const nova = { ...data, id: _id.consultas++, status: "ABERTA" as ConsultaStatus, sintomas: [], medicamentos: [] };
      consultas = [...consultas, nova];
      return nova;
    },
    // PUT /api/consultas/{id} (VET — sintomas e medicamentos)
    update: async (id: number, data: { sintomas: number[]; medicamentos: number[]; descricao?: string }): Promise<Consulta> => {
      await delay();
      const c = consultas.find((c) => c.id === id);
      if (!c) throw { status: 404, mensagem: "Consulta não encontrada" };
      if (c.status !== "ABERTA") throw { status: 422, mensagem: "Consulta já finalizada não pode ser alterada" };
      consultas = consultas.map((c) => (c.id === id ? { ...c, ...data } : c));
      return consultas.find((c) => c.id === id)!;
    },
    // PATCH /api/consultas/finalizar/{id} (VET)
    finalizar: async (id: number): Promise<Consulta> => {
      await delay();
      const c = consultas.find((c) => c.id === id);
      if (!c) throw { status: 404, mensagem: "Consulta não encontrada" };
      if (c.status !== "ABERTA") throw { status: 422, mensagem: "Consulta já finalizada não pode ser alterada" };
      consultas = consultas.map((c) => (c.id === id ? { ...c, status: "FINALIZADA" } : c));
      return consultas.find((c) => c.id === id)!;
    },
    // PATCH /api/consultas/cancelar/{id} (FUNCIONARIO)
    cancelar: async (id: number): Promise<Consulta> => {
      await delay();
      const c = consultas.find((c) => c.id === id);
      if (!c) throw { status: 404, mensagem: "Consulta não encontrada" };
      if (c.status !== "ABERTA") throw { status: 422, mensagem: "Apenas consultas abertas podem ser canceladas" };
      consultas = consultas.map((c) => (c.id === id ? { ...c, status: "CANCELADA" } : c));
      return consultas.find((c) => c.id === id)!;
    },
  },

  // /api/sintomas e /api/medicamentos
  sintomas: {
    getAll: async (): Promise<Sintoma[]> => { await delay(100); return [...sintomasData]; },
  },
  medicamentos: {
    getAll: async (): Promise<Medicamento[]> => { await delay(100); return [...medicamentosData]; },
  },

  // Dashboard stats
  stats: async () => {
    await delay(150);
    const todayStr = new Date().toISOString().split("T")[0];
    return {
      totalPets: pets.filter((p) => p.ativo).length,
      totalClientes: clientes.filter((c) => c.ativo).length,
      consultasHoje: consultas.filter((c) => c.data === todayStr && c.status === "ABERTA").length,
      consultasAbertas: consultas.filter((c) => c.status === "ABERTA").length,
      recentPets: pets.filter((p) => p.ativo).slice(-3).reverse(),
    };
  },
};