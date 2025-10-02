import { useState } from 'react';
import { toast } from "react-toastify";
import axios from 'axios';
import './GerenciarDisciplinas.css';
import DisciplinasEditar from '../components/DisciplinasEditar';

function GerenciarDisciplinas() {
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

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/disciplinas`, disciplinaData);
      
      console.log('Disciplina criada:', response.data);
      setShowAddDisciplinaPopup(false);
      toast.success('Disciplina criada com sucesso!');
      
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

  return (
    <div className="frame-48AD">
          <div className="frame-2333AD">
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
                <div className="adicionar-disciplinas">Adicionar Disciplina</div>
                <div className="inclus-o-de-novas-disciplinas-para-o-semestre-vigente">
                  Cadastro de novas disciplinas no sistema.
                </div>
              </div>
            </button>
          </div>


      <DisciplinasEditar/>

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
                      <div className="popup-input-label">Código *</div>
                      <div className="popup-input-wrapper">
                        <input
                          type="text"
                          name="codigo"
                          value={formData.codigo}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              codigo: e.target.value.slice(0, 10) // máx. 10 chars
                            })
                          }
                          className="popup-input-text"
                          required
                          maxLength={10}
                        />
                      </div>
                    </div>
                    
                    <div className="popup-input-field">
                      <div className="popup-input-label">Disciplina *</div>
                      <div className="popup-input-wrapper">
                        <input
                          type="text"
                          name="disciplina"
                          value={formData.disciplina}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              disciplina: e.target.value.slice(0, 60) // máx. 60 chars
                            })
                          }
                          className="popup-input-text"
                          required
                          maxLength={60}
                        />
                      </div>
                    </div>
                    
                    <div className="popup-input-field">
                      <div className="popup-input-label">Turma *</div>
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
                      <div className="popup-input-label">Turno *</div>
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
                      <div className="popup-input-label">Tipo de Disciplina *</div>
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
                      <div className="popup-input-label">Créditos *</div>
                      <div className="popup-input-wrapper">
                        <input
                          type="number"
                          name="creditos"
                          value={formData.creditos}
                          onChange={(e) => {
                            const value = parseInt(e.target.value, 10);
                            if (value >= 0 && value <= 10) {
                              setFormData({ ...formData, creditos: value });
                            }
                          }}
                          className="popup-input-text"
                          min="0"
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