export type Role = "ADMIN" | "FUNCIONARIO" | "VET";

export interface LoginResponse {
  token: string;
  role: Role;
  username: string;
  veterinarioId?: number | null;
}

export const auth = {
  save: (dados: LoginResponse) => {
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
  getRole: () => localStorage.getItem("role") as Role | null,
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
