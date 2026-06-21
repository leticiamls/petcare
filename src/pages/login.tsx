import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BASE_URL } from "../lib/api";
import { auth } from "../lib/auth";
import { Button } from "../components/ui/button";
import { CardTitle } from "../components/ui/card";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const resposta = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!resposta.ok) {
        const errData = await resposta.json().catch(() => ({}));
        throw new Error(errData.mensagem || "Usuário ou senha incorretos.");
      }

      const dados = await resposta.json();

      auth.save({
        token: dados.token,
        role: dados.role,
        username: dados.username,
        veterinarioId: dados.veterinarioId,
      });

      navigate("/Dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao fazer login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bege flex items-center justify-center p-4">
      <div className="flex flex-col gap-4 bg-white border-4 border-black rounded-3xl p-8 w-full max-w-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <CardTitle className="text-ciano text-center text-5xl">
          PetCare
        </CardTitle>
        <p className="text-center text-black/50 font-texto text-sm -mt-2">
          Sistema de Gestão Veterinária
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1">
            <label className="text-cianoEscuro text-sm font-bold font-texto ml-1">
              Usuário
            </label>
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
            <label className="text-cianoEscuro text-sm font-bold font-texto ml-1">
              Senha
            </label>
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
            <Link
              to="/esqueci-senha"
              className="text-cianoEscuro hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </div>

          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="mt-1 w-full justify-center"
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
