
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";

import Sidebar from './components/ui/sidebar';
import { ProtectedRoute } from './components/ProtectedRoute';
import Pets from './pages/pets';
import Clientes from './pages/clientes';
import Veterinarios from './pages/Veterinarios';
import Consultas from './pages/Consultas';

function App() {
  return (
    <BrowserRouter>
    <div className='flex w-full h-screen overflow-hidden bg-bege'>
    <Sidebar/>
    <main className='flex-1 h-full overflow-y-auto p-8'>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/Dashboard" element={
          <ProtectedRoute>
          <Dashboard />
          </ProtectedRoute>}/>
          <Route path="/Pets" element={
          <ProtectedRoute>
          <Pets />
          </ProtectedRoute>}/>
          <Route path="/Clientes" element={
          <ProtectedRoute>
          <Clientes />
          </ProtectedRoute>}/>
          <Route path="/Veterinários" element={
          <ProtectedRoute>
          <Veterinarios />
          </ProtectedRoute>}/>
          <Route path="/Consultas" element={
          <ProtectedRoute>
          <Consultas />
          </ProtectedRoute>}/>
      </Routes>
      </main>
    </div>
    </BrowserRouter>
  );
};

export default App