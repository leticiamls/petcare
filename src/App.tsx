import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/ui/sidebar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Pets from "./pages/pets";
import Clientes from "./pages/Clientes";
import Consultas from "./pages/Consultas";
import Equipe from "./pages/Equipe";
import EsqueciSenha from "./pages/EsqueciSenha";
// import RedefinirSenha from "./pages/RedefinirSenha"; // Deixei comentado para quando formos criar!

function MainLayout() {
  return (
    <div className="flex w-full h-screen overflow-hidden bg-bege">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔓 ROTAS PÚBLICAS (Acesso livre) */}
        <Route path="/" element={<Login />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
        {/* <Route path="/redefinir-senha" element={<RedefinirSenha />} /> */}

        {/* 🔒 ROTAS PROTEGIDAS (Exigem Login e renderizam a Sidebar) */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard"    element={<Dashboard />} />
          <Route path="/pets"         element={<Pets />} />
          <Route path="/clientes"     element={<Clientes />} />
          <Route path="/consultas"    element={<Consultas />} />
          <Route path="/equipe"       element={<Equipe />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;