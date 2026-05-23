import { useEffect, useState } from "react";
import { Card, CardTitle } from "../components/ui/card";
import { Dog, Users, Calendar, Activity, Cat, Rabbit } from "lucide-react";
import { api } from "../lib/mockDb";
import type { Pet } from "../lib/mockDb";
import { auth } from "../lib/auth";

const PetIcon = ({ especie }: { especie: Pet["especie"] }) => {
  if (especie === "Gato") return <Cat size={28} />;
  if (especie === "Cachorro") return <Dog size={28} />;
  return <Rabbit size={28} />;
};

const calcAge = (dataNascimento: string) => {
  const years = new Date().getFullYear() - new Date(dataNascimento).getFullYear();
  return years <= 1 ? "1 ano" : `${years} anos`;
};

export default function Dashboard() {
  const [stats, setStats] = useState({ totalPets: 0, totalClientes: 0, consultasHoje: 0, consultasAbertas: 0, recentPets: [] as Pet[] });
  const [loading, setLoading] = useState(true);
  const role = auth.getRole();
  const username = auth.getUsername();

  useEffect(() => {
    api.stats().then(setStats).finally(() => setLoading(false));
  }, []);

  const kpis = [
    { label: "Pets Ativos",       value: stats.totalPets,       icon: <Dog />,      color: "bg-ciano" },
    { label: "Clientes Ativos",   value: stats.totalClientes,   icon: <Users />,    color: "bg-bege" },
    { label: "Consultas Hoje",    value: stats.consultasHoje,   icon: <Calendar />, color: "bg-yellow-300" },
    { label: "Consultas Abertas", value: stats.consultasAbertas,icon: <Activity />, color: "bg-green-300" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-ciano font-texto font-semibold text-5xl p-3">Dashboard</h1>
          <p className="font-texto text-black/60 mt-1 font-medium ml-3">
            Bem-vindo de volta, <span className="font-bold text-cianoEscuro">{username}</span>
            <span className="ml-2 text-xs bg-cianoEscuro text-white px-2 py-0.5 rounded-full">{role}</span>
          </p>
        </div>
      </header>

      {/* KPIs */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 rounded-3xl bg-black/10 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {kpis.map((stat, i) => (
            <div key={i} className="border-4 border-black rounded-3xl p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
              <div className={`p-3 rounded-2xl border-2 border-black ${stat.color}`}>
                {stat.icon}
              </div>
              <div>
                <p className="font-texto font-bold text-black/50 text-xs uppercase tracking-wider">{stat.label}</p>
                <p className="font-titulo text-4xl text-black">{String(stat.value).padStart(2, "0")}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pets recentes */}
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-titulo text-black flex items-center gap-2">
          <Activity className="text-cianoEscuro" /> Pets Recentes
        </h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <div key={i} className="h-36 rounded-3xl bg-black/10 animate-pulse" />)}
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
                  <p>Raça: <span className="text-black">{pet.raca}</span></p>
                  <p>Idade: <span className="text-black">{calcAge(pet.dataNascimento)}</span></p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
