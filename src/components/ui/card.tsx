import * as React from "react";
import { cn } from "../../lib/utils";

export function Card({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-titulo leading-none text-4xl text-black", className)}
      {...props}
    >
      {children}
    </h3>
  );
}
