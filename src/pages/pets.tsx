import React, { useState } from "react";
import { Card, CardTitle, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Edit, Trash2, Plus, Search, Filter, Dog, Cat } from "lucide-react";
import { CardNovoPet } from "../components/ui/card"; // Seu componente de cadastro

// 1. Dados Mockados
const MOCK_PETS = [
  { id: 1, nome: "Lola", tipo: "Gato", raca: "SRD", idade: "2 anos", dono: "Letícia", status: "Ativo" },
  { id: 2, nome: "Thor", tipo: "Cachorro", raca: "Golden", idade: "5 anos", dono: "João", status: "Ativo" },
  { id: 3, nome: "Pipoca", tipo: "Gato", raca: "Persa", idade: "1 ano", dono: "Maria", status: "Ativo" },
  { id: 4, nome: "Mel", tipo: "Cachorro", raca: "Poodle", idade: "3 anos", dono: "Carlos", status: "Inativo" },
  { id: 5, nome: "Bibi", tipo: "Outro", raca: "Coelho", idade: "6 meses", dono: "Ana", status: "Ativo" },
  { id: 6, nome: "Rex", tipo: "Cachorro", raca: "Pastor", idade: "4 anos", dono: "Pedro", status: "Ativo" },
];

export default function Pets() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      {/* Cabeçalho e Busca */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-5xl font-titulo text-cianoEscuro [text-shadow:3px_3px_0px_#000] [-webkit-text-stroke:1px_black]">
          Meus Pets 🐾
        </h1>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" size={18} />
            <input 
              type="text" 
              placeholder="Buscar pet..." 
              className="w-full pl-10 pr-4 py-2 border-2 border-black rounded-xl bg-white focus:ring-2 focus:ring-ciano outline-none font-texto"
            />
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-ciano text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            <Plus size={20} />
          </Button>
        </div>
      </header>

      {/* Grid de Pets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_PETS.map((pet) => (
          <Card key={pet.id} className={pet.status === "Inativo" ? "opacity-60 grayscale" : ""}>
            <CardContent className="pt-6">
              {/* Topo do Card: Nome e Ícone */}
              <div className="col-start-2 flex flex-col items-center justify-center">
                <div className="p-3 bg-bege border-2 border-black rounded-2xl mb-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  {pet.tipo === "Gato" ? <Cat size={32} /> : <Dog size={32} />}
                </div>
                <CardTitle className="text-4xl">{pet.nome}</CardTitle>
              </div>

              {/* Informações: Linha 2 */}
              <div className="row-start-2 col-span-3 text-left py-4 text-lg font-semibold font-texto text-bege drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                <p>Raça: <span className="font-normal">{pet.raca}</span></p>
                <p>Idade: <span className="font-normal">{pet.idade}</span></p>
                <p>Cliente: <span className="font-normal">{pet.dono}</span></p>
                <p>Status: <span className={pet.status === "Ativo" ? "text-green-400" : "text-red-400"}>{pet.status}</span></p>
              </div>

              {/* Ações: Linha 3 */}
              <div className="row-start-3 col-start-1 justify-self-start self-center">
                <Button variant="secondary" className="gap-2 text-xs">
                  <Edit size={14} /> Editar
                </Button>
              </div>

              <div className="row-start-3 col-start-3 justify-self-end self-center">
                <Button variant="exclude" className="gap-2 text-xs">
                  <Trash2 size={14} /> Inativar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Novo Pet */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <CardNovoPet onClose={() => setIsModalOpen(false)} />
        </div>
      )}
    </div>
  );
}