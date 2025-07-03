import React, { useState, useEffect } from 'react';
import './DisciplinasEditar.css';

const DisciplinasEditar = () => {
  // Estados
  const [disciplinas, setDisciplinas] = useState([]);
  const [filteredDisciplinas, setFilteredDisciplinas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisciplinas, setSelectedDisciplinas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [disciplinaEditando, setDisciplinaEditando] = useState(null);
  const itemsPerPage = 10;

  // Dados mockados
  useEffect(() => {
    const mockDisciplinas = [
      {
        codigo: 'RAD2801',
        nome: 'Planejamento e Gestão Estratégica de Marketing',
        turma: '1º Semestre',
        tipo: 'Optativa Livre',
        turno: 'Noturno'
      },
      {
        codigo: 'INF101',
        nome: 'Introdução à Programação',
        turma: '3º Semestre',
        tipo: 'Obrigatória',
        turno: 'Noturno'
      },
      {
        codigo: 'RAD2802',
        nome: 'Gestão Empresarial',
        turma: '1º Semestre',
        tipo: 'Obrigatória',
        turno: 'Diurno'
      },
    ];
    setDisciplinas(mockDisciplinas);
    setFilteredDisciplinas(mockDisciplinas);
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
  const handleCheckboxChange = (codigo) => {
    setSelectedDisciplinas(prev => 
      prev.includes(codigo) 
        ? prev.filter(item => item !== codigo) 
        : [...prev, codigo]
    );
  };

  const handleEditarClick = (disciplina) => {
    setDisciplinaEditando(disciplina);
    setShowEditPopup(true);
  };

  const handleSalvarEdicao = (dadosAtualizados) => {
    setDisciplinas(prev => prev.map(d => 
      d.codigo === dadosAtualizados.codigo ? dadosAtualizados : d
    ));
    setShowEditPopup(false);
  };

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDisciplinas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDisciplinas.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="disciplinas-editar-container">
      <div className="disciplinas-editar-content">
        <div className="disciplinas-editar-header">
          <div className="search-container">
            <div className="search-input">
              <input
                type="text"
                placeholder="Buscar Disciplina"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <img className="search-icon" src="search0.svg" alt="Buscar" />
            </div>
          </div>
          <div className="filter-button">
            <img className="filter-icon" src="filter0.svg" alt="Filtrar" />
          </div>
        </div>
        
        <div className="disciplinas-list-container">
          <div className="disciplinas-table">
            <div className="table-header">
              <div className="header-codigo">Código</div>
              <div className="header-nome">Disciplina</div>
              <div className="header-turma">Turma</div>
              <div className="header-tipo">Tipo</div>
              <div className="header-turno">Turno</div>
              <div className="header-editar">Editar</div>
              <div className="header-checkbox"></div>
            </div>
            
            {currentItems.map((disciplina, index) => (
              <div className="table-row" key={index}>
                <div className="cell-codigo">{disciplina.codigo}</div>
                <div className="cell-nome">{disciplina.nome}</div>
                <div className="cell-turma">{disciplina.turma}</div>
                <div className="cell-tipo">{disciplina.tipo}</div>
                <div className="cell-turno">{disciplina.turno}</div>
                <div className="cell-editar">
                  <button 
                    className="edit-button"
                    onClick={() => handleEditarClick(disciplina)}
                  >
                    <img className="pencil-icon" src="pencil0.svg" alt="Editar" />
                  </button>
                </div>
                <div className="row-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedDisciplinas.includes(disciplina.codigo)}
                    onChange={() => handleCheckboxChange(disciplina.codigo)}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="pagination-container">
            <button 
              className="pagination-button" 
              disabled={currentPage === 1}
              onClick={() => paginate(currentPage - 1)}
            >
              <img className="chevron-left" src="chevron-left0.svg" alt="Anterior" />
              <div className="pagination-text">Anterior</div>
            </button>
            
            <div className="pagination-numbers">
              {[...Array(totalPages).keys()].map(number => (
                <button
                  key={number}
                  className={`page-number ${currentPage === number + 1 ? 'active' : ''}`}
                  onClick={() => paginate(number + 1)}
                >
                  {number + 1}
                </button>
              ))}
            </div>
            
            <button 
              className="pagination-button" 
              disabled={currentPage === totalPages}
              onClick={() => paginate(currentPage + 1)}
            >
              <div className="pagination-text">Próxima</div>
              <img className="chevron-right" src="chevron-right0.svg" alt="Próxima" />
            </button>
          </div>

        </div>
      </div>

      {/* Popup de Edição */}
      {showEditPopup && (
        <div className="edit-popup-overlay">
          <div className="edit-popup-container">
            <div className="popup-header">
              <img className="lapisBRANCO" src="BRANCOpencil0.svg" alt="Ícone editar"/>
              <div className="popup-disciplina-title">Editar Disciplina</div>
            </div>
            <div className="popup-bodyE">
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSalvarEdicao(disciplinaEditando);
              }}>
                <div className="form-group">
                  <label>Código</label>
                  <input
                    type="text"
                    value={disciplinaEditando.codigo}
                    onChange={(e) => setDisciplinaEditando({
                      ...disciplinaEditando,
                      codigo: e.target.value
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Disciplina</label>
                  <input
                    type="text"
                    value={disciplinaEditando.nome}
                    onChange={(e) => setDisciplinaEditando({
                      ...disciplinaEditando,
                      nome: e.target.value
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Turma</label>
                  <select
                    value={disciplinaEditando.turma}
                    onChange={(e) => setDisciplinaEditando({
                      ...disciplinaEditando,
                      turma: e.target.value
                    })}
                  >
                    <option>1º Semestre</option>
                    <option>2º Semestre</option>
                    <option>3º Semestre</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Tipo</label>
                  <select
                    value={disciplinaEditando.tipo}
                    onChange={(e) => setDisciplinaEditando({
                      ...disciplinaEditando,
                      tipo: e.target.value
                    })}
                  >
                    <option>Obrigatória</option>
                    <option>Optativa Livre</option>
                    <option>Optativa Eletiva</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Turno</label>
                  <select
                    value={disciplinaEditando.turno}
                    onChange={(e) => setDisciplinaEditando({
                      ...disciplinaEditando,
                      turno: e.target.value
                    })}
                  >
                    <option>Diurno</option>
                    <option>Noturno</option>
                  </select>
                </div>
                <div className="popup-disciplina-actions">
                  <button 
                    type="button"
                    className="popup-cancel-button"
                    onClick={() => setShowEditPopup(false)}
                  >
                    <div className="popup-button-text">Cancelar</div>
                    <img className="popup-cancel-icon" src="x0.svg" alt="Cancelar"/>
                  </button>
                  
                  <button 
                    type="submit"
                    className="popup-confirm-button"
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

export default DisciplinasEditar;