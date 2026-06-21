// src/lib/api.ts
export const BASE_URL = "https://arrival-spinster-overload.ngrok-free.dev/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const api = {
  auth: {
    recuperarSenha: async (email: string) => {
      const res = await fetch(`${BASE_URL}/auth/recuperar-senha`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.mensagem || "Falha ao solicitar recuperação.");
      }
    },
  },

  clientes: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/clientes`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Falha ao buscar clientes.");
      return res.json();
    },
    create: async (payload: any) => {
      const res = await fetch(`${BASE_URL}/clientes`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.mensagem || "Erro ao criar cliente.");
      }
      return res.json();
    },
    update: async (id: number, payload: any) => {
      const res = await fetch(`${BASE_URL}/clientes/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.mensagem || "Erro ao atualizar cliente.");
      }
      return res.json();
    },
    delete: async (id: number) => {
      const res = await fetch(`${BASE_URL}/clientes/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.mensagem || "Erro ao inativar cliente.");
      }
    },
    reativar: async (id: number) => {
      const res = await fetch(`${BASE_URL}/clientes/ativar/${id}`, {
        method: "PATCH",
        headers: getHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.mensagem || "Erro ao reativar cliente.");
      }
    },
  },

  pets: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/pets`, { headers: getHeaders() });
      if (!res.ok) throw new Error("Falha ao buscar pets.");
      return res.json();
    },
    create: async (payload: any) => {
      const res = await fetch(`${BASE_URL}/pets`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.mensagem || "Erro ao cadastrar pet.");
      }
      return res.json();
    },
    update: async (id: number, payload: any) => {
      const res = await fetch(`${BASE_URL}/pets/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.mensagem || "Erro ao atualizar pet.");
      }
      return res.json();
    },
    delete: async (id: number) => {
      const res = await fetch(`${BASE_URL}/pets/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.mensagem || "Erro ao inativar pet.");
      }
    },
    reativar: async (id: number) => {
      const res = await fetch(`${BASE_URL}/pets/ativar/${id}`, {
        method: "PATCH",
        headers: getHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.mensagem || "Erro ao reativar pet.");
      }
    },
  },

  veterinarios: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/veterinarios`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Falha ao buscar veterinários.");
      return res.json();
    },
    create: async (payload: any) => {
      const res = await fetch(`${BASE_URL}/veterinarios`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.mensagem || "Erro ao cadastrar veterinário.");
      }
      return res.json();
    },
  },

  sintomas: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/sintomas`, {
        headers: getHeaders(),
      });
      if (!res.ok) return [];
      return res.json();
    },
  },
  medicamentos: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/medicamentos`, {
        headers: getHeaders(),
      });
      if (!res.ok) return [];
      return res.json();
    },
  },

  consultas: {
    getAll: async (vetId?: number | null) => {
      const url = vetId
        ? `${BASE_URL}/consultas?veterinarioId=${vetId}`
        : `${BASE_URL}/consultas`;
      const res = await fetch(url, { headers: getHeaders() });
      if (!res.ok) throw new Error("Falha ao buscar consultas.");
      return res.json();
    },
    create: async (payload: any) => {
      const res = await fetch(`${BASE_URL}/consultas`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.mensagem || "Erro ao abrir consulta.");
      }
    },
    update: async (id: number, payload: any) => {
      const res = await fetch(`${BASE_URL}/consultas/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.mensagem || "Erro ao atualizar consulta.");
      }
    },
    finalizar: async (id: number) => {
      const res = await fetch(`${BASE_URL}/consultas/finalizar/${id}`, {
        method: "PATCH",
        headers: getHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.mensagem || "Erro ao finalizar consulta.");
      }
    },
    cancelar: async (id: number) => {
      const res = await fetch(`${BASE_URL}/consultas/cancelar/${id}`, {
        method: "PATCH",
        headers: getHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.mensagem || "Erro ao cancelar consulta.");
      }
    },
  },

  usuarios: {
    getAll: async () => {
      const res = await fetch(`${BASE_URL}/usuarios`, {
        headers: getHeaders(),
      });
      if (!res.ok) throw new Error("Falha ao buscar usuários.");
      return res.json();
    },
    create: async (payload: any) => {
      const res = await fetch(`${BASE_URL}/usuarios`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.mensagem || "Erro ao criar usuário.");
      }
      return res.json();
    },
    delete: async (id: number) => {
      const res = await fetch(`${BASE_URL}/usuarios/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.mensagem || "Erro ao inativar utilizador.");
      }
    },
    reativar: async (id: number) => {
      const res = await fetch(`${BASE_URL}/usuarios/ativar/${id}`, {
        method: "PATCH",
        headers: getHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.mensagem || "Erro ao reativar utilizador.");
      }
    },
  },
};
