import { useState } from "react";
import { Calendar, User, FileText, CheckCircle, XCircle, Plus, Stethoscope, Activity, ClipboardList } from "lucide-react";

// Mock adaptado ao formato do Documento de Alinhamento
const MOCK_CONSULTAS = [
  {
    id: 1,
    data: "2026-05-18",
    descricao: "Pet apresentou febre alta e desânimo após o passeio.",
    status: "ABERTA",
    petNome: "Rex",
    petEspecie: "Cachorro",
    veterinarioNome: "Dra. Ana Lima",
    veterinarioId: 1,
    sintomas: ["Febre", "Apatia"],
    medicamentos: []
  },
  {
    id: 2,
    data: "2026-05-17",
    descricao: "Retorno para avaliação de dermatite crônica.",
    status: "FINALIZADA",
    petNome: "Lola",
    petEspecie: "Gato",
    veterinarioNome: "Dr. Carlos Souza",
    veterinarioId: 2,
    sintomas: ["Coceira", "Queda de pelo"],
    medicamentos: ["Pomada Antisséptica", "Shampoo Especial"]
  },
  {
    id: 3,
    data: "2026-05-16",
    descricao: "Check-up anual e aplicação de vacina antirrábica.",
    status: "CANCELADA",
    petNome: "Pipoca",
    petEspecie: "Cachorro",
    veterinarioNome: "Dra. Ana Lima",
    veterinarioId: 1,
    sintomas: [],
    medicamentos: []
  }
];

