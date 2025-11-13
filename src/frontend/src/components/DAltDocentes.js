import React, { useState, useEffect } from 'react'; 
import './DAltDocentes.css';

const DAltDocentes = ({ periodo }) => {
  // Estados
  const [docentes, setDocentes] = useState([]);
  const [filteredDocentes, setFilteredDocentes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [docenteSelecionado, setDocenteSelecionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  // Buscar docentes da API
  useEffect(() => {
      const fetchDocentes = async () => {
        if (!periodo) return; // <-- Adicionado: Não faz nada se o período ainda não foi carregado

        setLoading(true); // <-- Adicionado: Mostra o loading ao trocar de período
        try {
          const token = localStorage.getItem('token');
          
          // Adicionamos o período como um "query parameter" na URL
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/docentes?periodo=${periodo}`, { // <-- MUDANÇA AQUI
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (!response.ok) {
            throw new Error('Erro ao carregar docentes');
          }
          const data = await response.json();
          setDocentes(data.docentes);
          setFilteredDocentes(data.docentes);
          
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false); // <-- Movido para o 'finally' para garantir que sempre pare o loading
        }
      };

      fetchDocentes();
    }, [periodo]); // <-- MUDANÇA AQUI: O useEffect agora depende do 'periodo'

  // Buscar detalhes do docente
  const fetchDocenteDetalhes = async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/docentes/${id}/detalhes?periodo=${periodo}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Erro ao carregar detalhes do docente');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Erro:', err);
      return null;
    }
  };

  // Filtro de busca
  useEffect(() => {
    const results = docentes.filter(docente =>
      docente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      docente.id.toString().includes(searchTerm)
    );
    setFilteredDocentes(results);
    setCurrentPage(1);
  }, [searchTerm, docentes]);

  // Handlers
  const handleNomeClick = async (docente) => {
    setLoading(true);
    try {
      const detalhes = await fetchDocenteDetalhes(docente.id);
      
      if (detalhes) {
        // Processa as disciplinas para formatar os campos booleanos e comentários
        const disciplinasFormatadas = detalhes.disciplinas.map(disciplina => ({
          ...disciplina,
          leciona_ingles: disciplina.leciona_ingles ? 'Sim' : 'Não',
          apoio_leia: disciplina.apoio_leia ? 'Sim' : 'Não',
          max_alunos: disciplina.max_alunos || 'Sem limite',
          comentario: disciplina.comentario || 'Nenhum comentário'
        }));

        // Extrai o primeiro comentário não vazio das disciplinas (se existir)
        const primeiroComentario = detalhes.disciplinas.find(d => d.comentario && d.comentario.trim() !== '')?.comentario;

        setDocenteSelecionado({
          ...docente,
          disciplinas: disciplinasFormatadas,
          restricoes: detalhes.restricoes_horario,
          comentarios: primeiroComentario || 'Nenhum comentário fornecido'
        });
        
        setShowDetailPopup(true);
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes do docente:', error);
      // Você pode adicionar um estado de erro aqui se quiser mostrar para o usuário
    } finally {
      setLoading(false);
    }
  };

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDocentes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDocentes.length / itemsPerPage);

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

  if (error) return <div className="d-alt-docentes-error">Erro: {error}</div>;

  return (
    <div className="d-alt-docentes-container">
      <div className="d-alt-docentes-content">
        <div className="d-alt-docentes-header">
          <div className="d-alt-docentes-search-container">
            <div className="d-alt-docentes-search-input">
              <input
                type="text"
                placeholder="Buscar Docente por Número USP ou Nome"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <img className="d-alt-docentes-search-icon" src="search0.svg" alt="Buscar" />
            </div>
          </div>
          <div className="d-alt-docentes-filter-button">
            <img className="d-alt-docentes-filter-icon" src="filter0.svg" alt="Filtrar" />
          </div>
        </div>
        
        <div className="d-alt-docentes-list-container">
          <div className="d-alt-docentes-table">
            <div className="d-alt-docentes-table-header">
              <div className="d-alt-docentes-header-numero">Número USP</div>
              <div className="d-alt-docentes-header-nome">Nome</div>
              <div className="d-alt-docentes-header-departamento">Departamento</div>
              <div className="d-alt-docentes-header-disciplinas">Nro de Disciplinas</div>
              <div className="d-alt-docentes-header-restricoes">% Restrições</div>
            </div>
            
            {currentItems.map((docente, index) => (
              <div className="d-alt-docentes-table-row" key={index}>
                <div className="d-alt-docentes-cell-numero">{docente.id}</div>
                <div 
                  className="d-alt-docentes-cell-nome"
                  onClick={() => handleNomeClick(docente)}
                  style={{cursor: 'pointer'}}
                >
                  {docente.nome}
                </div>
                <div className="d-alt-docentes-cell-departamento">{docente.setor}</div>
                <div className="d-alt-docentes-cell-disciplinas">{docente.total_disciplinas}</div>
                <div className="d-alt-docentes-cell-restricoes">{docente.percentual_restricao}%</div>
              </div>
            ))}
          </div>
          
          <div className="d-alt-docentes-pagination-container">
            <button 
              className="d-alt-docentes-pagination-button" 
              disabled={currentPage === 1}
              onClick={() => paginate(currentPage - 1)}
            >
              <img className="d-alt-docentes-chevron-left" src="chevron-left0.svg" alt="Anterior" />
              <div className="d-alt-docentes-pagination-text">Anterior</div>
            </button>
            
            <div className="d-alt-docentes-pagination-numbers">
              {[...Array(totalPages).keys()].map(number => (
                <button
                  key={number}
                  className={`d-alt-docentes-page-number ${currentPage === number + 1 ? 'active' : ''}`}
                  onClick={() => paginate(number + 1)}
                >
                  {number + 1}
                </button>
              ))}
            </div>
            
            <button 
              className="d-alt-docentes-pagination-button" 
              disabled={currentPage === totalPages}
              onClick={() => paginate(currentPage + 1)}
            >
              <div className="d-alt-docentes-pagination-text">Próxima</div>
              <img className="d-alt-docentes-chevron-right" src="chevron-right0.svg" alt="Próxima" />
            </button>
          </div>
        </div>
      </div>

      {/* Popup de Detalhes */}
      {showDetailPopup && docenteSelecionado && (
        <div className="d-alt-docentes-popup-overlay">
          <div className="d-alt-docentes-popup-container">
            <div className="d-alt-docentes-popup-header">
                <h2 className="d-alt-docentes-popup-title">Detalhes do Docente</h2>
                <button 
                className="d-alt-docentes-popup-close"
                onClick={() => setShowDetailPopup(false)}
                >
                </button>
            </div>
      
            <div className="d-alt-docentes-popup-body">
              <div className="d-alt-docentes-popup-section">
                <h3>Disciplinas Selecionadas</h3>
                <div className="d-alt-docentes-popup-content">
                  {docenteSelecionado.disciplinas && docenteSelecionado.disciplinas.length > 0 ? (
                    docenteSelecionado.disciplinas.map((disciplina, idx) => (
                      <div key={idx} className="d-alt-docentes-popup-item">
                        <div className="d-alt-docentes-popup-item">
                          <strong>{disciplina.codigo} - {disciplina.nome}</strong> (Turma: {disciplina.turma})
                        </div>
                        <div className="d-alt-docentes-popup-items">
                          <div>
                            <span>Leciona em inglês: </span>
                            <span className={disciplina.leciona_ingles === 'Sim' ? 'd-alt-docentes-popup-item' : 'd-alt-docentes-popup-item'}>
                              {disciplina.leciona_ingles}
                            </span>
                          </div>
                          <div>
                            <span>Precisa de apoio LEIA: </span>
                            <span className={disciplina.apoio_leia === 'Sim' ? 'd-alt-docentes-popup-item' : 'd-alt-docentes-popup-item'}>
                              {disciplina.apoio_leia}
                            </span>
                          </div>
                          <div>
                            <span>Máximo de alunos: </span>
                            <span>{disciplina.max_alunos}</span>
                          </div>
                          <div>
                            <span>Comentário: </span>
                            <span>{disciplina.comentario}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="d-alt-docentes-popup-item">
                      Nenhuma disciplina cadastrada
                        </div>
                      )}
                  </div>
              </div>
          
              <div className="d-alt-docentes-popup-section">
                <h3>Restrições de Horário</h3>
                <div className="d-alt-docentes-popup-content">
                  {docenteSelecionado.restricoes && docenteSelecionado.restricoes.length > 0 ? (
                    docenteSelecionado.restricoes.map((restricao, idx) => (
                      <div key={idx} className="d-alt-docentes-popup-item">
                        {restricao.dia}: {restricao.horario}
                      </div>
                    ))
                  ) : (
                    <div className="d-alt-docentes-popup-item">
                      Nenhuma restrição cadastrada
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="d-alt-docentes-popup-footer">
                <button 
                className="d-alt-docentes-popup-close-button"
                onClick={() => setShowDetailPopup(false)}
                >
                    <span className="popup-button-label">Fechar</span>
                    <img className="popup-x-icon" src="x0.svg" alt="Cancelar"/>
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DAltDocentes;