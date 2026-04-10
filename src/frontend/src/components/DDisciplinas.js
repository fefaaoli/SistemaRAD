import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import './Disciplinas.css';
import './DDisciplinas.css';
import axios from 'axios';

const DDisciplina = () => {
  // Estados originais
  const [disciplinas, setDisciplinas] = useState([]);
  const [filteredDisciplinas, setFilteredDisciplinas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [selectedDisciplinas, setSelectedDisciplinas] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [disciplinaEditando, setDisciplinaEditando] = useState(null);
  const [currentDisciplinaIndex, setCurrentDisciplinaIndex] = useState(0);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const itemsPerPage = 20;

  // NOVOS Estados para Filtro e Ordenação
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ semestre: 'todos', apenasOptativas: false });
  const [tempFilters, setTempFilters] = useState({ semestre: 'todos', apenasOptativas: false });
  const [sortConfig, setSortConfig] = useState({ key: 'nome', direction: 'asc' });

  // Funções de formatação blindadas
  const formatarTipo = (tipo) => {
    if (!tipo) return 'indefinido';
    const tipos = { 'optativa_eletiva': 'op. eletiva', 'optativa_livre': 'op. livre', 'obrigatoria': 'obrigatória' };
    return (tipos[tipo] || tipo).toLowerCase();
  };
  
  const formatarTurma = (turma) => turma ? String(turma).toLowerCase() : 'indefinido';
  
  // CORRIGIDO: Agora lê corretamente o turno em vez de deduzir pelo "N" ou "D" da turma
  const formatarTurno = (turno) => {
    if (!turno) return 'indefinido';
    const map = { 'Diurno': 'diurno', 'Noturno': 'noturno', 'Indefinido': 'indefinido' };
    return map[turno] || String(turno).toLowerCase();
  };

  // Busca disciplinas
  useEffect(() => {
    const fetchDisciplinasAtivas = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/disciplinas/ativas`);
        const dadosFormatados = response.data.map(item => ({
          id: item.id,
          aid: item.id,
          codigo: item.cod || '',
          nome: item.nome || item.disciplina || '',
          turma: formatarTurma(item.turma),
          tipo: formatarTipo(item.tipo),
          turno: formatarTurno(item.turno), // ALTERADO AQUI
          selected: false
        }));
        setDisciplinas(dadosFormatados);
        setFilteredDisciplinas(dadosFormatados);
      } catch (error) {
        toast.error('Erro ao carregar disciplinas');
      } finally {
        setLoading(false);
      }
    };
    fetchDisciplinasAtivas();
  }, []);

  // Função auxiliar para normalizar texto
  const normalizeText = (text) => {
    return text ? String(text).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ç/g, "c").toLowerCase().trim() : '';
  };

  // NOVO: Lógica unificada de Filtros, Busca e Ordenação Segura
  useEffect(() => {
    let results = [...disciplinas];

    // 1. Filtro de Tipo (Apenas Optativas)
    if (activeFilters.apenasOptativas) {
      results = results.filter(d => d.tipo === 'op. eletiva' || d.tipo === 'op. livre');
    }

    // 2. Filtro de Semestre
    if (activeFilters.semestre !== 'todos') {
      results = results.filter(d => {
        const semestre = parseInt(String(d.turma).split(' ')[0]);
        if (isNaN(semestre)) return false; 
        
        if (activeFilters.semestre === 'impar') return semestre % 2 !== 0;
        if (activeFilters.semestre === 'par') return semestre % 2 === 0;
        return true;
      });
    }

    // 3. Filtro de Busca por Texto
    if (searchTerm) {
      const term = normalizeText(searchTerm);
      results = results.filter(d => {
        const nome = normalizeText(d.nome);
        const codigo = normalizeText(d.codigo);
        return nome.includes(term) || codigo.includes(term);
      });
    }

    // 4. Ordenação Blindada
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

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDisciplinas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDisciplinas.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Seleção/deseleção
  const handleSelectDisciplina = (disciplinaId) => {
    setDisciplinas(prev => prev.map(d => d.id === disciplinaId ? { ...d, selected: !d.selected } : d));
    // A lista filtrada se atualizará automaticamente pelo useEffect devido à alteração no 'disciplinas'
    setSelectedDisciplinas(prev => prev.includes(disciplinaId) ? prev.filter(id => id !== disciplinaId) : [...prev, disciplinaId]);
  };

  // Confirmação de seleção → abre modal
  const handleConfirmarSelecao = async () => {
    if (selectedDisciplinas.length === 0) {
      toast.warning('Nenhuma disciplina selecionada');
      return;
    }
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const docenteId = usuario?.id;
    if (!docenteId) return toast.error('ID do docente não encontrado');

    const primeiraDisciplina = disciplinas.find(d => d.id === selectedDisciplinas[0]);
    setDisciplinaEditando({ ...primeiraDisciplina, did: docenteId });
    setCurrentDisciplinaIndex(0);
    setIsAnimatingOut(false);
    setShowEditModal(true);
  };

  // Salvar disciplina com comentários/metadados
  const handleSalvarEdicao = async () => {
    if (!disciplinaEditando) return;

    try {
      setLoading(true);

      // Envia inscrição
      await axios.post(`${process.env.REACT_APP_API_URL}/api/inscricao/add`, {
        aid: disciplinaEditando.aid,
        did: disciplinaEditando.did
      });

      // Envia comentários/metadados
      await axios.post(`${process.env.REACT_APP_API_URL}/api/inscricao/comentario`, {
        aid: disciplinaEditando.aid,
        did: disciplinaEditando.did,
        comentario: disciplinaEditando.comentario || '',
        idioma_en: disciplinaEditando.idioma_en || false,
        apoio_leia: disciplinaEditando.apoio_leia || false,
        max_alunos: disciplinaEditando.max_alunos || null
      });

      const proximoIndex = currentDisciplinaIndex + 1;
      if (proximoIndex < selectedDisciplinas.length) {
        // Inicia animação de saída
        setIsAnimatingOut(true);
        
        // Espera a animação terminar (500ms)
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Troca para a próxima disciplina
        const proximaDisciplina = disciplinas.find(d => d.id === selectedDisciplinas[proximoIndex]);
        setDisciplinaEditando({ ...proximaDisciplina, did: disciplinaEditando.did });
        setCurrentDisciplinaIndex(proximoIndex);
        
        // Reinicia a animação para entrada
        setIsAnimatingOut(false);
      } else {
        // Última disciplina - fecha o modal após animação
        setIsAnimatingOut(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        toast.success('Todas as disciplinas selecionadas e comentários salvos!');
        setShowEditModal(false);
        setIsAnimatingOut(false);
        setSelectedDisciplinas([]);
        setDisciplinas(prev => prev.map(d => ({ ...d, selected: false })));
      }
    } catch (error) {
      toast.error('Disciplina já selecionada!');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fechar modal com animação
  const handleFecharModal = async () => {
    setIsAnimatingOut(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setShowEditModal(false);
    setIsAnimatingOut(false);
  };

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

  // Render modal de edição
  const renderEditModal = () => {
    if (!showEditModal && !isAnimatingOut) return null;

    // Formatar o turno para o título
    const turnoFormatado = disciplinaEditando?.turno || formatarTurno(disciplinaEditando?.turma || '');
    const tituloModal = disciplinaEditando 
      ? `${disciplinaEditando.nome} (${turnoFormatado})`
      : '';

    return (
      <div className={`edit-modal-overlay-frame ${isAnimatingOut ? 'fade-out' : ''}`}>
        <div className={`edit-modal-frame ${isAnimatingOut ? 'fade-out' : ''}`}>
          <div className="modal-header-frame">
            {/* Título modificado aqui */}
            <div className="modal-title-frame">{tituloModal}</div>
          </div>
          <div className="modal-body-frame">
            <form onSubmit={(e) => { e.preventDefault(); handleSalvarEdicao(); }}>
              <div className="form-group-frame">
                <label>Oferecimento em Inglês</label>
                <select value={disciplinaEditando.idioma_en ? 'Sim' : 'Não'} onChange={(e) => setDisciplinaEditando({ ...disciplinaEditando, idioma_en: e.target.value === 'Sim' })}>
                  <option>Sim</option>
                  <option>Não</option>
                </select>
              </div>
              <div className="form-group-frame">
                <label>Necessita do LEIA</label>
                <select value={disciplinaEditando.apoio_leia ? 'Sim' : 'Não'} onChange={(e) => setDisciplinaEditando({ ...disciplinaEditando, apoio_leia: e.target.value === 'Sim' })}>
                  <option>Sim</option>
                  <option>Não</option>
                </select>
              </div>
              <div className="form-group-frame">
                <label>Limitar Número de Alunos</label>
                <input type="number" min="30" value={disciplinaEditando.max_alunos || ''} onChange={(e) => setDisciplinaEditando({ ...disciplinaEditando, max_alunos: parseInt(e.target.value) || null })}/>
              </div>
              <div className="form-group-frame">
                <label>Comentário</label>
                <input type="text" value={disciplinaEditando.comentario || ''} onChange={(e) => setDisciplinaEditando({ ...disciplinaEditando, comentario: e.target.value })}/>
              </div>
              <div className="popup-disciplina-actions">
                  <button 
                    type="button"
                    className="popup-cancel-button"
                    onClick={handleFecharModal}
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
    );
  };

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

  return (
    <div className="disciplinas-container">
      {notification && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-message">{notification.message}</div>
          {notification.details && <div className="notification-details">{notification.details}</div>}
          <button className="notification-close" onClick={() => setNotification(null)}>×</button>
        </div>
      )}

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
          {/* BOTÃO DE FILTRO */}
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
            <div className="disciplinas-table-header">
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
              <div className="header-checkbox"></div>
            </div>
            
            {currentItems.length > 0 ? (
              currentItems.map((disciplina) => (
                <div className="disciplina-row" key={disciplina.id}>
                  <div className="row-codigo">{disciplina.codigo}</div>
                  <div className="row-nome">{disciplina.nome}</div>
                  <div className="row-turma">{disciplina.turma}</div>
                  <div className="row-tipo">{disciplina.tipo}</div>
                  <div className="row-turno">{disciplina.turno}</div>
                  <div className="row-checkbox">
                    <input 
                      type="checkbox" 
                      checked={disciplina.selected}
                      onChange={() => handleSelectDisciplina(disciplina.id)}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                {searchTerm 
                  ? `Nenhuma disciplina encontrada para "${searchTerm}"`
                  : 'Nenhuma disciplina ativa no período atual'}
              </div>
            )}
          </div>
          
          {/* Paginação */}
          <div className="pagination-container">
            <button
              className="pagination-button"
              disabled={currentPage === 1 || filteredDisciplinas.length === 0}
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
                  disabled={filteredDisciplinas.length === 0}
                >
                  {number + 1}
                </button>
              ))}
            </div>

            <button
              className="pagination-button"
              disabled={currentPage === totalPages || filteredDisciplinas.length === 0}
              onClick={() => paginate(currentPage + 1)}
            >
              <div className="pagination-text">Próxima</div>
              <img className="chevron-right" src="chevron-right0.svg" alt="Próxima" />
            </button>
          </div>
          
          {/* Botão Confirmar Seleção */}
          <div className="confirmar-selecao-container">
            <button
              className="confirmar-selecao-btn"
              disabled={filteredDisciplinas.length === 0 || selectedDisciplinas.length === 0}
              onClick={handleConfirmarSelecao}
            >
              {'Confirmar Seleção'}
              <img className="confirm-icon" src="check0.svg" alt="Confirmar" />
            </button>
          </div>
        </div>
      </div>

      {renderEditModal()}
    </div>
  );
};

export default DDisciplina;