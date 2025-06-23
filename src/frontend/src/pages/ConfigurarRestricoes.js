import { useState } from 'react';
import SideBar from '../components/Sidebar';
import Footer from '../components/Footer';
import './ConfigurarDisciplinas.css';
import './NovoPeriodo.css';

function ConfigurarRestricoes() {
  // Estados para controlar cada popup
  const [showRestricaoPopup, setShowRestricaoPopup] = useState(false);
  const [showDataLimitePopup, setShowDataLimitePopup] = useState(false);
  
  // Estados para os formulários
  const [periodo, setPeriodo] = useState('');
  const [dataLimite, setDataLimite] = useState('');

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
          <div className="frame-48">
            <div className="frame-41">
              <div className="frame-44">
                <div className="frame-2333">
                  {/* Botão 1 - Restrição de Horário */}
                  <button 
                    className="transaction-item" 
                    onClick={() => setShowRestricaoPopup(true)}
                    aria-label="Restrição de Horário"
                  >
                    <div className="frame-19">
                      <img className="plus" src="plus0.svg" alt="Ícone de adição" />
                    </div>
                    <div className="frame-34">
                      <div className="adicionar-disciplinas">Restrição de Horário</div>
                      <div className="inclus-o-de-novas-disciplinas-para-o-semestre-vigente">
                        Definir mínimo de horários disponíveis e limite de indisponibilidades para docentes.
                      </div>
                    </div>
                  </button>

                  {/* Botão 2 - Data Limite */}
                  <button 
                    className="transaction-item2" 
                    onClick={() => setShowDataLimitePopup(true)}
                    aria-label="Data Limite"
                  >
                    <div className="frame-19">
                      <img className="pencil" src="pencil0.svg" alt="Ícone de edição" />
                    </div>
                    <div className="frame-34">
                      <div className="editar-disciplinas">Data Limite</div>
                      <div className="edi-o-das-disciplinas-para-o-semestre-vigente">
                        Configuração de prazo para edição de disciplinas e comentários para docentes.
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="configurar-disciplinas">Configurar Restrições</div>
        <Footer />
      </div>
      <SideBar />

      {/* Popup 1 - Restrição de Horário */}
      {showRestricaoPopup && (
        <div className="popup-overlay">
          <div className="popup-periodo-container">
            <div className="popup-periodo-header">
              <img className="popup-periodo-icon" src="plus-circle0.svg" alt="Ícone adicionar"/>
              <div className="popup-periodo-title">Restrição de Horário</div>
            </div>
            
            <div className="popup-periodo-body">
              <div className="popup-periodo-content">
                <div className="popup-text-input-field">
                  <div className="popup-label">Quantidade mínima de slots de horário disponíveis:</div>
                  <div className="popup-text-input">
                    <input
                      type="text"
                      value={periodo}
                      onChange={(e) => setPeriodo(e.target.value)}
                      placeholder=""
                      className="popup-input-text"
                    />
                  </div>
                </div>
              </div>
              
              <div className="popup-periodo-actions">
                <button 
                  className="popup-button-cancel"
                  onClick={() => setShowRestricaoPopup(false)}
                >
                  <div className="popup-button-label">Cancelar</div>
                  <img className="popup-x-icon" src="x0.svg" alt="Cancelar"/>
                </button>
                
                <button 
                  className="popup-button-confirm"
                  onClick={() => {
                    // Lógica para salvar a restrição
                    setShowRestricaoPopup(false);
                  }}
                >
                  <div className="popup-button-label">Salvar</div>
                  <img className="popup-check-icon" src="check0.svg" alt="Confirmar"/>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup 2 - Data Limite */}
      {showDataLimitePopup && (
        <div className="popup-overlay">
          <div className="popup-periodo-container">
            <div className="popup-periodo-header">
              <img className="popup-periodo-icon" src="plus-circle0.svg" alt="Ícone adicionar"/>
              <div className="popup-periodo-title">Configurar Data Limite</div>
            </div>
            
            <div className="popup-periodo-body">
              <div className="popup-periodo-content">
                <div className="popup-text-input-field">
                  <div className="popup-label">Data Limite</div>
                  <div className="popup-text-input">
                    <input
                      type="date"
                      value={dataLimite}
                      onChange={(e) => setDataLimite(e.target.value)}
                      className="popup-input-text"
                    />
                  </div>
                </div>
              </div>
              
              <div className="popup-periodo-actions">
                <button 
                  className="popup-button-cancel"
                  onClick={() => setShowDataLimitePopup(false)}
                >
                  <div className="popup-button-label">Cancelar</div>
                  <img className="popup-x-icon" src="x0.svg" alt="Cancelar"/>
                </button>
                
                <button 
                  className="popup-button-confirm"
                  onClick={() => {
                    // Lógica para salvar a data limite
                    setShowDataLimitePopup(false);
                  }}
                >
                  <div className="popup-button-label">Salvar</div>
                  <img className="popup-check-icon" src="check0.svg" alt="Confirmar"/>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConfigurarRestricoes;