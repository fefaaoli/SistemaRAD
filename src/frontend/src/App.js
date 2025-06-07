import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ConfigurarDisciplinas from './pages/ConfigurarDisciplinas'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/configurar-disciplinas" element={<ConfigurarDisciplinas />} />
        
        {/* Adicione outras rotas conforme necessário */}
        {/* Exemplo:
        <Route path="/gerenciar-disciplinas" element={<GerenciarDisciplinas />} />
        <Route path="/configurar-horarios" element={<ConfigurarHorarios />} />
        */}
      </Routes>
    </Router>
  );
}

export default App;