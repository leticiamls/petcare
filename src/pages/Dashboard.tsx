import { useEffect, useState } from "react";
import { Card, CardTitle } from "../components/ui/card";
import { Dog, Users, Calendar, Activity, Cat, Rabbit } from "lucide-react";
import { api } from "../lib/api";
import { auth } from "../lib/auth";

export interface Pet {
  id: number;
  nome: string;
  especie: string;
  raca: string;
  dataNascimento: string;
  ativo: boolean;
}

interface Cliente {
  id: number;
  ativo: boolean;
}

interface ConsultaResumo {
  id: number;
  data: string;
  status: "ABERTA" | "FINALIZADA" | "CANCELADA";
}

const PetIcon = ({ especie }: { especie: string }) => {
  if (especie.toLowerCase() === "gato") return <Cat size={28} />;
  if (especie.toLowerCase() === "cachorro") return <Dog size={28} />;
  return <Rabbit size={28} />;
};

const calcAge = (dataNascimento: string) => {
  const birthYear = new Date(dataNascimento).getFullYear();
  if (isNaN(birthYear)) return "Idade desc.";
  const years = new Date().getFullYear() - birthYear;
  return years <= 1 ? "1 ano" : `${years} anos`;
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPets: 0,
    totalClientes: 0,
    consultasHoje: 0,
    consultasAbertas: 0,
    recentPets: [] as Pet[],
  });
  const [loading, setLoading] = useState(true);

  const role = auth.getRole();
  const username = auth.getUsername();
  const carregarDadosReais = async () => {
    try {
      const [pets, clientes, consultas] = await Promise.all([
        api.pets.getAll().catch(() => []),
        api.clientes.getAll().catch(() => []),
        api.consultas
          .getAll(role === "VET" ? Number(auth.getVeterinarioId()) : null)
          .catch(() => []),
      ]);

      const petsAtivos = pets.filter((p: Pet) => p.ativo);
      const clientesAtivos = clientes.filter((c: Cliente) => c.ativo);
      const consultasAbertas = consultas.filter(
        (c: ConsultaResumo) => c.status === "ABERTA",
      );

      const hoje = new Date().toISOString().split("T")[0];
      const consultasHoje = consultas.filter(
        (c: ConsultaResumo) => c.data && c.data.startsWith(hoje),
      );

      const recentPets = [...petsAtivos]
        .sort((a, b) => b.id - a.id)
        .slice(0, 3);

      setStats({
        totalPets: petsAtivos.length,
        totalClientes: clientesAtivos.length,
        consultasHoje: consultasHoje.length,
        consultasAbertas: consultasAbertas.length,
        recentPets: recentPets,
      });
    } catch (error) {
      console.error("Erro ao carregar métricas do dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDadosReais();
  }, []);

  const kpis = [
    {
      label: "Pets Ativos",
      value: stats.totalPets,
      icon: <Dog />,
      color: "bg-ciano",
    },
    {
      label: "Clientes Ativos",
      value: stats.totalClientes,
      icon: <Users />,
      color: "bg-bege",
    },
    {
      label: "Consultas Hoje",
      value: stats.consultasHoje,
      icon: <Calendar />,
      color: "bg-yellow-300",
    },
    {
      label: "Consultas Abertas",
      value: stats.consultasAbertas,
      icon: <Activity />,
      color: "bg-green-300",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-ciano font-texto font-semibold text-5xl p-3">
            Dashboard
          </h1>
          <p className="font-texto text-black/60 mt-1 font-medium ml-3">
            Bem-vindo de volta,{" "}
            <span className="font-bold text-cianoEscuro">{username}</span>
            <span className="ml-2 text-xs bg-cianoEscuro text-white px-2 py-0.5 rounded-full">
              {role}
            </span>
          </p>
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-3xl bg-black/10 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-6">
          {kpis.map((stat, i) => (
            <div
              key={i}
              className="border-4 border-cianoEscuro rounded-3xl p-4 md:p-6 bg-white shadow-3xl flex items-center gap-3 md:gap-4 overflow-hidden"
            >
              <div
                className={`shrink-0 p-2 md:p-3 rounded-2xl border-2 border-cianoEscuro ${stat.color}`}
              >
                {stat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-texto font-bold text-black/50 text-[10px] md:text-xs uppercase tracking-wider truncate">
                  {stat.label}
                </p>
                <p className="font-titulo text-2xl md:text-4xl text-black truncate">
                  {String(stat.value).padStart(2, "0")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-titulo text-black flex items-center gap-2">
          <Activity className="text-cianoEscuro" /> Pets Recentes
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-36 rounded-3xl bg-black/10 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.recentPets.map((pet) => (
              <Card key={pet.id} className="bg-white p-6 border-2 border-black">
                <div className="flex justify-between items-start mb-4">
                  <CardTitle className="text-3xl">{pet.nome}</CardTitle>
                  <span className="p-2 bg-bege border-2 border-black rounded-xl">
                    <PetIcon especie={pet.especie} />
                  </span>
                </div>
                <div className="font-texto font-semibold text-black/70 space-y-1 text-sm">
                  <p>
                    Raça: <span className="text-black">{pet.raca}</span>
                  </p>
                  <p>
                    Idade:{" "}
                    <span className="text-black">
                      {calcAge(pet.dataNascimento)}
                    </span>
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
