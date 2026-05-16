import React from "react";
import { PawPrint, HomeIcon, User, Edit } from "lucide-react";

export const SidebarData = [
    {
        title: "Dashboard",
        icon: <HomeIcon />,
        link: "/Dashboard"
    },
    {
        title: "Pets",
        icon: <PawPrint />,
        link: "/pets"
    },
    {
        title: "Clientes",
        icon: <User />,
        link: "/Clientes"
    },
    {
        title: "Veterinários",
        icon: <Edit />,
        link: "/Veterinarios"
    },
    {
        title: "Consultas",
        icon: <Edit />,
        link: "/Consultas"
    }
]