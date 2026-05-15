import React from "react";
import { Card, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Dog, Users, Calendar, Activity, Plus } from "lucide-react";

// 1. Dados Mockados para teste
const MOCK_STATS = [
  { label: "Total de Pets", value: "24", icon: <Dog />, color: "bg-ciano" },
  { label: "Clientes Ativos", value: "12", icon: <Users />, color: "bg-bege" },
  { label: "Consultas Hoje", value: "05", icon: <Calendar />, color: "bg-yellow-300" },
];

const MOCK_RECENT_PETS = [
  { id: 1, nome: "Lola", tipo: "Gato", dono: "Letícia", status: "Ativo" },
  { id: 2, nome: "Thor", tipo: "Cachorro", dono: "João", status: "Ativo" },
  { id: 3, nome: "Pipoca", tipo: "Gato", dono: "Letícia", status: "Em Tratamento" },
];

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8">
      {/* Cabeçalho */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-ciano font-texto font-semibold text-5xl p-3">Dashboard</h1>
          <p className="font-texto text-black/60 mt-2 font-medium">Bem-vinda de volta ao PetCare Manager!</p>
        </div>
        <Button className="flex gap-2 items-center bg-ciano text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
          <Plus size={20} /> Novo Registro
        </Button>
      </header>

      {/* Seção de Estatísticas (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_STATS.map((stat, i) => (
          <div key={i} className="border-4 border-black rounded-3xl p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
            <div className={`p-4 rounded-2xl border-2 border-black ${stat.color}`}>
              {React.cloneElement(stat.icon as React.ReactElement<{ size: number }>, { size: 32 })}
            </div>
            <div>
              <p className="font-texto font-bold text-black/50 text-sm uppercase tracking-wider">{stat.label}</p>
              <p className="font-titulo text-4xl text-black">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Grid Principal: Pets Recentes e Atividades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Coluna 1 e 2: Lista de Pets Recentes */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-2xl font-titulo text-black flex items-center gap-2">
            <Activity className="text-cianoEscuro" /> Pets Recentes
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_RECENT_PETS.map((pet) => (
              <Card key={pet.id} className="bg-white p-6 border-2 border-black">
                <div className="flex justify-between items-start mb-4">
                  <CardTitle className="text-3xl">{pet.nome}</CardTitle>
                  <span className="px-3 py-1 bg-bege border-2 border-black rounded-full text-xs font-black uppercase">
                    {pet.tipo}
                  </span>
                </div>
                <div className="font-texto font-semibold text-black/70 space-y-1">
                  <p>Dono: <span className="text-black">{pet.dono}</span></p>
                  <p>Status: <span className="text-cianoEscuro">{pet.status}</span></p>
                </div>
                <button className="mt-4 w-full py-2 border-2 border-black rounded-xl font-bold hover:bg-ciano hover:text-white transition-colors">
                  Ver Detalhes
                </button>
              </Card>
            ))}
          </div>
        </div>

        {/* Coluna 3: Lembretes Rápidos */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-titulo text-black">Lembretes 📝</h2>
          <div className="bg-bege/30 border-4 border-dashed border-black/20 rounded-[2rem] p-6 flex flex-col gap-4">
            <div className="p-4 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="font-bold text-sm text-red-500">HOJE - 14:00</p>
              <p className="font-texto font-black">Vacina da Lola 💉</p>
            </div>
            <div className="p-4 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] opacity-60">
              <p className="font-bold text-sm text-black/40">AMANHÃ</p>
              <p className="font-texto font-black">Banho do Thor 🛁</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}