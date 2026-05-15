import React from "react";
import { Card, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { User, Phone, Mail, Dog } from "lucide-react";
import { cn } from "../lib/utils";

// 1. Dados Mockados (Simulando o que viria do Spring Boot)
const MOCK_CLIENTES = [
  { id: 1, nome: "Letícia Marreiro", telefone: "(85) 99999-9999", email: "leticia@email.com", pets: ["Lola", "Pipoca"] },
  { id: 2, nome: "João Silva", telefone: "(85) 98888-8888", email: "joao@email.com", pets: ["Thor"] },
  { id: 3, nome: "Maria Oliveira", telefone: "(85) 97777-7777", email: "maria@email.com", pets: ["Luna", "Mel", "Rex"] },
  { id: 4, nome: "Carlos Souza", telefone: "(85) 96666-6666", email: "carlos@email.com", pets: [] },
];

export default function Clientes() {
  return (
    <div className="flex flex-col gap-8">
      {/* Cabeçalho da Página */}
      <header className="flex justify-between items-center">
        <h1 className="text-5xl font-titulo text-cianoEscuro [text-shadow:3px_3px_0px_#000] [-webkit-text-stroke:1.5px_black]">
          Clientes 👥
        </h1>
        <Button className="bg-bege text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-200">
          + Novo Cliente
        </Button>
      </header>

      {/* Grid de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_CLIENTES.map((cliente) => (
          <Card key={cliente.id} className="bg-white hover:rotate-1 transition-transform">
            <div className="p-6 flex flex-col gap-4">
              
              {/* Nome e Ícone Principal */}
              <div className="flex items-center gap-3 border-b-2 border-black pb-3">
                <div className="p-2 bg-ciano rounded-lg border-2 border-black">
                  <User size={24} className="text-white" />
                </div>
                <CardTitle className="text-2xl text-black truncate">
                  {cliente.nome}
                </CardTitle>
              </div>

              {/* Informações de Contato */}
              <div className="flex flex-col gap-2 font-texto text-black/80">
                <div className="flex items-center gap-2">
                  <Phone size={18} className="text-cianoEscuro" />
                  <span className="font-semibold">{cliente.telefone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={18} className="text-cianoEscuro" />
                  <span className="text-sm truncate">{cliente.email}</span>
                </div>
              </div>

              {/* Lista de Pets do Cliente */}
              <div className="mt-2 p-3 bg-bege/30 rounded-xl border-2 border-dashed border-black/30">
                <div className="flex items-center gap-2 mb-2 text-black font-bold text-sm">
                  <Dog size={16} />
                  <span>Pets Cadastrados:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cliente.pets.length > 0 ? (
                    cliente.pets.map((pet, index) => (
                      <span key={index} className="px-2 py-1 bg-ciano/20 text-cianoEscuro text-xs font-bold rounded-full border border-cianoEscuro">
                        {pet}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs italic text-gray-500">Nenhum pet vinculado</span>
                  )}
                </div>
              </div>

              {/* Ações do Card */}
              <div className="flex gap-2 mt-2">
                <button className="flex-1 py-2 text-sm font-bold border-2 border-black rounded-lg bg-white hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-px">
                  Ver Perfil
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}