import * as React from "react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Edit, Trash2 } from "lucide-react";

export function Card({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return(
        <div className={cn("max-w-2xs rounded-4xl bg-ciano border-2 border-cianoEscuro/87 shadow-3xl font-texto self-center"
        )}>
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
        "text-3xl font-titulo leading-none",
        "p-1 text-bege text-5xl",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardCompleta(){
      return (
    <Card>
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

    <div className= "row-start-3 col-start-1 justify-self-left self-center">
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