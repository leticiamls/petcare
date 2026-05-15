import React, { useState } from "react";
import { Card, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import { Stethoscope, Award, Phone, Mail, Plus, Search, ShieldCheck } from "lucide-react";

// 1. Dados Mockados dos Veterinários
const MOCK_VETS = [
  { 
    id: 1, 
    nome: "Dr. Ricardo Santos", 
    especialidade: "Clínica Geral", 
    crmv: "CE-1234", 
    email: "ricardo.vet@petcare.com", 
    status: "Disponível",
    cor: "bg-ciano"
  },
  { 
    id: 2, 
    nome: "Dra. Ana Beatriz", 
    especialidade: "Cirurgiã", 
    crmv: "CE-5678", 
    email: "ana.cirurgia@petcare.com", 
    status: "Em Cirurgia",
    cor: "bg-yellow-300"
  },
  { 
    id: 3, 
    nome: "Dr. Marcos Lima", 
    especialidade: "Dermatologista", 
    crmv: "CE-9012", 
    email: "marcos.dermato@petcare.com", 
    status: "Disponível",
    cor: "bg-bege"
  },
];

export default function Veterinarios() {
  return (
    <div className="flex flex-col gap-8">
      {/* Cabeçalho */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-5xl font-titulo text-cianoEscuro [text-shadow:3px_3px_0px_#000] [-webkit-text-stroke:1px_black]">
            Veterinários 🩺
          </h1>
          <p className="font-texto text-black/60 mt-1">Gerencie a equipe de especialistas do PetCare.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" size={18} />
            <input 
              type="text" 
              placeholder="Buscar especialista..." 
              className="w-full pl-10 pr-4 py-2 border-2 border-black rounded-xl bg-white focus:ring-2 focus:ring-ciano outline-none font-texto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>
          <Button className="bg-ciano text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
            <Plus size={20} />
          </Button>
        </div>
      </header>

      {/* Grid de Veterinários */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {MOCK_VETS.map((vet) => (
          <Card key={vet.id} className="bg-white overflow-hidden group">
            {/* Faixa de Especialidade (Estilo Crachá) */}
            <div className={cn("h-4 border-b-2 border-black", vet.cor)}></div>
            
            <div className="p-6 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:-rotate-3 transition-transform">
                  <Stethoscope size={32} className="text-cianoEscuro" />
                </div>
                <span className={cn(
                  "px-3 py-1 border-2 border-black rounded-full text-[10px] font-black uppercase",
                  vet.status === "Disponível" ? "bg-green-400" : "bg-red-400"
                )}>
                  {vet.status}
                </span>
              </div>

              <div>
                <CardTitle className="text-3xl text-black">{vet.nome}</CardTitle>
                <div className="flex items-center gap-1 text-cianoEscuro font-bold text-sm">
                  <Award size={16} />
                  <span>{vet.especialidade}</span>
                </div>
              </div>

              {/* Detalhes Técnicos */}
              <div className="space-y-2 py-3 border-y-2 border-dashed border-black/10">
                <div className="flex items-center justify-between text-sm font-texto font-bold">
                  <span className="text-black/40 uppercase">Registro</span>
                  <span className="flex items-center gap-1 bg-black text-white px-2 py-0.5 rounded-md">
                    <ShieldCheck size={12} /> {vet.crmv}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-black/70">
                  <Mail size={16} />
                  <span className="truncate">{vet.email}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-3 font-black text-xs border-2 border-black rounded-xl bg-bege shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-px hover:translate-y-px transition-all uppercase">
                  Agenda
                </button>
                <button className="p-3 border-2 border-black rounded-xl bg-white hover:bg-black hover:text-white transition-colors">
                  <Phone size={18} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}