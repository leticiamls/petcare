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
import RedefinirSenha from "./pages/RedefinirSenha";


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
        <Route path="/" element={<Login />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pets" element={<Pets />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/consultas" element={<Consultas />} />
          <Route path="/equipe" element={<Equipe />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
