import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
import DisciplinasDocentes from './pages/DisciplinasDocentes';

function App() {
  return (
      <Router> {/* Adicione basename aqui */}

      {/* Container do Toastify */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

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
        <Route path="/disciplinas-docentes" element={<DisciplinasDocentes />} />

        {/* Adicione uma rota fallback para evitar 404 */}
        <Route path="*" element={<Login />} />
        </Routes>
    </Router>
  );
}

export default App;