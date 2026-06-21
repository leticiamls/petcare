import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "../../lib/utils";

export interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, containerClassName, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex items-center w-full h-[48px] border-2 border-cianoEscuro bg-white/75 rounded-xl px-3",
          containerClassName,
        )}
      >
        <input
          ref={ref}
          className={cn(
            "w-full outline-none bg-transparent text-gray-700 placeholder-gray-500 font-medium",
            className,
          )}
          {...props}
        />
        <Search className="text-gray-500 shrink-0 ml-2" size={20} />
      </div>
    );
  },
);

SearchBar.displayName = "SearchBar";
