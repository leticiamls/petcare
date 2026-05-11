import * as React from "react";
import { cn } from "../../lib/utils"; 

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'exclude';
}

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  const baseStyles = "px-5 py-2 rounded-xl font-texto font-semibold";
  
  const variants = {
    primary: "bg-ciano text-bege hover:bg-cianoEscuro",
    secondary: "bg-bege text-ciano hover:bg-begeEscuro flex items-center gap-2 p-3",
    exclude: "bg-bege text-vermelho hover:bg-vermelhoClaro flex items-center gap-2 p-3",
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], className)} 
      {...props} 
    />
  );
}