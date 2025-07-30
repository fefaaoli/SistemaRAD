import { useState } from 'react';
import SideBar from '../components/Sidebar';
import Footer from '../components/Footer';
import './NovoPeriodo.css';
import { criarPeriodo } from '../services/apiPeriodo'; // Importação do serviço

function NovoPeriodo() {
  const [showPopup, setShowPopup] = useState(false);
  const [periodo, setPeriodo] = useState('');

  // Função modificada para integrar com o backend
  const handleAddPeriodo = async () => {
    if (!/^\d{4}\/[12]$/.test(periodo)) {
      alert('Formato inválido! Use AAAA/S (Ex: 2025/1 ou 2026/2)');
      return;
    }

    try {
      // Chamada à API
      await criarPeriodo(periodo);
      alert(`Período ${periodo} criado com sucesso!`);
      setPeriodo('');
      setShowPopup(false);
    } catch (error) {
      alert(`Erro ao criar período: ${error.response?.data?.error || error.message}`);
    }
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

        <div className="content-area">
          <div className="frame-2333">
            <button 
              className="transaction-item" 
              onClick={() => setShowPopup(true)}
              aria-label="Adicionar Novo Período"
            >
              <div className="frame-19">
                <img className="plus" src="plus0.svg" alt="Ícone de adição" />
              </div>
              <div className="frame-34">
                <div className="adicionar-disciplinas">Adicionar Novo Período</div>
                <div className="inclus-o-de-novas-disciplinas-para-o-semestre-vigente">
                  Inclusão de um novo período para o semestre atual.
                </div>
              </div>
            </button>
          </div>  
        </div>

        <div className="configurar-disciplinas">Novo Periodo</div>

        <Footer />
      </div>
      <SideBar />

      {/* Pop-up */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-periodo-container">
            <div className="popup-periodo-header">
              <img className="popup-periodo-icon" src="plus-circle0.svg" alt="Ícone adicionar"/>
              <div className="popup-periodo-title">Adicionar Novo Período</div>
            </div>
            
            <div className="popup-periodo-body">
              <div className="popup-periodo-content">
                <div className="popup-text-input-field">
                  <div className="popup-label">Período</div>
                  <div className="popup-text-input">
                    <input
                      type="text"
                      value={periodo}
                      onChange={(e) => setPeriodo(e.target.value)}
                      placeholder="aaaa/s"
                      className="popup-input-text"
                    />
                  </div>
                </div>
              </div>
              
              <div className="popup-periodo-actions">
                <button 
                  className="popup-button-cancel"
                  onClick={() => setShowPopup(false)}
                >
                  <div className="popup-button-label">Cancelar</div>
                  <img className="popup-x-icon" src="x0.svg" alt="Cancelar"/>
                </button>
                
                <button 
                  className="popup-button-confirm"
                  onClick={handleAddPeriodo}
                >
                  <div className="popup-button-label">Adicionar</div>
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

export default NovoPeriodo;