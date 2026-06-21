import { Plus } from "lucide-react";
import { SearchBar } from "./search";
import { Button } from "./button";

interface HeaderProps {
  title: string;
  buttonText?: string;
  searchPlaceholder?: string;
  search: string;
  setSearch: (value: string) => void;
  onActionClick?: () => void;
}

export function Header({
  title, 
  buttonText, 
  searchPlaceholder = "Buscar...",
  search, 
  setSearch, 
  onActionClick
}: HeaderProps) {
    return (
      <header className= "flex flex-col md:flex-row justify-between items-center py-6 gap-4 w-full">
      <h1 className="text-ciano font-texto font-bold text-5xl tracking-tight">
        {title}
      </h1>
      
      <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
        
        <SearchBar 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={searchPlaceholder}
          containerClassName="md:w-[320px]" 
        />

        {buttonText && (
          <Button onClick={onActionClick}>
            <Plus size={20} strokeWidth={2.5} /> {buttonText}
          </Button>
        )}
        
      </div>
    </header>
    );
}