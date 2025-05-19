import { useState } from 'react';
import './Sidebar.css';

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Expande quando passar o mouse em qualquer botão
  const handleMouseEnterButton = () => {
    setIsOpen(true);
  };

  // Reduz quando tirar o mouse da sidebar inteira
  const handleMouseLeaveSidebar = () => {
    setIsOpen(false);
  };

  return (
    <div
      className={`side-navigation-bar ${isOpen ? 'expanded' : 'collapsed'}`}
      onMouseLeave={handleMouseLeaveSidebar}  // detecta quando sai da sidebar
    >
      <div className="frame-23">
        <button className="button" onMouseEnter={handleMouseEnterButton}>
          <img className="icon" src="home0.svg" alt="Início" />
          {isOpen && <span className="button-label">Início</span>}
        </button>

        <button className="button1" onMouseEnter={handleMouseEnterButton}>
          <img className="icon" src="clipboard-list0.svg" alt="Administração" />
          {isOpen && <span className="button-label">Administração</span>}
        </button>

        <button className="button2" onMouseEnter={handleMouseEnterButton}>
          <img className="icon" src="calendar0.svg" alt="Agenda Docentes" />
          {isOpen && <span className="button-label">Agenda Docentes</span>}
        </button>

        <button className="button3" onMouseEnter={handleMouseEnterButton}>
          <img className="icon" src="document-download0.svg" alt="Exportar Dados" />
          {isOpen && <span className="button-label">Exportar Dados</span>}
        </button>
      </div>

      <div className="frame-25">
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




