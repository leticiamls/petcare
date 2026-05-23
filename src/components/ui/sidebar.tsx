import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import { getSidebarData } from "./sidebarData";
import { auth } from "../../lib/auth";
import { LogOut } from "lucide-react";

function Sidebar() {
  const navigate = useNavigate();
  const role = auth.getRole();
  const username = auth.getUsername();
  const items = getSidebarData(role);

  const handleLogout = () => {
    auth.clear();
    navigate("/");
  };

  return (
    <div className="flex flex-col h-screen w-72 bg-ciano border-r-4 border-cianoEscuro shrink-0">
      <div className="p-8 font-titulo text-6xl text-bege self-center tracking-tight">
        PetCare
      </div>

      <ul className="flex flex-col gap-2 px-4 flex-1">
        {items.map((val) => (
          <li key={val.link}>
            <NavLink
              to={val.link}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-4 p-4 rounded-xl font-texto font-semibold transition-all",
                  isActive
                    ? "bg-bege/75 text-cianoEscuro shadow-cianoEscuro border-2 border-cianoEscuro"
                    : "bg-bege text-cianoEscuro shadow-3xl shadow-cianoEscuro border-2 border-cianoEscuro hover:translate-x-1 hover:translate-y-1 hover:bg-bege/75 hover:shadow-none"
                )
              }
            >
              <div className="text-2xl">{val.icon}</div>
              <div className="text-lg">{val.title}</div>
            </NavLink>
          </li>
        ))}
      </ul>

      {/* User info + logout */}
      <div className="p-4 border-t-2 border-cianoEscuro/40 flex items-center justify-between">
        <div className="text-bege font-texto text-sm">
          <p className="font-bold">{username}</p>
          <p className="opacity-70 text-xs">{role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl border-2 border-bege/40 text-bege hover:bg-bege hover:text-cianoEscuro transition-colors"
          title="Sair"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
