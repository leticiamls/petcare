import { NavLink } from "react-router-dom"; 
import { cn } from "../../lib/utils";
import { SidebarData } from "./sidebarData";

function Sidebar() {
  return (
    <div className="flex flex-col h-screen w-76.25 bg-ciano border-r-4 border-cianoEscuro">
      {/* Espaço para a Logo ou Título */}
      <div className="p-8 font-titulo text-7xl text-bege self-center">
        PetCare
      </div>

      <ul className="flex flex-col gap-2 px-4">
        {SidebarData.map((val, key) => {
          return (
            <li key={key}>
              <NavLink
                to={val.link}
                className={({ isActive }) => cn(
                  "flex items-center gap-4 p-4 rounded-xl font-texto font-semibold transition-all",
                   
                  isActive 
                    ? "bg-bege/75 text-cianoEscuro shadow-cianoEscuro border-2 border-cianoEscuro"  
                    : "bg-bege text-cianoEscuro shadow-3xl shadow-cianoEscuro border-2 border-cianoEscuro hover:translate-x-1 hover:translate-y-1 hover:bg-bege/75 hover:shadow-none transition-all" 
                )}
              >
                <div className="text-2xl">{val.icon}</div>
                <div className="text-lg">{val.title}</div>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar;