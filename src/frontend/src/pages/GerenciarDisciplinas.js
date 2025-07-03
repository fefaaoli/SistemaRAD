import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GerenciarDisciplinas.css';

function GerenciarDisciplinas() {
  const navigate = useNavigate();
  const [showAddDisciplinaPopup, setShowAddDisciplinaPopup] = useState(false);
  const [formData, setFormData] = useState({
    codigo: '',
    disciplina: '',
    turma: '',
    turno: '',
    tipo: 'Optativa Eletiva',
    creditos: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados da disciplina:', formData);
    // Aqui você faria a chamada API para salvar
    setShowAddDisciplinaPopup(false);
  };

  const handleEditarDisciplinas = () => {
    navigate('/editar-disciplinas');
  };

  return (
    <div className="frame-48">
      <div className="frame-41">
        <div className="frame-44">
          <div className="frame-2333">
            {/* Botão 1: Adicionar Disciplinas */}
            <button 
              className="transaction-item" 
              onClick={() => setShowAddDisciplinaPopup(true)}
              aria-label="Adicionar Disciplinas"
            >
              <div className="frame-19">
                <img className="plus" src="plus0.svg" alt="Ícone de adição" />
              </div>
              <div className="frame-34">
                <div className="adicionar-disciplinas">Adicionar Disciplinas</div>
                <div className="inclus-o-de-novas-disciplinas-para-o-semestre-vigente">
                  Inclusão de novas disciplinas para o semestre vigente.
                </div>
              </div>
            </button>

            {/* Botão 2: Editar Disciplinas (mantido como estava) */}
            <button 
              className="transaction-item2" 
              onClick={handleEditarDisciplinas}
              aria-label="Editar Disciplinas"
            >
              <div className="frame-19">
                <img className="pencil" src="pencil0.svg" alt="Ícone de edição" />
              </div>
              <div className="frame-34">
                <div className="editar-disciplinas">Editar Disciplinas</div>
                <div className="edi-o-das-disciplinas-para-o-semestre-vigente">
                  Edição das disciplinas para o semestre vigente.
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Pop-up de Adicionar Disciplina */}
      {showAddDisciplinaPopup && (
      <div className="popup-overlay">
        <div className="popup-disciplina-container">
          <div className="popup-disciplina-card">
            <div className="popup-disciplina-header">
              <img className="popup-disciplina-icon" src="plus-circle0.svg" alt="Ícone adicionar"/>
              <div className="popup-disciplina-title">Adicionar Disciplina</div>
            </div>
        
        <div className="popup-disciplina-body">
          <form onSubmit={handleSubmit}>
            <div className="popup-disciplina-content">
              <div className="popup-input-field">
                <div className="popup-input-label">Código</div>
                <div className="popup-input-wrapper">
                  <input
                    type="text"
                    name="codigo"
                    value={formData.codigo}
                    onChange={handleInputChange}
                    className="popup-input-text"
                  />
                </div>
              </div>
              
              <div className="popup-input-field">
                <div className="popup-input-label">Disciplina</div>
                <div className="popup-input-wrapper">
                  <input
                    type="text"
                    name="disciplina"
                    value={formData.disciplina}
                    onChange={handleInputChange}
                    className="popup-input-text"
                  />
                </div>
              </div>
              
              <div className="popup-input-field">
                <div className="popup-input-label">Turma</div>
                <div className="popup-input-wrapper">
                  <select
                    name="turma"
                    value={formData.turma}
                    onChange={handleInputChange}
                    className="popup-input-text"
                  >
                    <option>1º Semestre</option>
                    <option>2º Semestre</option>
                  </select>
                  <img className="popup-selector-icon" src="selector0.svg" alt="Seletor"/>
                </div>
              </div>
              
              <div className="popup-input-field">
                <div className="popup-input-label">Turno</div>
                <div className="popup-input-wrapper">
                  <select
                    name="turno"
                    value={formData.turno}
                    onChange={handleInputChange}
                    className="popup-input-text"
                  >
                    <option>Diurno</option>
                    <option>Noturno</option>
                  </select>
                  <img className="popup-selector-icon" src="selector1.svg" alt="Seletor"/>
                </div>
              </div>
              

                <div className="popup-input-field">
                  <div className="popup-input-label">Tipo de Disciplina</div>
                  <div className="popup-input-wrapper">
                    <select
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleInputChange}
                      className="popup-input-text"
                    >
                      <option>Optativa Eletiva</option>
                      <option>Optativa Livre</option>
                      <option>Obrigatória</option>
                    </select>
                    <img className="popup-dropdown-icon" src="selector2.svg" alt="Seletor"/>
                  </div>
                </div>

              
              <div className="popup-input-field">
                <div className="popup-input-label">Créditos</div>
                <div className="popup-input-wrapper">
                  <input
                    type="number"
                    name="creditos"
                    value={formData.creditos}
                    onChange={handleInputChange}
                    className="popup-input-text"
                    min="1"
                    max="10"
                  />
                </div>
              </div>
            </div>
            
            <div className="popup-disciplina-actions">
              <button 
                type="button"
                className="popup-cancel-button"
                onClick={() => setShowAddDisciplinaPopup(false)}
              >
                <div className="popup-button-text">Cancelar</div>
                <img className="popup-cancel-icon" src="x0.svg" alt="Cancelar"/>
              </button>
              
              <button 
                type="submit"
                className="popup-confirm-button"
              >
                <div className="popup-button-text">Adicionar</div>
                <img className="popup-confirm-icon" src="check0.svg" alt="Confirmar"/>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default GerenciarDisciplinas;