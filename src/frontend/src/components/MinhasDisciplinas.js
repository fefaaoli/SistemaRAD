import React, { useState, useEffect } from 'react';
import './MinhasDisciplinas.css';

const DisciplinasManager = () => {
  // Estados
  const [disciplinas, setDisciplinas] = useState([]);
  const [filteredDisciplinas, setFilteredDisciplinas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [disciplinaEditando, setDisciplinaEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 20;

  // Dados mockados
  useEffect(() => {
    setLoading(true);
    try {
      const mockData = [
        { id: 1, codigo: 'MAT101', nome: 'Matemática Básica', turma: '1A', tipo: 'Obrigatória', turno: 'Diurno', cred: 4 },
        { id: 2, codigo: 'FIS201', nome: 'Física Geral', turma: '2B', tipo: 'Obrigatória', turno: 'Noturno', cred: 4 },
        { id: 3, codigo: 'ART301', nome: 'Arte Contemporânea', turma: '3C', tipo: 'Optativa Livre', turno: 'Diurno', cred: 2 }
      ];
      
      setDisciplinas(mockData);
      setFilteredDisciplinas(mockData);
    } catch (err) {
      setError("Erro ao carregar dados mockados");
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtro de busca
  useEffect(() => {
    const results = disciplinas.filter(disciplina =>
      disciplina.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disciplina.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDisciplinas(results);
    setCurrentPage(1);
  }, [searchTerm, disciplinas]);

  // Handlers
  const handleEditarClick = (disciplina) => {
    setDisciplinaEditando(disciplina);
    setShowEditModal(true);
  };

  const handleSalvarEdicao = (dadosAtualizados) => {
    // Atualiza o estado local
    setDisciplinas(prev => prev.map(d => 
      d.id === dadosAtualizados.id ? dadosAtualizados : d
    ));
    
    setShowEditModal(false);
    alert('Disciplina atualizada com sucesso!');
  };

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDisciplinas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDisciplinas.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading && disciplinas.length === 0) {
    return (
      <div className="loading-frame">
        <div className="loading-spinner"></div>
        <p>Carregando disciplinas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-frame">
        <p>Erro: {error}</p>
        <button onClick={() => window.location.reload()}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="main-disciplinas-frame">
      <div className="content-disciplinas-frame">
        <div className="header-disciplinas-frame">
          <div className="search-frame">
            <div className="search-input-frame">
              <input
                type="text"
                placeholder="Buscar Disciplina"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <img className="search-icon" src="search0.svg" alt="Buscar" />
            </div>
          </div>
          <div className="filter-frame">
            <img className="filter-icon" src="filter0.svg" alt="Filtrar" />
          </div>
        </div>
        
        <div className="list-disciplinas-frame">
          <div className="table-disciplinas-frame">
            <div className="table-header-frame">
              <div className="header-codigo-frame">Código</div>
              <div className="header-nome-frame">Disciplina</div>
              <div className="header-turma-frame">Turma</div>
              <div className="header-tipo-frame">Tipo</div>
              <div className="header-turno-frame">Turno</div>
              <div className="header-editar-frame">Editar</div>
              <div className="header-checkbox-frame"></div>
            </div>
            
            {currentItems.map((disciplina, index) => (
              <div className="table-row-frame" key={index}>
                <div className="cell-codigo-frame">{disciplina.codigo}</div>
                <div className="cell-nome-frame">{disciplina.nome}</div>
                <div className="cell-turma-frame">{disciplina.turma}</div>
                <div className="cell-tipo-frame">{disciplina.tipo}</div>
                <div className="cell-turno-frame">{disciplina.turno}</div>
                <div className="cell-editar-frame">
                  <button 
                    className="edit-button-frame"
                    onClick={() => handleEditarClick(disciplina)}
                  >
                    <img className="pencil-icon" src="pencil0.svg" alt="Editar" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="pagination-frame">
            <button 
              className="pagination-button-frame" 
              disabled={currentPage === 1}
              onClick={() => paginate(currentPage - 1)}
            >
              <img className="chevron-left" src="chevron-left0.svg" alt="Anterior" />
              <div className="pagination-text-frame">Anterior</div>
            </button>
            
            <div className="pagination-numbers-frame">
              {[...Array(totalPages).keys()].map(number => (
                <button
                  key={number}
                  className={`page-number-frame ${currentPage === number + 1 ? 'active' : ''}`}
                  onClick={() => paginate(number + 1)}
                >
                  {number + 1}
                </button>
              ))}
            </div>
            
            <button 
              className="pagination-button-frame" 
              disabled={currentPage === totalPages}
              onClick={() => paginate(currentPage + 1)}
            >
              <div className="pagination-text-frame">Próxima</div>
              <img className="chevron-right" src="chevron-right0.svg" alt="Próxima" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Edição */}
      {showEditModal && disciplinaEditando && (
        <div className="edit-modal-overlay-frame">
          <div className="edit-modal-frame">
            <div className="modal-header-frame">
              <img className="lapisBRANCO" src="BRANCOpencil0.svg" alt="Ícone editar"/>
              <div className="modal-title-frame">Editar Disciplina</div>
            </div>
            <div className="modal-body-frame">
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSalvarEdicao(disciplinaEditando);
              }}>
                <div className="form-group-frame">
                  <label>Código</label>
                  <input
                    type="text"
                    value={disciplinaEditando.codigo}
                    onChange={(e) => setDisciplinaEditando({
                      ...disciplinaEditando,
                      codigo: e.target.value
                    })}
                    required
                  />
                </div>
                <div className="form-group-frame">
                  <label>Disciplina</label>
                  <input
                    type="text"
                    value={disciplinaEditando.nome}
                    onChange={(e) => setDisciplinaEditando({
                      ...disciplinaEditando,
                      nome: e.target.value
                    })}
                    required
                  />
                </div>
                <div className="form-group-frame">
                  <label>Turma</label>
                  <select
                    value={disciplinaEditando.turma}
                    onChange={(e) => setDisciplinaEditando({
                      ...disciplinaEditando,
                      turma: e.target.value
                    })}
                    required
                  >
                    <option>1º Semestre</option>
                    <option>2º Semestre</option>
                    <option>3º Semestre</option>
                  </select>
                </div>
                <div className="form-group-frame">
                  <label>Tipo</label>
                  <select
                    value={disciplinaEditando.tipo}
                    onChange={(e) => setDisciplinaEditando({
                      ...disciplinaEditando,
                      tipo: e.target.value
                    })}
                    required
                  >
                    <option>Obrigatória</option>
                    <option>Optativa Livre</option>
                    <option>Optativa Eletiva</option>
                  </select>
                </div>
                <div className="form-group-frame">
                  <label>Turno</label>
                  <select
                    value={disciplinaEditando.turno}
                    onChange={(e) => setDisciplinaEditando({
                      ...disciplinaEditando,
                      turno: e.target.value
                    })}
                    required
                  >
                    <option>Diurno</option>
                    <option>Noturno</option>
                  </select>
                </div>
                <div className="form-group-frame">
                  <label>Créditos</label>
                  <input
                    type="number"
                    value={disciplinaEditando.cred || ''}
                    onChange={(e) => setDisciplinaEditando({
                      ...disciplinaEditando,
                      cred: parseInt(e.target.value) || 0
                    })}
                    min="1"
                    max="10"
                    required
                  />
                </div>
                <div className="popup-disciplina-actions">
                  <button 
                    type="button"
                    className="popup-cancel-button"
                    onClick={() => setShowEditModal(false)}
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
                    <div className="popup-button-text">Salvar</div>
                    <img className="popup-check-icon" src="check0.svg" alt="Confirmar"/>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisciplinasManager;