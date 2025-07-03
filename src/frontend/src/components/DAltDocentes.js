import React, { useState, useEffect } from 'react';
import './DAltDocentes.css';

const DAltDocentes = () => {
  // Estados
  const [docentes, setDocentes] = useState([]);
  const [filteredDocentes, setFilteredDocentes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [docenteSelecionado, setDocenteSelecionado] = useState(null);
  const itemsPerPage = 10;

  // Dados mockados
  useEffect(() => {
    const mockDocentes = [
      {
        numeroUSP: '1234567',
        nome: 'Carlos Silva',
        nroDisciplinas: 3,
        percentualRestricoes: '75%',
        departamento: 'Departamento de Informática',
        disciplinas: [
          { codigo: 'MAC0101', nome: 'Introdução à Computação' },
          { codigo: 'MAC0323', nome: 'Estruturas de Dados' },
          { codigo: 'MAC0338', nome: 'Banco de Dados' }
        ],
        restricoes: [
          { dia: 'Segunda', horario: '14:00-16:00' },
          { dia: 'Quarta', horario: '08:00-10:00' }
        ],
        comentarios: 'Preferência por aulas no período da tarde, exceto às segundas-feiras.'
      },
      {
        numeroUSP: '7654321',
        nome: 'Ana Oliveira',
        nroDisciplinas: 2,
        percentualRestricoes: '50%',
        departamento: 'Departamento de Matemática',
        disciplinas: [
          { codigo: 'MAT0101', nome: 'Cálculo I' },
          { codigo: 'MAT0202', nome: 'Álgebra Linear' }
        ],
        restricoes: [
          { dia: 'Terça', horario: '10:00-12:00' }
        ],
        comentarios: 'Disponível apenas no período da manhã.'
      },
      {
        numeroUSP: '9876543',
        nome: 'Pedro Santos',
        nroDisciplinas: 4,
        percentualRestricoes: '25%',
        departamento: 'Departamento de Física',
        disciplinas: [
          { codigo: 'FIS0101', nome: 'Física I' },
          { codigo: 'FIS0102', nome: 'Física II' },
          { codigo: 'FIS0203', nome: 'Física III' },
          { codigo: 'FIS0304', nome: 'Física IV' }
        ],
        restricoes: [
          { dia: 'Quinta', horario: '16:00-18:00' }
        ],
        comentarios: 'Prefiro dar aulas consecutivas no mesmo dia.'
      },
    ];
    setDocentes(mockDocentes);
    setFilteredDocentes(mockDocentes);
  }, []);

  // Filtro de busca
  useEffect(() => {
    const results = docentes.filter(docente =>
      docente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      docente.numeroUSP.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDocentes(results);
    setCurrentPage(1);
  }, [searchTerm, docentes]);

  // Handlers
  const handleNomeClick = (docente) => {
    setDocenteSelecionado(docente);
    setShowDetailPopup(true);
  };

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDocentes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDocentes.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="d-alt-docentes-container">
      <div className="d-alt-docentes-content">
        <div className="d-alt-docentes-header">
          <div className="d-alt-docentes-search-container">
            <div className="d-alt-docentes-search-input">
              <input
                type="text"
                placeholder="Buscar Docente"
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
              <div className="d-alt-docentes-header-disciplinas">Nro de Disciplinas</div>
              <div className="d-alt-docentes-header-restricoes">% Restrições</div>
              <div className="d-alt-docentes-header-departamento">Departamento</div>
            </div>
            
            {currentItems.map((docente, index) => (
              <div className="d-alt-docentes-table-row" key={index}>
                <div className="d-alt-docentes-cell-numero">{docente.numeroUSP}</div>
                <div 
                  className="d-alt-docentes-cell-nome"
                  onClick={() => handleNomeClick(docente)}
                >
                  {docente.nome}
                </div>
                <div className="d-alt-docentes-cell-disciplinas">{docente.nroDisciplinas}</div>
                <div className="d-alt-docentes-cell-restricoes">{docente.percentualRestricoes}</div>
                <div className="d-alt-docentes-cell-departamento">{docente.departamento}</div>
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
      {showDetailPopup && (
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
                    {docenteSelecionado.disciplinas.map((disciplina, idx) => (
                        <div key={idx} className="d-alt-docentes-popup-item">
                            {disciplina.codigo} - {disciplina.nome}
                        </div>
                    ))}
                </div>
            </div>
        
        <div className="d-alt-docentes-popup-section">
          <h3>Restrições de Horário</h3>
          <div className="d-alt-docentes-popup-content">
            {docenteSelecionado.restricoes.length > 0 ? (
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
        
        <div className="d-alt-docentes-popup-section">
          <h3>Comentários</h3>
          <div className="d-alt-docentes-popup-content">
            <div className="d-alt-docentes-popup-comment">
              {docenteSelecionado.comentarios || 'Nenhum comentário fornecido'}
            </div>
          </div>
        </div>
      </div>
      
    <div className="d-alt-docentes-popup-footer">
        <button 
        className="d-alt-docentes-popup-close-button"
        onClick={() => setShowDetailPopup(false)}
        >
            <span className="popup-button-labelDoc">Fechar</span>
            <img className="docentes-popup-cancel-iconDOC" src="x0.svg" alt="Fechar"/>
            </button>
    </div>

    </div>

  </div>
  
)}
    </div>
  );
};

export default DAltDocentes;