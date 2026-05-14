
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import Sidebar from './components/ui/sidebar';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <div className='w-screen h-screen bg-bege'>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/Dashboard" element={
          <ProtectedRoute>
          {/* <Dashboard />  */}
          <Sidebar/>
          </ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
    </div>
  );
};

export default App