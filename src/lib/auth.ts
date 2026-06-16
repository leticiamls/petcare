import type { Role, LoginResponse } from "./mockDb";

const KEY = "petcare_auth";

export interface AuthSession extends LoginResponse {}

export const auth = {
  save: (dados: { token: string; role: string; username: string; veterinarioId?: number | null }) => {
    localStorage.setItem("token", dados.token);
    localStorage.setItem("role", dados.role);
    localStorage.setItem("username", dados.username);
    if (dados.veterinarioId) {
      localStorage.setItem("veterinarioId", String(dados.veterinarioId));
    } else {
      localStorage.removeItem("veterinarioId");
    }
  },
  getToken: () => localStorage.getItem("token"),
  getRole: () => localStorage.getItem("role"),
  getUsername: () => localStorage.getItem("username"),
  getVeterinarioId: () => localStorage.getItem("veterinarioId"),
  isAuthenticated: () => !!localStorage.getItem("token"),
  clear: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("veterinarioId");
  },
};
