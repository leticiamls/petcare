import * as React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "exclude";
}

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  const baseStyles =
    "flex justify-center items-center px-6 h-[48px] gap-2 font-texto font-bold border-2 border-cianoEscuro rounded-2xl transition-all hover:brightness-110";

  const variants = {
    primary: "bg-ciano text-white",
    secondary: "bg-bege text-cianoEscuro",
    exclude: "bg-vermelho text-white",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    />
  );
}
