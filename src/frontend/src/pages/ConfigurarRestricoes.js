import React, { useEffect, useState } from 'react';
import SideBar from '../components/Sidebar';
import Footer from '../components/Footer';
import './ConfigurarDisciplinas.css';
import './NovoPeriodo.css';
import { definirDataLimite } from '../services/apiPeriodo';

function ConfigurarRestricoes() {
  const [showRestricaoPopup, setShowRestricaoPopup] = useState(false);
  const [showDataLimitePopup, setShowDataLimitePopup] = useState(false);
  const [periodoAtual, setPeriodoAtual] = useState('Carregando...');

  // Estado para data limite
  const [dataLimite, setDataLimite] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Estado para restrição de horários
  const [minSlotsDisponiveis, setMinSlotsDisponiveis] = useState('');
  const [maxIndisponiveis, setMaxIndisponiveis] = useState('');
  const [totalHorarios, setTotalHorarios] = useState('');

  // Período fixo (ou você pode usar um dinâmico se tiver disponível)
  const periodo = '2025/1';

  // Buscar o período atual
  useEffect(() => {
    async function fetchPeriodo() {
      try {
        const response = await fetch('http://localhost:5000/api/admin/horarios/periodo-recente');
        const data = await response.json();
        setPeriodoAtual(data.periodo);
      } catch (error) {
        console.error('Erro ao buscar período:', error);
        setPeriodoAtual('Indisponível');
      }
    }

    fetchPeriodo();
  }, []);

  // Abrir popup e buscar dados da restrição
  const handleAbrirRestricao = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/restricoes/horario?periodo=${periodo}`);
      const data = await res.json();

      setMinSlotsDisponiveis(data.minSlotsDisponiveis);
      setMaxIndisponiveis(data.maxIndisponiveis);
      setTotalHorarios(data.totalHorarios);
      setShowRestricaoPopup(true);
    } catch (error) {
      alert('Erro ao buscar restrição de horário');
    }
  };

  // Salvar nova restrição
  const handleSalvarRestricao = async () => {
    try {
      const body = {
        minSlotsDisponiveis: parseInt(minSlotsDisponiveis)
      };

      const res = await fetch('http://localhost:5000/api/admin/restricoes/horario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        throw new Error('Erro ao salvar restrição');
      }

      alert('Restrição atualizada com sucesso!');
      setShowRestricaoPopup(false);
    } catch (error) {
      alert(`Erro: ${error.message}`);
    }
  };

  // Salvar data limite
  const handleSalvarDataLimite = async () => {
    if (!dataLimite) {
      alert('Selecione uma data válida!');
      return;
    }

    setIsLoading(true);
    try {
      await definirDataLimite(periodo, dataLimite);
      alert('Data limite configurada com sucesso!');
      setShowDataLimitePopup(false);
    } catch (error) {
      alert(`Erro: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsLoading(false);
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
                  Período Letivo Atual: {periodoAtual}
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
                  <button 
                    className="transaction-item" 
                    onClick={handleAbrirRestricao}
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

      {/* Popup - Restrição de Horário */}
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
                      type="number"
                      value={minSlotsDisponiveis}
                      onChange={(e) => setMinSlotsDisponiveis(e.target.value)}
                      className="popup-input-text"
                    />
                  </div>
                </div>

                <div className="popup-label" style={{ marginTop: '10px' }}>
                  Limite de horários indisponíveis permitido: <strong>{maxIndisponiveis}</strong> (de um total de {totalHorarios})
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
                  onClick={handleSalvarRestricao}
                >
                  <div className="popup-button-label">Salvar</div>
                  <img className="popup-check-icon" src="check0.svg" alt="Confirmar"/>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup - Data Limite */}
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
                      value={dataLimite}
                      onChange={(e) => setDataLimite(e.target.value)}
                      placeholder="dd/mm/aaaa"
                      className="popup-input-text"
                    />
                  </div>
                </div>
              </div>
              
              <div className="popup-periodo-actions">
                <button 
                  className="popup-button-cancel"
                  onClick={() => setShowDataLimitePopup(false)}
                  disabled={isLoading}
                >
                  <div className="popup-button-label">Cancelar</div>
                  <img className="popup-x-icon" src="x0.svg" alt="Cancelar"/>
                </button>
                
                <button 
                  className="popup-button-confirm"
                  onClick={handleSalvarDataLimite}
                  disabled={isLoading}
                >
                  <div className="popup-button-label">
                    {isLoading ? 'Salvando...' : 'Salvar'}
                  </div>
                  {!isLoading && <img className="popup-check-icon" src="check0.svg" alt="Confirmar"/>}
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
