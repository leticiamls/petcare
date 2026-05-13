import * as React from "react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Edit, Trash2, X } from "lucide-react";

export function Card({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return(
        <div className={cn("max-w-2xs rounded-4xl bg-ciano border-2 border-cianoEscuro/87 shadow-3xl font-texto self-center",
          className
        )}
          {...props}
        >
            {children}
        </div>
    )
}

export function CardContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "px-7",
        "grid grid-cols-3 grid-rows-3 gap-x-1 gap-y-[1vw]",
        className
      )} 
      {...props} 
    >
      {children}
    </div>
  )
}

export function CardTitle({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "font-titulo leading-none",
        "p-1 text-bege text-5xl",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardPet({ className, ...props }: React.HTMLAttributes<HTMLDivElement>){
      return (
    <Card className={className} {...props}>
  <CardContent>
    <div className="col-start-2 flex self-center justify-self-center">
      <CardTitle>Nome</CardTitle>
    </div>

    <div className="text-left  row-start-2 col-span-3 text-xl font-semibold font-texto text-bege">
      <p>Tipo:</p>
      <p>Idade:</p>
      <p>Cliente:</p>
      <p>Status:</p>
    </div>

    <div className= "row-start-3 col-start-1 justify-self-start self-center">
      <Button variant="secondary">
        <Edit size={18} /> Editar
      </Button>
    </div>

    {/* 4. Botão Inativar: Linha 3, Coluna 3 */}
    <div className="row-start-3 col-start-3 justify-self-end self-center">
      <Button variant="exclude">
        <Trash2 size={18} /> Inativar
      </Button>
    </div>

  </CardContent>
</Card>
  )
}

export function CardNovoPet({ onClose }: { onClose: () => void }) {

  return (
    <div className="font-texto relative flex flex-col gap-6 p-8 bg-bege border-4 border-cianoEscuro shadow-3xl rounded-[2.5rem] max-w-md">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-1 border-2 border-cianoEscuro rounded-xl bg-bege hover:bg-vermelho hover:shadow-none transition-all group"
      >
        <X size={24} className="text-cianoEscuro group-hover:text-white" strokeWidth={3} />
      </button>
      <form className="flex flex-col gap-5">
        <CardTitle className='text-ciano'>Novo Pet</CardTitle>
        <div className="flex flex-col gap-2">
          <label className="text-ciano font-bold ml-1 self-start">Cliente</label>
          <select 
            name="cliente"
            className="w-full p-3 rounded-xl border-2 border-ciano bg-bege text-black focus:ring-2 focus:ring-cianoEscuro outline-none appearance-none"
          >
            <option value="">Selecione um cliente</option>
            {/* Aqui você fará o .map() dos clientes do back-end futuramente */}
          </select>
        </div>
        <div className='flex flex-col gap-2'>
          <label className="text-ciano font-bold ml-1 self-start">Nome</label>
            <input name='nome'type='text' placeholder="Nome do pet" className="w-full p-3 rounded-xl border-2 border-ciano bg-bege text-black focus:ring-2 focus:ring-cianoEscurp outline-none appearance-none"></input>
        </div>
        <div className='flex flex-col gap-2'>
          <label className="text-ciano font-bold ml-1 self-start">Tipo</label>
        <select name="tipo"
      className="w-full p-3 rounded-xl border-2 border-ciano bg-bege text-black focus:ring-2 focus:ring-cianoEscuro outline-none">
            <option value="">Selecione o tipo</option>
            {/* Aqui você fará o .map() dos tipos do back-end futuramente */}
      </select>
      </div>
      <div className='flex flex-col gap-2'>
        <label className="text-ciano font-bold ml-1 self-start">Idade</label>
        <input name='idade' type='number' min='0' placeholder="Idade do pet" className="w-full p-3 rounded-xl border-2 border-ciano bg-bege text-black focus:ring-2 focus:ring-cianoEscuro outline-none"></input>
        </div>
        <Button variant="primary" type="submit">Cadastrar</Button>
      </form>
    </div>
  )
}

export function CardNovoCliente({ onClose }: { onClose: () => void }) {

  return (
    <div className="font-texto relative flex flex-col gap-6 p-8 bg-bege border-4 border-cianoEscuro shadow-3xl rounded-[2.5rem] max-w-md">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-1 border-2 border-cianoEscuro rounded-xl bg-bege hover:bg-vermelho hover:shadow-none transition-all group"
      >
        <X size={24} className="text-cianoEscuro group-hover:text-white" strokeWidth={3} />
      </button>
      <form className="flex flex-col gap-5">
        <CardTitle className='text-ciano'>Novo Cliente</CardTitle>
        <div className='flex flex-col gap-2'>
          <label className="text-ciano font-bold ml-1 self-start">Nome</label>
            <input name='nome'type='text' placeholder="Nome do cliente" className="w-full p-3 rounded-xl border-2 border-ciano bg-bege text-black focus:ring-2 focus:ring-cianoEscurp outline-none appearance-none"></input>
        </div>
        <div className='flex flex-col gap-2'>
          <label className="text-ciano font-bold ml-1 self-start">CPF</label>
        <input name='cpf' type='number' placeholder="000.000.000-00" className="w-full p-3 rounded-xl border-2 border-ciano bg-bege text-black focus:ring-2 focus:ring-cianoEscuro outline-none">
        </input>
      </div>
      <div className='flex flex-col gap-2'>
        <label className="text-ciano font-bold ml-1 self-start">Telefone</label>
        <input name='idade' type='number' placeholder="(85) 99999-9999" className="w-full p-3 rounded-xl border-2 border-ciano bg-bege text-black focus:ring-2 focus:ring-cianoEscuro outline-none"></input>
        </div>
        <Button variant="primary" type="submit">Cadastrar</Button>
      </form>
    </div>
  )
}

export function CardNovoVet({ onClose }: { onClose: () => void }) {

  return (
    <div className="font-texto relative flex flex-col gap-6 p-8 bg-bege border-4 border-cianoEscuro shadow-3xl rounded-[2.5rem] max-w-md">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-1 border-2 border-cianoEscuro rounded-xl bg-bege hover:bg-vermelho hover:shadow-none transition-all group"
      >
        <X size={24} className="text-cianoEscuro group-hover:text-white" strokeWidth={3} />
      </button>
      <form className="flex flex-col gap-5">
        <CardTitle className='text-ciano'>Novo Veterinário</CardTitle>
        <div className='flex flex-col gap-2'>
          <label className="text-ciano font-bold ml-1 self-start">Nome</label>
            <input name='nome'type='text' placeholder="Nome do veterinário" className="w-full p-3 rounded-xl border-2 border-ciano bg-bege text-black focus:ring-2 focus:ring-cianoEscurp outline-none appearance-none"></input>
        </div>
        <div className='flex flex-col gap-2'>
          <label className="text-ciano font-bold ml-1 self-start">CMRV</label>
        <input name='cpf' type='number' placeholder="Número do CMRV" className="w-full p-3 rounded-xl border-2 border-ciano bg-bege text-black focus:ring-2 focus:ring-cianoEscuro outline-none">
        </input>
      </div>
      <div className='flex flex-col gap-2'>
        <label className="text-ciano font-bold ml-1 self-start">Telefone</label>
        <input name='idade' type='number' placeholder="(85) 99999-9999" className="w-full p-3 rounded-xl border-2 border-ciano bg-bege text-black focus:ring-2 focus:ring-cianoEscuro outline-none"></input>
        </div>
        <Button variant="primary" type="submit">Cadastrar</Button>
      </form>
    </div>
  )
}