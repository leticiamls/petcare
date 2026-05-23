import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/mockDb";
import { auth } from "../lib/auth";
import { Button } from "../components/ui/button";
import { CardTitle } from "../components/ui/card";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]   = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const session = await api.auth.login(username, password);
      auth.save(session);
      navigate("/dashboard");
    } catch (err: unknown) {
      const e = err as { mensagem?: string };
      setError(e?.mensagem ?? "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bege flex items-center justify-center p-4">
      <div className="flex flex-col gap-4 bg-white border-4 border-black rounded-3xl p-8 w-full max-w-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <CardTitle className="text-ciano text-center text-5xl">PetCare</CardTitle>
        <p className="text-center text-black/50 font-texto text-sm -mt-2">Sistema de Gestão Veterinária</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <label className="text-cianoEscuro text-sm font-bold font-texto ml-1">Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="seu.usuario"
              className="w-full p-3 rounded-xl border-2 border-cianoEscuro bg-bege text-black focus:ring-2 focus:ring-ciano outline-none font-texto"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-cianoEscuro text-sm font-bold font-texto ml-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 rounded-xl border-2 border-cianoEscuro bg-bege text-black focus:ring-2 focus:ring-ciano outline-none font-texto"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-texto font-semibold text-center bg-red-50 border border-red-200 rounded-xl p-2">
              {error}
            </p>
          )}

          <div className="text-sm text-right font-texto">
            <a href="#" className="text-cianoEscuro hover:underline">Esqueceu a senha?</a>
          </div>

          <Button variant="primary" type="submit" disabled={loading} className="mt-1 w-full justify-center">
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        {/* Dica de usuários para o mock */}
        <details className="text-xs text-black/40 font-texto mt-2">
          <summary className="cursor-pointer hover:text-black/60">Usuários de teste</summary>
          <div className="mt-2 space-y-1 bg-black/5 rounded-xl p-3">
            <p><b>admin</b> / admin123 → ADMIN</p>
            <p><b>funcionario</b> / func123 → FUNCIONARIO</p>
            <p><b>vet.ana</b> / vet123 → VET</p>
            <p><b>vet.marcos</b> / vet456 → VET</p>
          </div>
        </details>
      </div>
    </div>
  );
}
