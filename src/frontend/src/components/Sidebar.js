import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const [showAgendaDropdown, setShowAgendaDropdown] = useState(false);
  const navigate = useNavigate();

  const handleMouseEnterButton = () => {
    setIsOpen(true);
  };

  const handleMouseLeaveSidebar = () => {
    setIsOpen(false);
    setShowAdminDropdown(false);
    setShowAgendaDropdown(false);
  };

    // Função para redirecionar

  const handleDashboard = () => {
    navigate('/dashboard');
  };
  const handleNovoPeriodo = () => {
    navigate('/novo-periodo');
  };

  const handleConfigurarDisciplinas = () => {
    navigate('/configurar-disciplinas');
  };

  const handleConfigurarHorario = () => {
    navigate('/configurar-horario');
  };

  const handleConfigurarRestricoes = () => {
    navigate('/configurar-restricoes');
  };

  const handleConfigurarUsuarios = () => {
    navigate('/configurar-usuarios');
  };

  const handleSelecaoDisciplinas = () => {
    navigate('/selecao-disciplinas');
  };

  const handleRestricoesHorario = () => {
    navigate('/restricoes-horario');
  };

  const handleDadosDocentes = () => {
    navigate('/dados-docentes');
  };

  return (
    <div
      className={`side-navigation-bar ${isOpen ? 'expanded' : 'collapsed'}`}
      onMouseLeave={handleMouseLeaveSidebar}
    >
      <div className="frame-23">
        <button
          className={`button1 ${isOpen ? 'expanded' : ''}`}
          onMouseEnter={handleMouseEnterButton}
        >
          <img className="icon" src="home0.svg" alt="Início" />
          {isOpen && <span className="button-label" onClick={handleDashboard}>Início</span>}
        </button>

        {/* ADMINISTRAÇÃO */}
        <div
    
          onMouseEnter={() => {
            handleMouseEnterButton();
            setShowAdminDropdown(true);
          }}
          onMouseLeave={() => setShowAdminDropdown(false)}
        >
          <button className={`button2 ${isOpen ? 'expanded' : ''}`}>
            <img className="icon" src="clipboard-list0.svg" alt="Administração" />
            {isOpen && <span className="button-label">Administração</span>}
          </button>

          {isOpen && showAdminDropdown && (
            <div className={`dropdown-menu ${isOpen ? 'expanded' : 'collapsed'}`}>
              <button className="dropdown-item" onClick={handleNovoPeriodo}>Novo Período</button>
              <button className="dropdown-item" onClick={handleConfigurarDisciplinas}>Configurar Disciplinas</button>
              <button className="dropdown-item" onClick={handleConfigurarHorario}>Configurar Horário</button>
              <button className="dropdown-item" onClick={handleConfigurarRestricoes}>Configurar Restrições</button>
              <button className="dropdown-item" onClick={handleConfigurarUsuarios}>Configurar Usuários</button>
            </div>
          )}
        </div>

        {/* AGENDA DOCENTES */}
        <div
          onMouseEnter={() => {
            handleMouseEnterButton();
            setShowAgendaDropdown(true);
          }}
          onMouseLeave={() => setShowAgendaDropdown(false)}
        >
          <button className={`button3 ${isOpen ? 'expanded' : ''}`}>
            <img className="icon" src="calendar0.svg" alt="Agenda Docentes" />
            {isOpen && <span className="button-label">Agenda Docentes</span>}
          </button>

          {isOpen && showAgendaDropdown && (
            <div className="dropdown-menu">
              <div className={`dropdown-menu ${isOpen ? 'expanded' : 'collapsed'}`}>
                <button className="dropdown-item" onClick={handleSelecaoDisciplinas}>Seleção de Disciplinas</button>
                <button className="dropdown-item" onClick={handleRestricoesHorario}>Restrições de Horário</button>
                <button className="dropdown-item" onClick={handleDadosDocentes}>Dados Docentes</button>
              </div>
            </div>
          )}
        </div>

        <button
          className={`button4 ${isOpen ? 'expanded' : ''}`}
          onMouseEnter={handleMouseEnterButton}
        >
          <img className="icon" src="document-download0.svg" alt="Exportar Dados" />
          {isOpen && <span className="button-label">Exportar Dados</span>}
        </button>
      </div>

      <div 
  className="frame-25"
  onMouseEnter={handleMouseEnterButton} // Adiciona o mesmo handler dos outros botões
  onMouseLeave={handleMouseLeaveSidebar} // Mantém a consistência
>
  <img className="mask-group2" src="mask-group1.svg" alt="Logo lateral" />
  {isOpen && (
    <div className="user-info">
      <div className="user-name">Carlos Silva</div>
      <div className="user-role">Administrador</div>
      <img src="chevron-right0.svg" alt="Fechar Sidebar" />
    </div>
  )}
</div>
    </div>
  );
};

export default SideBar;
