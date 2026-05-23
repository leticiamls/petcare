import type { Role, LoginResponse } from "./mockDb";

const KEY = "petcare_auth";

export interface AuthSession extends LoginResponse {}

export const auth = {
  save: (session: LoginResponse) => {
    localStorage.setItem(KEY, JSON.stringify(session));
  },
  get: (): AuthSession | null => {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  },
  getToken: (): string | null => auth.get()?.token ?? null,
  getRole: (): Role | null => auth.get()?.role ?? null,
  getVetId: (): number | null => auth.get()?.veterinarioId ?? null,
  getUsername: (): string | null => auth.get()?.username ?? null,
  clear: () => localStorage.removeItem(KEY),
  isAuthenticated: (): boolean => !!auth.getToken(),
  // Cabeçalho Authorization (para o futuro backend real)
  headers: (): Record<string, string> => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${auth.getToken() ?? ""}`,
  }),
};
