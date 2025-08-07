import React, { useState, useEffect } from 'react';
import './DisciplinasEditar.css';
import axios from 'axios';

const DisciplinasEditar = () => {
  // Estados
  const [disciplinas, setDisciplinas] = useState([]);
  const [filteredDisciplinas, setFilteredDisciplinas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [disciplinaEditando, setDisciplinaEditando] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 20;

  // Função para formatar o tipo da disciplina
  const formatarTipo = (tipo) => {
    const tipos = {
      'optativa_eletiva': 'op. eletiva',
      'optativa_livre': 'op. livre',
      'obrigatoria': 'obrigatória'
    };
    return (tipos[tipo] || tipo).toLowerCase();
  };

  // Função para formatar a turma
  const formatarTurma = (turma) => {
    return turma.toLowerCase();
  };

  // Função para formatar o turno
  const formatarTurno = (turma) => {
    return turma.includes('N') ? 'noturno' : 'diurno';
  };

  // Carrega disciplinas da API
  useEffect(() => {
    const carregarDisciplinas = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/disciplinas');
        
        const dadosFormatados = response.data.map(item => ({
          id: item.id,
          codigo: item.cod,
          nome: item.disciplina,
          turma: formatarTurma(item.turma),
          tipo: formatarTipo(item.tipo),
          turno: formatarTurno(item.turma),
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
    setShowEditPopup(true);
  };

  const handleSalvarEdicao = async (dadosAtualizados) => {
    try {
      setLoading(true);
      
      // Prepara os dados para a API
      const dadosAPI = {
        cod: dadosAtualizados.codigo,
        disciplina: dadosAtualizados.nome,
        turma: dadosAtualizados.turma,
        tipo: parseTipo(dadosAtualizados.tipo),
        cred: dadosAtualizados.cred
      };

      await axios.put(`http://localhost:5000/api/admin/disciplinas/${dadosAtualizados.id}`, dadosAPI);
      
      // Atualiza o estado local
      setDisciplinas(prev => prev.map(d => 
        d.id === dadosAtualizados.id ? dadosAtualizados : d
      ));
      
      setShowEditPopup(false);
      alert('Disciplina atualizada com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar disciplina:', err);
      alert(`Erro ao atualizar: ${err.response?.data?.error || err.message}`);
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

  if (loading && disciplinas.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando disciplinas...</p>
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
                <div className="form-group">
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
                <div className="form-group">
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
                <div className="form-group">
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
                <div className="form-group">
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
                <div className="form-group">
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
    </div>
  );
};

export default DisciplinasEditar;