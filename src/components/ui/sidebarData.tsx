import { HomeIcon, PawPrint, Users, CalendarDays, ShieldCheck } from "lucide-react";
import type { Role } from "../../lib/mockDb";

const all = [
  { title: "Dashboard",    icon: <HomeIcon />,     link: "/dashboard",    roles: ["ADMIN", "FUNCIONARIO", "VET"] },
  { title: "Clientes",     icon: <Users />,        link: "/clientes",     roles: ["ADMIN", "FUNCIONARIO"] },
  { title: "Pets",         icon: <PawPrint />,     link: "/pets",         roles: ["ADMIN", "FUNCIONARIO"] },
  { title: "Consultas",    icon: <CalendarDays />, link: "/consultas",    roles: ["ADMIN", "FUNCIONARIO", "VET"] },
  { title: "Equipe",       icon: <ShieldCheck />,  link: "/equipe",       roles: ["ADMIN"] },
] as const;

export const getSidebarData = (role: Role | null) =>
  all.filter((item) => !role || (item.roles as readonly string[]).includes(role));
