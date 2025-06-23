import { useState } from 'react';
import SideBar from '../components/Sidebar';
import Footer from '../components/Footer';
import SelecionarDisciplinas from './SelecionarDisciplinas';
import GerenciarDisciplinas from './GerenciarDisciplinas';
import './ConfigurarDisciplinas.css';

function ConfigurarDisciplinas() {
  // Inicia sem nenhuma aba selecionada
  const [abaAtiva, setAbaAtiva] = useState(null);

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

        <div className="content-area">
          <div className="frame-2318">
            <div className="frame-32">
              <button 
                className={`tab ${abaAtiva === 'selecionar' ? 'active' : ''}`}
                onClick={() => setAbaAtiva('selecionar')}
              >
                <div className="tab-label">Selecionar Disciplinas</div>
              </button>
              <button 
                className={`tab2 ${abaAtiva === 'gerenciar' ? 'active' : ''}`}
                onClick={() => setAbaAtiva('gerenciar')}
              >
                <div className="tab-label2">Gerenciar Disciplinas</div>
              </button>
            </div>
          </div>
          
          {/* Conteúdo dinâmico (só aparece se uma aba for selecionada) */}
          <div className="conteudo-dinamico">
            {abaAtiva === 'selecionar' && <SelecionarDisciplinas />}
            {abaAtiva === 'gerenciar' && <GerenciarDisciplinas />}
      
          </div>
          
        
        </div>

        <div className="configurar-disciplinas">Configurar Disciplinas</div>

        <Footer />
      </div>
      <SideBar />
    </div>
  );
}

export default ConfigurarDisciplinas;