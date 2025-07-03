import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ConfigurarDisciplinas from './pages/ConfigurarDisciplinas'; 
import SelecionarDisciplinas from './pages/SelecionarDisciplinas';
import GerenciarDisciplinas from './pages/GerenciarDisciplinas';
import ConfirgurarHorario from './pages/ConfigurarHorario';
import NovoPeriodo from './pages/NovoPeriodo';
import ConfigurarRestricoes from './pages/ConfigurarRestricoes';
import ConfigurarUsuarios from './pages/ConfigurarUsuarios';
import SelecaoDisciplinas from './pages/SelecaoDisciplinas';
import RestricoesHorario from './pages/RestricoesHorario';
import DadosDocentes from './pages/DadosDocentes';
import EditarDisciplinas from './pages/EditarDisciplinas';
import GerenciarUsuarios from './pages/GerenciarUsuarios';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/configurar-disciplinas" element={<ConfigurarDisciplinas />} />
        <Route path="/selecionar-disciplinas" element={<SelecionarDisciplinas />} />
        <Route path="/gerenciar-disciplinas" element={<GerenciarDisciplinas />} />
        <Route path="/configurar-horario" element={<ConfirgurarHorario />} />
        <Route path="/novo-periodo" element={<NovoPeriodo />} />
        <Route path="/configurar-restricoes" element={<ConfigurarRestricoes />} />
        <Route path="/configurar-usuarios" element={<ConfigurarUsuarios />} />
        <Route path="/selecao-disciplinas" element={<SelecaoDisciplinas />} />
        <Route path="/restricoes-horario" element={<RestricoesHorario />} />
        <Route path="/dados-docentes" element={<DadosDocentes />} />
        <Route path="/editar-disciplinas" element={<EditarDisciplinas />} />
        <Route path="/gerenciar-usuarios" element={<GerenciarUsuarios />} />

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