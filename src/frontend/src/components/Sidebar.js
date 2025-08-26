import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAdmin } from '../auth';
import './Sidebar.css';

const SideBar = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const [showAgendaDropdown, setShowAgendaDropdown] = useState(false);
  const navigate = useNavigate();
  const [nome, setNome] = useState('Carregando...');
  const [perfil, setPerfil] = useState('Carregando...');

  const handleMouseEnterButton = () => {
    setIsOpen(true);
  };

  const handleMouseLeaveSidebar = () => {
    setIsOpen(false);
    setShowAdminDropdown(false);
    setShowAgendaDropdown(false);
  };

  const handleExportarDados = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/exportar-fet', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Erro ao exportar XML');

      const blob = await response.blob(); // pega o arquivo
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'horario_fet.xml'); // nome padrão
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

    } catch (error) {
      console.error(error);
      alert('Erro ao exportar XML');
    }
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

  const handleDisciplinasDocentes = () => {
    navigate('/disciplinas-docentes');
  };

  const handleDadosDocentes = () => {
    navigate('/dados-docentes');
  };

  useEffect(() => {
    async function fetchUsuario() {
      try {
        const token = localStorage.getItem('token'); // pega o token do login

        const response = await fetch('http://localhost:5000/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`, // manda o token no header
          }
        });

        if (!response.ok) throw new Error('Erro ao buscar usuário');
        const data = await response.json();

        // Pega só os dois primeiros nomes
        const primeirosNomes = data.usuario.nome.split(' ')[0];

        setNome(primeirosNomes);
        setPerfil(data.usuario.admin === 1 ? 'Administrador' : 'Docente');

      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        setNome('Usuário');
        setPerfil('Desconhecido');
      }
    }

    fetchUsuario();
  }, []);

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
        {isAdmin() && (
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
        )}

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
                <button className="dropdown-item" onClick={handleDisciplinasDocentes}>Minhas Disciplinas</button>
                {isAdmin() && (
                <button className="dropdown-item" onClick={handleDadosDocentes}>Dados Docentes</button>
                )}
              </div>
            </div>
          )}
        </div>

        {isAdmin() && (
        <button
          className={`button4 ${isOpen ? 'expanded' : ''}`}
          onMouseEnter={handleMouseEnterButton}
          onClick={handleExportarDados}
        >
          <img className="icon" src="document-download0.svg" alt="Exportar Dados" />
          {isOpen && <span className="button-label">Exportar Dados</span>}
        </button> 
        )}
      </div>

      <div 
  className="frame-25"
  onMouseEnter={handleMouseEnterButton} // Adiciona o mesmo handler dos outros botões
  onMouseLeave={handleMouseLeaveSidebar} // Mantém a consistência
>
  <img className="mask-group2" src="mask-group1.svg" alt="Logo lateral" />
  {isOpen && (
    <div className="user-info">
      <div className="user-name">{nome}</div>
      <div className="user-role">{perfil}</div>
      <img src="chevron-right0.svg" alt="Fechar Sidebar" />
    </div>
  )}
</div>
    </div>
  );
};

export default SideBar;
