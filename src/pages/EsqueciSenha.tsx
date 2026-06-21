import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { Button } from "../components/ui/button";
import { CardTitle } from "../components/ui/card";
import { ArrowLeft, MailCheck } from "lucide-react";

export default function EsqueciSenha() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.auth.recuperarSenha(email);

      setSuccess(true);
    } catch (err: unknown) {
      const eObj = err as { message: string };
      setError(eObj.message || "Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bege flex items-center justify-center p-4">
      <div className="flex flex-col gap-4 bg-white border-4 border-black rounded-3xl p-8 w-full max-w-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 text-black/40 hover:text-black transition-colors"
          title="Voltar para o Login"
        >
          <ArrowLeft size={24} />
        </button>

        <CardTitle className="text-ciano text-center text-4xl mt-6">
          Recuperar Senha
        </CardTitle>
        <p className="text-center text-black/50 font-texto text-sm -mt-2 mb-2">
          Informe seu e-mail para receber as instruções.
        </p>

        {success ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center animate-fadeIn">
            <div className="p-4 bg-green-100 rounded-full border-2 border-green-600">
              <MailCheck size={40} className="text-green-600" />
            </div>
            <h3 className="font-titulo text-2xl text-black">E-mail Enviado!</h3>
            <p className="font-texto text-sm text-black/70">
              Se o e-mail <b>{email}</b> estiver cadastrado no sistema, você
              receberá um link de redefinição válido por 15 minutos.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate("/")}
              className="mt-4 w-full justify-center"
            >
              Voltar ao Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-cianoEscuro text-sm font-bold font-texto ml-1">
                E-mail Cadastrado
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="joao@petcare.com"
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
              disabled={loading}
              className="mt-4 w-full justify-center"
            >
              {loading ? "Enviando..." : "Enviar Link de Recuperação"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
