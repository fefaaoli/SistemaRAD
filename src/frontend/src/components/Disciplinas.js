import React, { useState, useEffect } from 'react';
import './Disciplinas.css';
import axios from 'axios';

const Disciplinas = () => {
  // Estados
  const [disciplinas, setDisciplinas] = useState([]);
  const [filteredDisciplinas, setFilteredDisciplinas] = useState([]);
  const [selectedDisciplinas, setSelectedDisciplinas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [filterOption, setFilterOption] = useState('todos');
  const [selectAll, setSelectAll] = useState(false);
  const itemsPerPage = 20;

  // Lógica de paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDisciplinas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDisciplinas.length / itemsPerPage);

  // Função para formatar o tipo da disciplina
  const formatarTipo = (tipo) => {
    const tipos = {
      'optativa_eletiva': 'op. eletiva',
      'optativa_livre': 'op. livre',
      'obrigatoria': 'obrigatória'
    };
    return tipos[tipo] || tipo;
  };

  // Função para formatar a turma
  const formatarTurma = (turma) => {
    return turma.toLowerCase();
  };

  // Função para formatar o turno
  const formatarTurno = (turma) => {
    return turma.includes('N') ? 'noturno' : 'diurno';
  };

  // Função para aplicar filtro de semestre
  const aplicarFiltroSemestre = () => {
    let resultados = disciplinas;
    
    if (filterOption === 'impar') {
      resultados = disciplinas.filter(disciplina => {
        const semestre = parseInt(disciplina.turma.split(' ')[0]);
        return semestre % 2 !== 0;
      });
    } else if (filterOption === 'par') {
      resultados = disciplinas.filter(disciplina => {
        const semestre = parseInt(disciplina.turma.split(' ')[0]);
        return semestre % 2 === 0;
      });
    }
    
    setFilteredDisciplinas(resultados);
    setCurrentPage(1);
    setShowFilterPopup(false);
  };

  // Busca disciplinas
  useEffect(() => {
    const fetchDisciplinas = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/admin/disciplinas');
        
        const dadosFormatados = response.data.map(item => ({
          id: item.id,
          codigo: item.cod,
          nome: item.disciplina,
          turma: formatarTurma(item.turma),
          tipo: formatarTipo(item.tipo),
          turno: formatarTurno(item.turma)
        }));

        setDisciplinas(dadosFormatados);
        setFilteredDisciplinas(dadosFormatados);
      } catch (error) {
        console.error("Erro ao carregar disciplinas:", error);
        alert('Erro ao carregar disciplinas. Tente recarregar a página.');
      } finally {
        setLoading(false);
      }
    };

    fetchDisciplinas();
  }, []);

  // Filtro de busca
  useEffect(() => {
    const results = disciplinas.filter(disciplina =>
      disciplina.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disciplina.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDisciplinas(results);
    setCurrentPage(1);
    setSelectAll(false);
  }, [searchTerm, disciplinas]);

  // Manipulador do checkbox individual
  const handleCheckboxChange = (id) => {
    setSelectedDisciplinas(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Função para selecionar/deselecionar TODAS as disciplinas (não apenas da página atual)
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedDisciplinas([]);
    } else {
      const allIds = filteredDisciplinas.map(disciplina => disciplina.id);
      setSelectedDisciplinas(allIds);
    }
    setSelectAll(!selectAll);
  };

  // Atualiza o estado selectAll quando selectedDisciplinas muda
  useEffect(() => {
    if (filteredDisciplinas.length > 0) {
      const allSelected = filteredDisciplinas.every(disciplina => 
        selectedDisciplinas.includes(disciplina.id)
      );
      setSelectAll(allSelected);
    } else {
      setSelectAll(false);
    }
  }, [selectedDisciplinas, filteredDisciplinas]);

  // Função para confirmar seleção - Versão simplificada com alert
  const handleConfirmSelection = async () => {
    try {
      if (selectedDisciplinas.length === 0) {
        alert('Selecione pelo menos uma disciplina');
        return;
      }

      setSaving(true);

      console.log('Enviando disciplinas:', selectedDisciplinas); // Debug
      
      const response = await axios.post(
        'http://localhost:5000/api/admin/disciplinas/selecionar',
        { disciplinasIds: selectedDisciplinas },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Resposta do servidor:', response.data); // Debug
      
      if (response.data.success) {
        alert(`${selectedDisciplinas.length} disciplina(s) vinculada(s) ao período ${response.data.periodoUtilizado}`);
        setSelectedDisciplinas([]);
        setSelectAll(false);
        
        // Verificação imediata no banco (para debug)
        const verifica = await axios.get(`http://localhost:5000/api/admin/disciplinas/ativas?periodo=${response.data.periodoUtilizado}`);
        console.log('Disciplinas ativas no período:', verifica.data);
      } else {
        throw new Error(response.data.error || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('Erro completo:', error); // Debug
      let errorMsg = 'Erro ao salvar disciplinas';
      
      if (error.response) {
        errorMsg = error.response.data?.error || 
                  error.response.data?.message || 
                  JSON.stringify(error.response.data);
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      alert(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando disciplinas...</p>
      </div>
    );
  }

  return (
    <div className="disciplinas-container">
      <div className="disciplinas-content">
        <div className="disciplinas-header">
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
          <div className="filter-button" onClick={() => setShowFilterPopup(true)}>
            <img className="filter-icon" src="filter0.svg" alt="Filtrar" />
          </div>
        </div>
        
        {/* Popup de Filtro */}
        {showFilterPopup && (
          <div className="popup-overlay">
            <div className="popup-periodo-container">
              <div className="popup-periodo-header">
                <img className="lapisBRANCO" src="BRANCOpencil0.svg" alt="Ícone filtrar"/>
                <div className="popup-periodo-title">Filtrar Disciplinas</div>
              </div>
              <div className="popup-bodyE">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  aplicarFiltroSemestre();
                }}>
                  <div className="form-group">
                    <div className="filter-options">
                      <label className="filter-option">
                        <input
                          type="radio"
                          name="filterOption"
                          value="todos"
                          checked={filterOption === 'todos'}
                          onChange={() => setFilterOption('todos')}
                        />
                        Todos os semestres
                      </label>
                      <label className="filter-option">
                        <input
                          type="radio"
                          name="filterOption"
                          value="impar"
                          checked={filterOption === 'impar'}
                          onChange={() => setFilterOption('impar')}
                        />
                        Semestres ímpares (1º, 3º, ...)
                      </label>
                      <label className="filter-option">
                        <input
                          type="radio"
                          name="filterOption"
                          value="par"
                          checked={filterOption === 'par'}
                          onChange={() => setFilterOption('par')}
                        />
                        Semestres pares (2º, 4º, ...)
                      </label>
                    </div>
                  </div>
                  <div className="popup-disciplina-actions">
                    <button 
                      type="button"
                      className="popup-cancel-button"
                      onClick={() => setShowFilterPopup(false)}
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
                      <div className="popup-button-text">Aplicar Filtro</div>
                      <img className="popup-check-icon" src="check0.svg" alt="Confirmar"/>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        
        <div className="disciplinas-list-container">
          <div className="disciplinas-table">
            <div className="disciplinas-table-header">
              <div className="header-codigo">Código</div>
              <div className="header-nome">Disciplina</div>
              <div className="header-turma">Turma</div>
              <div className="header-tipo">
                <div className="tipo-text">Tipo</div>
              </div>
              <div className="header-turno">Turno</div>
              <div className="header-checkbox">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                  disabled={saving || currentItems.length === 0}
                  className="select-all-checkbox"
                />
              </div>
            </div>
            
            {currentItems.length > 0 ? (
              currentItems.map((disciplina, index) => (
                <div className="disciplina-row" key={`${disciplina.id}-${index}`}>
                  <div className="row-codigo">{disciplina.codigo}</div>
                  <div className="row-nome">{disciplina.nome}</div>
                  <div className="row-turma">{disciplina.turma}</div>
                  <div className="row-tipo">
                    <div className="tipo-text">{disciplina.tipo}</div>
                  </div>
                  <div className="row-turno">{disciplina.turno}</div>
                  <div className="row-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedDisciplinas.includes(disciplina.id)}
                      onChange={() => handleCheckboxChange(disciplina.id)}
                      disabled={saving}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                Nenhuma disciplina encontrada para "{searchTerm}"
              </div>
            )}
          </div>
          
          <div className="pagination-container">
            <button 
              className="pagination-button" 
              disabled={currentPage === 1 || saving}
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
                  disabled={saving}
                >
                  {number + 1}
                </button>
              ))}
            </div>
            
            <button 
              className="pagination-button" 
              disabled={currentPage === totalPages || saving}
              onClick={() => paginate(currentPage + 1)}
            >
              <div className="pagination-text">Próxima</div>
              <img className="chevron-right" src="chevron-right0.svg" alt="Próxima" />
            </button>
          </div>

          <div className="confirmar-selecao-container">
            <button 
              className="confirmar-selecao-btn"
              onClick={handleConfirmSelection}
              disabled={selectedDisciplinas.length === 0 || saving}
            >
              {'Confirmar Seleção'}
              <img className="confirm-icon" src="check0.svg" alt="Confirmar" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disciplinas;