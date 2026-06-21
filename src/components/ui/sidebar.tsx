import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import { getSidebarData } from "./sidebarData";
import { auth } from "../../lib/auth";
import { Icone } from "./icone";
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const role = auth.getRole();
  const username = auth.getUsername();
  const items = getSidebarData(role);

  const handleLogout = () => {
    auth.clear();
    navigate("/");
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-ciano border-r-4 border-cianoEscuro shrink-0 transition-all duration-300 relative",
        isCollapsed ? "w-24" : "w-72",
      )}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-15 bg-bege border-2 border-cianoEscuro rounded-full p-1 text-cianoEscuro hover:scale-110 transition-transform z-10"
      >
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      <div
        className={cn(
          "pt-8 text-bege font-titulo self-center tracking-tight transition-all flex justify-center items-center",
          isCollapsed ? "text-2xl px-2" : "text-6xl",
        )}
      >
        {isCollapsed ? (
          <Icone className="h-20 w-10 text-bege animate-fadeIn hover:scale-110 transition-transform" />
        ) : (
          "PetCare"
        )}
      </div>

      <ul className="flex flex-col gap-2 px-4 flex-1 mt-4">
        {items.map((val) => (
          <li key={val.link}>
            <NavLink
              to={val.link}
              title={isCollapsed ? val.title : ""}
              className={({ isActive }) =>
                cn(
                  "flex items-center p-4 rounded-xl font-texto font-semibold transition-all overflow-hidden whitespace-nowrap",
                  isCollapsed ? "justify-center gap-0" : "gap-4",
                  isActive
                    ? "bg-bege/75 text-cianoEscuro shadow-cianoEscuro border-2 border-cianoEscuro"
                    : "bg-bege text-cianoEscuro shadow-[3px_3px_0px_0px_rgba(22,61,52,1)] border-2 border-cianoEscuro hover:translate-x-1 hover:translate-y-1 hover:bg-bege/75 hover:shadow-none",
                )
              }
            >
              <div className="text-2xl shrink-0">{val.icon}</div>

              {!isCollapsed && (
                <div className="text-lg animate-fadeIn">{val.title}</div>
              )}
            </NavLink>
          </li>
        ))}
      </ul>

      <div
        className={cn(
          "p-4 border-t-2 border-cianoEscuro/40 flex items-center transition-all",
          isCollapsed ? "justify-center" : "justify-between",
        )}
      >
        {!isCollapsed && (
          <div className="text-bege font-texto text-sm overflow-hidden whitespace-nowrap">
            <p className="font-bold truncate">{username}</p>
            <p className="opacity-70 text-xs">{role}</p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="p-2 rounded-xl border-2 border-bege/40 text-bege hover:bg-bege hover:text-cianoEscuro transition-colors shrink-0"
          title="Sair"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
