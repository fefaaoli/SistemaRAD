import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import './DisciplinasEditar.css';
import axios from 'axios';

const DisciplinasEditar = () => {
  // Estados originais
  const [disciplinas, setDisciplinas] = useState([]);
  const [filteredDisciplinas, setFilteredDisciplinas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [disciplinaEditando, setDisciplinaEditando] = useState(null);
  const [disciplinaDeletando, setDisciplinaDeletando] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  // NOVOS Estados para Filtro e Ordenação
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ semestre: 'todos', apenasOptativas: false });
  const [tempFilters, setTempFilters] = useState({ semestre: 'todos', apenasOptativas: false });
  const [sortConfig, setSortConfig] = useState({ key: 'nome', direction: 'asc' });

  // Funções de formatação blindadas
  const formatarTipo = (tipo) => {
    if (!tipo) return 'indefinido';
    const tipos = {
      'optativa_eletiva': 'op. eletiva',
      'optativa_livre': 'op. livre',
      'obrigatoria': 'obrigatória'
    };
    return (tipos[tipo] || tipo).toLowerCase();
  };

  const formatarTurma = (turma) => {
    return turma ? String(turma).toLowerCase() : 'indefinido';
  };

  // CORRIGIDO: Agora lê corretamente o turno em vez de deduzir pelo "N" da turma
  const formatarTurno = (turno) => {
    if (!turno) return 'indefinido';
    const map = {
      'Diurno': 'diurno',
      'Noturno': 'noturno',
      'Indefinido': 'indefinido'
    };
    return map[turno] || String(turno).toLowerCase();
  };

  // Carrega disciplinas da API
  useEffect(() => {
    const carregarDisciplinas = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/disciplinas`);
        
        const dadosFormatados = response.data.map(item => ({
          id: item.id,
          codigo: item.cod || '',
          nome: item.disciplina || '',
          turma: formatarTurma(item.turma),
          tipo: formatarTipo(item.tipo),
          turno: formatarTurno(item.turno), // ALTERADO AQUI
          cred: item.cred
        }));
        
        setDisciplinas(dadosFormatados);
        setFilteredDisciplinas(dadosFormatados);
      } catch (err) {
        setError(err.message);
        console.error("Erro ao carregar disciplinas:", err);
      } finally {
        setLoading(false);
      }
    };

    carregarDisciplinas();
  }, []);

  // Converte o tipo para o formato da API
  const parseTipo = (tipo) => {
    switch(tipo) {
      case 'Optativa Eletiva': return 'optativa_eletiva';
      case 'Optativa Livre': return 'optativa_livre';
      case 'Obrigatória': return 'obrigatoria';
      default: return tipo;
    }
  };

  // Função auxiliar para normalizar texto
  const normalizeText = (text) => {
    return text ? String(text)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ç/g, "c")
      .toLowerCase()
      .trim() : '';
  };

  // NOVO: Lógica unificada de Filtros, Busca e Ordenação
  useEffect(() => {
    let results = [...disciplinas];

    // 1. Filtro de Tipo (Apenas Optativas)
    if (activeFilters.apenasOptativas) {
      results = results.filter(disciplina => 
        disciplina.tipo === 'op. eletiva' || disciplina.tipo === 'op. livre'
      );
    }

    // 2. Filtro de Semestre
    if (activeFilters.semestre !== 'todos') {
      results = results.filter(disciplina => {
        const semestre = parseInt(String(disciplina.turma).split(' ')[0]);
        if (isNaN(semestre)) return false; 
        
        if (activeFilters.semestre === 'impar') return semestre % 2 !== 0;
        if (activeFilters.semestre === 'par') return semestre % 2 === 0;
        return true;
      });
    }

    // 3. Filtro de Busca por Texto
    if (searchTerm) {
      const term = normalizeText(searchTerm);
      results = results.filter(disciplina => {
        const nome = normalizeText(disciplina.nome);
        const codigo = normalizeText(disciplina.codigo);
        return nome.includes(term) || codigo.includes(term);
      });
    }

    // 4. Ordenação
    results.sort((a, b) => {
      if (sortConfig.key === 'turma') {
        let numA = parseInt(String(a.turma).split(' ')[0]);
        let numB = parseInt(String(b.turma).split(' ')[0]);
        
        if (isNaN(numA)) numA = 999;
        if (isNaN(numB)) numB = 999;
        
        if (numA < numB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (numA > numB) return sortConfig.direction === 'asc' ? 1 : -1;
        
        const nomeA = a.nome ? String(a.nome).trim() : '';
        const nomeB = b.nome ? String(b.nome).trim() : '';
        return nomeA.localeCompare(nomeB, 'pt-BR');
      } else {
        const nomeA = a.nome ? String(a.nome).trim() : '';
        const nomeB = b.nome ? String(b.nome).trim() : '';
        
        return sortConfig.direction === 'asc' 
          ? nomeA.localeCompare(nomeB, 'pt-BR') 
          : nomeB.localeCompare(nomeA, 'pt-BR');
      }
    });

    setFilteredDisciplinas(results);
    setCurrentPage(1);
  }, [searchTerm, activeFilters, disciplinas, sortConfig]);

  // Funções dos Novos Controles
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const abrirPopupFiltro = () => {
    setTempFilters(activeFilters);
    setShowFilterPopup(true);
  };

  const aplicarFiltros = () => {
    setActiveFilters(tempFilters);
    setShowFilterPopup(false);
  };

  // Handlers Originais mantidos intactos
  const handleEditarClick = (disciplina) => {
    setDisciplinaEditando(disciplina);
    setShowEditPopup(true);
  };

  const handleDeletarClick = (disciplina) => {
    setDisciplinaDeletando(disciplina);
    setShowDeletePopup(true);
  };

  const handleConfirmarDelecao = async () => {
    try {
      setLoading(true);
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/disciplinas/${disciplinaDeletando.id}`);
      
      setDisciplinas(prev => prev.filter(d => d.id !== disciplinaDeletando.id));
      setFilteredDisciplinas(prev => prev.filter(d => d.id !== disciplinaDeletando.id));
      
      setShowDeletePopup(false);
      toast.success('Disciplina removida com sucesso!');
    } catch (err) {
      console.error('Erro ao remover disciplina:', err);
      toast.error(`Erro ao remover: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSalvarEdicao = async (dadosAtualizados) => {
    try {
      setLoading(true);
      
      const dadosAPI = {
        cod: dadosAtualizados.codigo,
        disciplina: dadosAtualizados.nome,
        turma: dadosAtualizados.turma,
        tipo: parseTipo(dadosAtualizados.tipo),
        cred: dadosAtualizados.cred
      };

      await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/disciplinas/${dadosAtualizados.id}`, dadosAPI);
      
      setDisciplinas(prev => prev.map(d => 
        d.id === dadosAtualizados.id ? dadosAtualizados : d
      ));
      
      setShowEditPopup(false);
      toast.success('Disciplina atualizada com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar disciplina:', err);
      toast.error(`Erro ao atualizar: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDisciplinas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDisciplinas.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    const spinnerStyle = {
      border: '6px solid #f3f3f3',
      borderTop: '6px solid #49a0b6',
      borderRadius: '50%',
      width: '30px',
      height: '30px',
      animation: 'spin 1s linear infinite',
      margin: '50px auto'
    };

    const loadingContainerStyle = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px'
    };

    return (
      <div style={loadingContainerStyle}>
        <div style={spinnerStyle}></div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Erro ao carregar disciplinas: {error}</p>
        <button onClick={() => window.location.reload()}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="disciplinas-editar-container">
      <div className="disciplinas-editar-content">
        <div className="disciplinas-editar-header">
          <div className="search-container">
            <div className="search-input">
              <input
                type="text"
                placeholder="Busque por Código ou Disciplina"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <img className="search-icon" src="search0.svg" alt="Buscar" />
            </div>
          </div>
          {/* BOTÃO DE FILTRO AGORA É CLICÁVEL */}
          <div className="filter-button" onClick={abrirPopupFiltro}>
            <img className="filter-icon" src="filter0.svg" alt="Filtrar" />
          </div>
        </div>
        
        {/* NOVO POPUP DE FILTRO ADICIONADO AQUI */}
        {showFilterPopup && (
          <div className="popup-overlay">
            <div className="popup-periodo-container">
              <div className="popup-periodo-header">
                <img className="lapisBRANCO" src="BRANCOpencil0.svg" alt="Ícone filtrar"/>
                <div className="popup-periodo-title">Filtrar Disciplinas</div>
              </div>
              <div className="popup-bodyE">
                <form onSubmit={(e) => { e.preventDefault(); aplicarFiltros(); }}>
                  <div className="form-group">
                    <div className="filter-options">
                      <label className="filter-option">
                        <input type="radio" name="filterSemestre" value="todos"
                          checked={tempFilters.semestre === 'todos'}
                          onChange={() => setTempFilters({ ...tempFilters, semestre: 'todos' })} />
                        Todos os semestres
                      </label>
                      <label className="filter-option">
                        <input type="radio" name="filterSemestre" value="impar"
                          checked={tempFilters.semestre === 'impar'}
                          onChange={() => setTempFilters({ ...tempFilters, semestre: 'impar' })} />
                        Semestres ímpares (1º, 3º, ...)
                      </label>
                      <label className="filter-option">
                        <input type="radio" name="filterSemestre" value="par"
                          checked={tempFilters.semestre === 'par'}
                          onChange={() => setTempFilters({ ...tempFilters, semestre: 'par' })} />
                        Semestres pares (2º, 4º, ...)
                      </label>
                      <label className="filter-option">
                        <input 
                          type="radio"
                          checked={tempFilters.apenasOptativas}
                          onClick={() => setTempFilters({ ...tempFilters, apenasOptativas: !tempFilters.apenasOptativas })}
                          onChange={() => {}} 
                        />
                        Apenas optativas
                      </label>
                    </div>
                  </div>
                  <div className="popup-disciplina-actions">
                    <button type="button" className="popup-cancel-button"
                      onClick={() => setShowFilterPopup(false)} disabled={loading}>
                      <div className="popup-button-text">Cancelar</div>
                      <img className="popup-cancel-icon" src="x0.svg" alt="Cancelar"/>
                    </button>
                    <button type="submit" className="popup-confirm-button" disabled={loading}>
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
            <div className="table-header">
              <div className="header-codigo">Código</div>
              
              {/* CABEÇALHOS CLICÁVEIS DE ORDENAÇÃO */}
              <div 
                className="header-nome" 
                style={{ cursor: 'pointer', userSelect: 'none' }} 
                onClick={() => requestSort('nome')}
                title="Clique para ordenar por Ordem Alfabética"
              >
                Disciplina {sortConfig.key === 'nome' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </div>
              <div 
                className="header-turma" 
                style={{ cursor: 'pointer', userSelect: 'none' }} 
                onClick={() => requestSort('turma')}
                title="Clique para ordenar por Semestre"
              >
                Turma {sortConfig.key === 'turma' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </div>

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
                  <button 
                    className="schedule-action-btn"
                    onClick={() => handleDeletarClick(disciplina)}
                  >
                    ×
                  </button>
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
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => paginate(currentPage + 1)}
            >
              <div className="pagination-text">Próxima</div>
              <img className="chevron-right" src="chevron-right0.svg" alt="Próxima" />
            </button>
          </div>
        </div>
      </div>

      {/* Popup de Edição */}
      {showEditPopup && disciplinaEditando && (
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
                  <label>Código *</label>
                  <input
                    type="text"
                    value={disciplinaEditando.codigo}
                    onChange={(e) => setDisciplinaEditando({
                      ...disciplinaEditando,
                      codigo: e.target.value.slice(0, 10)
                    })}
                    required
                    maxLength={10}
                  />
                </div>
                <div className="form-group">
                  <label>Disciplina *</label>
                  <input
                    type="text"
                    value={disciplinaEditando.nome}
                    onChange={(e) => setDisciplinaEditando({
                      ...disciplinaEditando,
                      nome: e.target.value.slice(0, 60)
                    })}
                    required
                    maxLength={60}
                  />
                </div>
                <div className="form-group">
                  <label>Turma *</label>
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
                    <option>4º Semestre</option>
                    <option>5º Semestre</option>
                    <option>6º Semestre</option>
                    <option>7º Semestre</option>
                    <option>8º Semestre</option>
                    <option>9º Semestre</option>
                    <option>10º Semestre</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Tipo *</label>
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
                <div className="form-group">
                  <label>Turno*</label>
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
                <div className="form-group">
                  <label>Créditos *</label>
                  <input
                    type="number"
                    value={disciplinaEditando.cred ?? ''}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      if (value >= 0 && value <= 10) {
                        setDisciplinaEditando({ ...disciplinaEditando, cred: value });
                      }
                    }}
                    min={0}
                    max={10}
                    required
                  />
                </div>
                <div className="popup-disciplina-actions">
                  <button 
                    type="button"
                    className="popup-cancel-button"
                    onClick={() => setShowEditPopup(false)}
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
                      <div className="popup-button-text">Salvando...</div>
                    ) : (
                      <>
                        <div className="popup-button-text">Salvar</div>
                        <img className="popup-check-icon" src="check0.svg" alt="Confirmar"/>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Popup de Deleção */}
      {showDeletePopup && disciplinaDeletando && (
        <div className="edit-popup-overlay">
          <div className="edit-popup-container">
            <div className="popup-header">
              <img className="lapisBRANCO" src="BRANCOpencil0.svg" alt="Ícone deletar"/>
              <div className="popup-disciplina-title">Remover Disciplina</div>
            </div>
            <div className="popup-bodyE">
              <p className='popup-labelDD'>Tem certeza que deseja remover a disciplina <strong>{disciplinaDeletando.nome}</strong>?</p>
              <div className="popup-periodo-actions">
                <button 
                  className="popup-button-cancel"
                  onClick={() => setShowDeletePopup(false)}
                  disabled={loading}
                >
                  <div className="popup-button-label">Cancelar</div>
                  <img className="popup-x-icon" src="x0.svg" alt="Cancelar"/>
                </button>
                
                <button 
                  className="popup-button-confirm"
                  onClick={handleConfirmarDelecao}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="popup-button-label">Removendo...</div>
                  ) : (
                    <>
                      <div className="popup-button-label">Remover</div>
                      <img className="popup-check-icon" src="check0.svg" alt="Confirmar"/>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisciplinasEditar;