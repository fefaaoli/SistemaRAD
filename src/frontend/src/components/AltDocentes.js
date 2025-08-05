import React, { useState, useEffect } from 'react';
import './AltDocentes.css';
import { apiUsuarios } from '../services/apiUsuarios';

const AltDocentes = () => {
  const [docentes, setDocentes] = useState([]);
  const [filteredDocentes, setFilteredDocentes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [docenteEditando, setDocenteEditando] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 20;

  // Carrega docentes da API
  useEffect(() => {
    const carregarDocentes = async () => {
      try {
        const dados = await apiUsuarios.listarDocentes();
        setDocentes(dados);
        setFilteredDocentes(dados);
      } catch (err) {
        setError('Falha ao carregar docentes. Usando dados locais.');
        console.error(err);
        // Dados mockados de fallback
        const mockDocentes = [
          {
            numeroUSP: '1234567',
            nome: 'Carlos Silva',
            departamento: 'Departamento de Informática',
            funcao: 'Docente'
          },
          {
            numeroUSP: '7654321',
            nome: 'Ana Oliveira',
            departamento: 'Departamento de Matemática',
            funcao: 'Administrador'
          }
        ];
        setDocentes(mockDocentes);
        setFilteredDocentes(mockDocentes);
      } finally {
        setLoading(false);
      }
    };

    carregarDocentes();
  }, []);

  // Filtro de busca
  useEffect(() => {
    const results = docentes.filter(docente => {
      const searchLower = searchTerm.toLowerCase();
      return (
        docente.nome.toLowerCase().includes(searchLower) ||
        String(docente.numeroUSP).toLowerCase().includes(searchLower)
      );
    });
    setFilteredDocentes(results);
    setCurrentPage(1);
  }, [searchTerm, docentes]);

  // Handlers
  const handleEditarClick = (docente) => {
    setDocenteEditando(docente);
    setShowEditPopup(true);
  };

  const handleSalvarEdicao = async (dadosAtualizados) => {
    try {
      await apiUsuarios.atualizarDocente(dadosAtualizados.numeroUSP, dadosAtualizados);
      setDocentes(prev => prev.map(d => 
        d.numeroUSP === dadosAtualizados.numeroUSP ? dadosAtualizados : d
      ));
      setShowEditPopup(false);
    } catch (err) {
      setError('Falha ao atualizar docente. Tente novamente.');
      console.error(err);
    }
  };

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDocentes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDocentes.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="docentes-loading">Carregando...</div>;
  }

  return (
    <div className="docentes-alt-container">
      <div className="docentes-alt-content">
        {error && <div className="docentes-error-message">{error}</div>}
        
        <div className="docentes-alt-header">
          <div className="docentes-search-container">
            <div className="docentes-search-input">
              <input
                type="text"
                placeholder="Buscar Docente"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <img className="docentes-search-icon" src="search0.svg" alt="Buscar" />
            </div>
          </div>
          <div className="docentes-filter-button">
            <img className="docentes-filter-icon" src="filter0.svg" alt="Filtrar" />
          </div>
        </div>
        
        <div className="docentes-list-container">
          <div className="docentes-table">
            <div className="docentes-table-header">
              <div className="docentes-header-numero">Número USP</div>
              <div className="docentes-header-nome">Nome</div>
              <div className="docentes-header-departamento">Setor</div>
              <div className="docentes-header-funcao">Função</div>
              <div className="docentes-header-editar">Editar</div>
            </div>
            
            {currentItems.map((docente, index) => (
              <div className="docentes-table-row" key={index}>
                <div className="docentes-cell-numero">{docente.numeroUSP}</div>
                <div className="docentes-cell-nome">{docente.nome}</div>
                <div className="docentes-cell-departamento">{docente.departamento}</div>
                <div className="docentes-cell-funcao">{docente.funcao}</div>
                <div className="docentes-cell-editar">
                  <button 
                    className="docentes-edit-button"
                    onClick={() => handleEditarClick(docente)}
                  >
                    <img className="docentes-pencil-icon" src="pencil0.svg" alt="Editar" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="docentes-pagination-container">
            <button 
              className="docentes-pagination-button" 
              disabled={currentPage === 1}
              onClick={() => paginate(currentPage - 1)}
            >
              <img className="docentes-chevron-left" src="chevron-left0.svg" alt="Anterior" />
              <div className="docentes-pagination-text">Anterior</div>
            </button>
            
            <div className="docentes-pagination-numbers">
              {[...Array(totalPages).keys()].map(number => (
                <button
                  key={number}
                  className={`docentes-page-number ${currentPage === number + 1 ? 'active' : ''}`}
                  onClick={() => paginate(number + 1)}
                >
                  {number + 1}
                </button>
              ))}
            </div>
            
            <button 
              className="docentes-pagination-button" 
              disabled={currentPage === totalPages}
              onClick={() => paginate(currentPage + 1)}
            >
              <div className="docentes-pagination-text">Próxima</div>
              <img className="docentes-chevron-right" src="chevron-right0.svg" alt="Próxima" />
            </button>
          </div>
        </div>
      </div>

      {/* Popup de Edição */}
      {showEditPopup && (
        <div className="docentes-popup-overlay">
          <div className="docentes-popup-container">
            <div className="docentes-popup-header">
              <img className="docentes-lapisBRANCO" src="BRANCOpencil0.svg" alt="Ícone editar"/>
              <div className="docentes-popup-title">Editar Docente</div>
            </div>
            <div className="docentes-popup-body">
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSalvarEdicao(docenteEditando);
              }}>
                <div className="docentes-form-group">
                  <label>Número USP</label>
                  <input
                    type="text"
                    value={docenteEditando.numeroUSP}
                    readOnly
                  />
                </div>
                <div className="docentes-form-group">
                  <label>Nome</label>
                  <input
                    type="text"
                    value={docenteEditando.nome}
                    onChange={(e) => setDocenteEditando({
                      ...docenteEditando,
                      nome: e.target.value
                    })}
                    required
                  />
                </div>
                <div className="docentes-form-group">
                  <label>Departamento</label>
                  <input
                    type="text"
                    value={docenteEditando.departamento}
                    onChange={(e) => setDocenteEditando({
                      ...docenteEditando,
                      departamento: e.target.value
                    })}
                    required
                  />
                </div>
                <div className="docentes-form-group">
                  <label>Função</label>
                  <select
                    value={docenteEditando.funcao}
                    onChange={(e) => setDocenteEditando({
                      ...docenteEditando,
                      funcao: e.target.value
                    })}
                  >
                    <option value="Docente">Docente</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </div>
                <div className="popup-periodo-actionsD">
                  <button 
                    type="button"
                    className="popup-button-cancelD"
                    onClick={() => setShowEditPopup(false)}
                  >
                    <div className="popup-button-labelD">Cancelar</div>
                    <img className="docentes-popup-cancel-icon" src="x0.svg" alt="Cancelar"/>
                  </button>
                  
                  <button 
                    type="submit"
                    className="popup-button-confirmD"
                  >
                    <div className="popup-button-labelD">Salvar</div>
                    <img className="docentes-popup-confirm-icon" src="check0.svg" alt="Confirmar"/>
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

export default AltDocentes;