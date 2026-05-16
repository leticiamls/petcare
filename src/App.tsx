
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Sidebar from './components/ui/sidebar';
import { ProtectedRoute } from './components/ProtectedRoute';
import Pets from './pages/pets';
import Clientes from './pages/Clientes';
import Veterinarios from './pages/Veterinarios';
import Consultas from './pages/Consultas';

function MainLayout() {
  return(
    <div className='flex w-full h-screen overflow-hidden bg-bege'>
    <Sidebar />
    <main className='flex-1 h-full overflow-y-auto p-8'>
    <Outlet />
    </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
         <Route element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute> 
          }>
           <Route path="/Dashboard" element={
              <Dashboard />}/>
            <Route path="/Pets" element={
              <Pets />}/>
            <Route path="/Clientes" element={
              <Clientes />}/>
            <Route path="/Veterinarios" element={
              <Veterinarios />}/>
            <Route path="/Consultas" element={
              <Consultas />}/>
            </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App