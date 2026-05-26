import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/ui/sidebar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Pets from "./pages/pets";
import Clientes from "./pages/Clientes";
import Veterinarios from "./pages/Veterinarios";
import Consultas from "./pages/Consultas";
import Equipe from "./pages/Equipe";

function MainLayout() {
  return (
    <div className="flex w-full h-screen overflow-hidden bg-bege">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard"    element={<Dashboard />} />
          <Route path="/pets"         element={<Pets />} />
          <Route path="/clientes"     element={<Clientes />} />
          <Route path="/veterinarios" element={<Veterinarios />} />
          <Route path="/consultas"    element={<Consultas />} />
          <Route path="/equipe"       element={<Equipe />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