export default function Consultas() {
  // Simulador de Role para desenvolvimento visual fácil
  const [simularRole, setSimularRole] = useState<"FUNCIONARIO" | "VET">("FUNCIONARIO");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [consultas, setConsultas] = useState(MOCK_CONSULTAS);

  // ID fictício do Veterinário logado quando a role for VET
  const VET_LOGADO_ID = 1; 

  // Filtra as consultas caso o usuário simulado seja VET (mostra apenas as dele)
  const consultasFiltradas = simularRole === "VET" 
    ? consultas.filter(c => c.veterinarioId === VET_LOGADO_ID)
    : consultas;

  const handleCancelar = (id: number) => {
    setConsultas(prev => prev.map(c => c.id === id ? { ...c, status: "CANCELADA" } : c));
  };

  const handleFinalizar = (id: number) => {
    setConsultas(prev => prev.map(c => c.id === id ? { ...c, status: "FINALIZADA", medicamentos: ["Antibiótico Vet X"] } : c));
  };

  return (
    <div className="p-8 font-texto text-black bg-bege/10 min-h-screen w-full">
      
      {/* BARRA DE SIMULAÇÃO DE PAPÉIS - EXCLUSIVA PARA OS MOCKS */}
      

      {/* CABEÇALHO DA PÁGINA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-titulo text-ciano tracking-tight [-webkit-text-stroke:1px_black] drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            Controle de Consultas
          </h1>
          <p className="text-gray-600 font-medium mt-1">
            {simularRole === "FUNCIONARIO" ? "Gerenciamento geral de agendamentos e admissões" : "Sua agenda clínica e prontuários para o dia de hoje"}
          </p>
        </div>

        {/* Botão de abrir consulta visível APENAS para FUNCIONARIO */}
        {simularRole === "FUNCIONARIO" && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-400 text-black font-black px-6 py-3 border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all uppercase"
          >
            <Plus size={20} strokeWidth={3} />
            Abrir Nova Consulta
          </button>
        )}
      </div>

      {/* PAINEL DE CONSULTAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {consultasFiltradas.map((consulta) => (
          <div 
            key={consulta.id}
            className={`bg-white border-4 border-black rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between transition-all hover:-translate-y-1 ${
              consulta.status === "FINALIZADA" ? "bg-emerald-50/50" : consulta.status === "CANCELADA" ? "bg-rose-50/50 opacity-70" : ""
            }`}
          >
            <div>
              {/* STATUS BADGE E DATA */}
              <div className="flex justify-between items-center mb-4">
                <span className="flex items-center gap-1.5 font-bold text-sm bg-gray-100 border-2 border-black px-2.5 py-1 rounded-xl">
                  <Calendar size={14} strokeWidth={2.5} />
                  {consulta.data}
                </span>
                <span className={`font-black text-xs border-2 border-black px-3 py-1 rounded-xl tracking-wider uppercase ${
                  consulta.status === "ABERTA" ? "bg-sky-300" :
                  consulta.status === "FINALIZADA" ? "bg-emerald-400" : "bg-rose-400"
                }`}>
                  {consulta.status}
                </span>
              </div>

              {/* DETALHES DO PACIENTE */}
              <div className="border-2 border-black bg-amber-50/40 p-3 rounded-2xl mb-4 flex justify-between items-center">
                <div>
                  <h3 className="font-black text-xl text-cianoEscuro font-titulo tracking-wide">{consulta.petNome}</h3>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{consulta.petEspecie}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-bold">Médico Responsável</p>
                  <p className="font-bold text-sm flex items-center gap-1 justify-end">
                    <User size={14} className="text-black/60" />
                    {consulta.veterinarioNome}
                  </p>
                </div>
              </div>

              {/* DESCRIÇÃO DA QUEIXA */}
              <div className="mb-4">
                <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-1 flex items-center gap-1">
                  <FileText size={12} /> Queixa Principal
                </h4>
                <p className="text-sm font-medium text-gray-800 leading-snug">{consulta.descricao}</p>
              </div>

              {/* LISTA DE SINTOMAS */}
              {consulta.sintomas.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-1 flex items-center gap-1">
                    <Stethoscope size={12} /> Sintomas Observados
                  </h4>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {consulta.sintomas.map((sintoma, idx) => (
                      <span key={idx} className="bg-amber-100/80 border border-black/40 text-xs font-bold px-2 py-0.5 rounded-lg">
                        {sintoma}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* LISTA DE MEDICAMENTOS RECEITADOS */}
              {consulta.status === "FINALIZADA" && (
                <div className="mb-4 bg-emerald-100/40 border-2 border-dashed border-emerald-600/40 p-3 rounded-xl">
                  <h4 className="text-xs font-black uppercase text-emerald-800 tracking-wider mb-1 flex items-center gap-1">
                    <ClipboardList size={12} /> Prescrição Médica
                  </h4>
                  {consulta.medicamentos.length > 0 ? (
                    <ul className="text-xs font-bold text-emerald-950 list-disc list-inside">
                      {consulta.medicamentos.map((med, idx) => <li key={idx}>{med}</li>)}
                    </ul>
                  ) : (
                    <p className="text-xs text-emerald-700 italic font-medium">Nenhum medicamento receitado.</p>
                  )}
                </div>
              )}
            </div>

            {/* AÇÕES DINÂMICAS BASEADAS NAS ROLES */}
            <div className="border-t-2 border-black/10 pt-4 mt-2 flex gap-2">
              
              {/* FLUXO DO FUNCIONÁRIO: Pode cancelar se estiver aberta */}
              {simularRole === "FUNCIONARIO" && consulta.status === "ABERTA" && (
                <button 
                  onClick={() => handleCancelar(consulta.id)}
                  className="w-full flex items-center justify-center gap-2 bg-rose-400 text-black font-bold py-2 px-4 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-none transition-all text-sm"
                >
                  <XCircle size={16} strokeWidth={2.5} />
                  Cancelar Consulta
                </button>
              )}

              {/* FLUXO DO VETERINÁRIO: Pode evoluir e finalizar se estiver aberta */}
              {simularRole === "VET" && consulta.status === "ABERTA" && (
                <>
                  <button 
                    onClick={() => alert("Modal para adicionar Sintomas/Medicamentos")}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-sky-300 text-black font-bold py-2 px-3 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-none transition-all text-xs uppercase"
                  >
                    Evoluir
                  </button>
                  <button 
                    onClick={() => handleFinalizar(consulta.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-400 text-black font-black py-2 px-3 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-none transition-all text-xs uppercase"
                  >
                    <CheckCircle size={14} strokeWidth={3} />
                    Finalizar
                  </button>
                </>
              )}

              {/* Mensagem informativa para cards fechados */}
              {consulta.status !== "ABERTA" && (
                <div className="w-full text-center text-xs text-gray-400 font-bold uppercase tracking-wider bg-gray-50 py-2 border border-dashed border-gray-300 rounded-xl">
                  Registro Histórico Bloqueado
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MOCK MODAL: FORMULÁRIO DE ABRIR CONSULTA (FUNCIONÁRIO) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border-4 border-black rounded-3xl p-6 w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 bg-rose-400 border-2 border-black rounded-xl p-1.5 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-none transition-all"
            >
              <XCircle size={18} />
            </button>

            <h2 className="text-2xl font-black font-titulo mb-4 text-cianoEscuro uppercase tracking-wide">Nova Consulta</h2>
            
            <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); alert("Consulta agendada no mock!"); }} className="flex flex-col gap-4">
              <div>
                <label className="font-bold block mb-1 text-sm">Selecionar Pet (Paciente)</label>
                <select className="w-full border-2 border-black p-2.5 rounded-xl bg-bege/20 font-medium outline-none">
                  <option>Rex (Labrador - João Silva)</option>
                  <option>Lola (Siamês - Maria Souza)</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1 text-sm">Veterinário Plantonista</label>
                <select className="w-full border-2 border-black p-2.5 rounded-xl bg-bege/20 font-medium outline-none">
                  <option>Dra. Ana Lima (Clínica Geral)</option>
                  <option>Dr. Carlos Souza (Cirurgião)</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1 text-sm">Data do Atendimento</label>
                <input type="date" defaultValue="2026-05-18" className="w-full border-2 border-black p-2.5 rounded-xl font-medium outline-none" />
              </div>

              <div>
                <label className="font-bold block mb-1 text-sm">Queixa Inicial/Descrição</label>
                <textarea rows={3} placeholder="Descreva brevemente o motivo da consulta..." className="w-full border-2 border-black p-2.5 rounded-xl font-medium outline-none resize-none"></textarea>
              </div>

              <button type="submit" className="bg-emerald-400 text-black font-black p-3 border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-px hover:translate-y-px hover:shadow-none transition-all uppercase mt-2">
                Confirmar Agendamento
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="mb-8 p-4 bg-amber-100 border-4 border-black rounded-2xl flex items-center justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-2">
          <Activity className="text-amber-600 animate-pulse" size={24} />
          <span className="font-bold font-titulo uppercase tracking-wider text-sm text-amber-900">Ambiente de Teste: Alternar Visão</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setSimularRole("FUNCIONARIO")}
            className={`px-4 py-2 border-2 border-black font-bold rounded-xl transition-all ${simularRole === "FUNCIONARIO" ? "bg-black text-white shadow-none" : "bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"}`}
          >
            Visão: Funcionário (Recepção)
          </button>
          <button 
            onClick={() => setSimularRole("VET")}
            className={`px-4 py-2 border-2 border-black font-bold rounded-xl transition-all ${simularRole === "VET" ? "bg-black text-white shadow-none" : "bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"}`}
          >
            Visão: Veterinário (Dra. Ana)
          </button>
        </div>
      </div>
    </div>
  );
}