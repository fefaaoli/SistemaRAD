import SideBar from '../components/Sidebar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom'; // Importe o useNavigate
import './ConfigurarDisciplinas.css';

function ConfigurarDisciplinas() {
  const navigate = useNavigate(); // Inicialize o hook

  // Funções para navegação
  const handleSelecionarDisciplinas = () => {
    navigate('/selecionar-disciplinas');
  };

  const handleGerenciarDisciplinas = () => {
    navigate('/gerenciar-disciplinas');
  };

  return (
    <div className="frame-2315">
      <div className="frame-2304">
        <div className="frame-2322">
          <div className="frame-2319">
            <img className="mask-group" src="mask-group0.svg" alt="logo" />
            <div className="top-navigation-bar">
              <div className="ol-carlos-silva">Olá, Carlos Silva.</div>
              <div className="frame-2320">
                <div className="perfil-de-administrador">Perfil de Administrador</div>
                <div className="per-odo-letivo-atual-2025-01">
                  Período Letivo Atual: 2025/01
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Área de conteúdo ajustável com os novos elementos */}
        <div className="content-area">
          <div className="frame-2318">
            <div className="frame-32">
              <button className="tab" onClick={handleSelecionarDisciplinas} style={{ cursor: 'pointer' }}><div className="tab-label">Selecionar Disciplinas</div></button>
              <button className="tab2" onClick={handleGerenciarDisciplinas} style={{ cursor: 'pointer' }}><div className="tab-label2">Gerenciar Disciplinas</div></button>
            </div>
          </div>
          <div className="configurar-disciplinas">Configurar Disciplinas</div>
        </div>

        <Footer />
      </div>
      {/* Sidebar */}
      <SideBar />
    </div>
  );
}

export default ConfigurarDisciplinas;