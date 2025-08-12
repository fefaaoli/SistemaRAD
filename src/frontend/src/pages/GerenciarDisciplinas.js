import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './GerenciarDisciplinas.css';

function GerenciarDisciplinas() {
  const navigate = useNavigate();
  const [showAddDisciplinaPopup, setShowAddDisciplinaPopup] = useState(false);
  const [formData, setFormData] = useState({
    codigo: '',
    disciplina: '',
    turma: '1º Semestre',
    turno: 'Diurno',
    tipo: 'Optativa Eletiva',
    creditos: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Mapeia os campos do formulário para o formato da API
      const disciplinaData = {
        cod: formData.codigo,
        disciplina: formData.disciplina,
        turma: formData.turma, 
        tipo: formData.tipo === 'Optativa Eletiva' ? 'optativa_eletiva' : 
              formData.tipo === 'Optativa Livre' ? 'optativa_livre' : 'obrigatoria',
        cred: parseInt(formData.creditos),
        comentario: '' // Adicione se necessário
      };

      const response = await axios.post('http://localhost:5000/api/admin/disciplinas', disciplinaData);
      
      console.log('Disciplina criada:', response.data);
      setShowAddDisciplinaPopup(false);
      alert('Disciplina criada com sucesso!');
      
      // Limpa o formulário após sucesso
      setFormData({
        codigo: '',
        disciplina: '',
        turma: '1º Semestre',
        turno: 'Diurno',
        tipo: 'Optativa Eletiva',
        creditos: ''
      });

    } catch (err) {
      console.error('Erro ao criar disciplina:', err);
      setError(err.response?.data?.error || 'Erro ao criar disciplina');
    } finally {
      setLoading(false);
    }
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

            {/* Botão 2: Editar Disciplinas */}
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
                          required
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
                          required
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
                          required
                        >
                          <option>1º Semestre</option>
                          <option>2º Semestre</option>
                          <option>3º Semestre</option>
                          <option>4º Semestre</option>
                          <option>5º Semestre</option>
                          <option>6º Semestre</option>
                          <option>7º Semestre</option>
                          <option>8º Semestre</option>
                          <option>9º Semestre</option>
                          <option>10º Semestre</option>
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
                          required
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
                          required
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
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Mensagem de erro */}
                  {error && (
                    <div className="popup-error-message">
                      <img src="alert-circle0.svg" alt="Erro" />
                      <span>{error}</span>
                    </div> 
                  )} 
                  
                  <div className="popup-disciplina-actions">
                    <button 
                      type="button"
                      className="popup-cancel-button"
                      onClick={() => setShowAddDisciplinaPopup(false)}
                      disabled={loading}
                    >
                      <div className="popup-button-text">Cancelar</div>
                      <img className="popup-cancel-icon" src="x0.svg" alt="Cancelar"/>
                    </button>
                    
                    <button 
                      type="submit"
                      className="popup-confirm-button"
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="popup-button-text">Aguarde...</div>
                      ) : (
                        <>
                          <div className="popup-button-text">Adicionar</div>
                          <img className="popup-confirm-icon" src="check0.svg" alt="Confirmar"/>
                        </>
                      )}
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