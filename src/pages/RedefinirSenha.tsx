import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BASE_URL } from "../lib/api";
import { Button } from "../components/ui/button";
import { CardTitle } from "../components/ui/card";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function RedefinirSenha() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  console.log("URL completa:", window.location.href);
  console.log("Token lido:", token);
  console.log("Token length:", token.length);

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    console.log("Token extraído da URL:", token);
    console.log("Token codificado:", encodeURIComponent(token));

    if (novaSenha !== confirmar) {
      setError("As senhas não coincidem.");
      return;
    }
    if (novaSenha.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/redefinir-senha`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ token, novaSenha }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.mensagem || "Erro ao redefinir senha.");
      }

      setSuccess(true);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  // Token ausente na URL
  if (!token) {
    return (
      <div className="min-h-screen bg-bege flex items-center justify-center p-4">
        <div className="flex flex-col gap-4 bg-white border-4 border-black rounded-3xl p-8 w-full max-w-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
          <CardTitle className="text-vermelho text-4xl">
            Link inválido
          </CardTitle>
          <p className="font-texto text-black/60 text-sm">
            Este link de recuperação é inválido ou já expirou. Solicite um novo.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate("/esqueci-senha")}
            className="w-full justify-center"
          >
            Solicitar novo link
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bege flex items-center justify-center p-4">
      <div className="flex flex-col gap-4 bg-white border-4 border-black rounded-3xl p-8 w-full max-w-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 text-black/40 hover:text-black transition-colors"
        >
          <ArrowLeft size={24} />
        </button>

        <CardTitle className="text-ciano text-center text-4xl mt-6">
          Nova Senha
        </CardTitle>
        <p className="text-center text-black/50 font-texto text-sm -mt-2 mb-2">
          Escolha uma senha segura para sua conta.
        </p>

        {success ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="p-4 bg-green-100 rounded-full border-2 border-green-600">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h3 className="font-titulo text-2xl text-black">
              Senha redefinida!
            </h3>
            <p className="font-texto text-sm text-black/70">
              Sua senha foi atualizada com sucesso. Faça login com a nova senha.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate("/")}
              className="mt-4 w-full justify-center"
            >
              Ir para o Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-cianoEscuro text-sm font-bold font-texto ml-1">
                Nova senha
              </label>
              <input
                type="password"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 rounded-xl border-2 border-cianoEscuro bg-bege text-black focus:ring-2 focus:ring-ciano outline-none font-texto"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-cianoEscuro text-sm font-bold font-texto ml-1">
                Confirmar senha
              </label>
              <input
                type="password"
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
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

            <Button
              variant="primary"
              type="submit"
              disabled={loading || !token}
              className="mt-2 w-full justify-center"
            >
              {loading ? "Salvando..." : "Redefinir Senha"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
