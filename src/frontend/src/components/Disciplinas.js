import React, { useState, useEffect } from 'react';
import './Disciplinas.css';
import axios from 'axios';

const Disciplinas = () => {
  // Estado para armazenar as disciplinas
  const [disciplinas, setDisciplinas] = useState([]);
  const [filteredDisciplinas, setFilteredDisciplinas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDisciplinas, setSelectedDisciplinas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 20;

  // Busca disciplinas da API
  useEffect(() => {
    const fetchDisciplinas = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/disciplinas');
        
        const dadosFormatados = response.data.map(item => ({
          codigo: item.cod,
          nome: item.disciplina,
          turma: item.turma,
          tipo: item.tipo,
          turno: item.turma.includes('D') ? 'Diurno' : 'Noturno'
        }));

        setDisciplinas(dadosFormatados);
        setFilteredDisciplinas(dadosFormatados);
      } catch (error) {
        console.error("Erro ao carregar disciplinas:", error);
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
  }, [searchTerm, disciplinas]);

  // Manipulador do checkbox
  const handleCheckboxChange = (codigo) => {
    setSelectedDisciplinas(prev => {
      if (prev.includes(codigo)) {
        return prev.filter(item => item !== codigo);
      } else {
        return [...prev, codigo];
      }
    });
  };

  // Função para confirmar seleção
  const handleConfirmSelection = () => {
    const selected = disciplinas.filter(d => selectedDisciplinas.includes(d.codigo));
    console.log("Disciplinas selecionadas:", selected);
    alert(`Você selecionou ${selected.length} disciplina(s)`);
  };

  // Lógica de paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDisciplinas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDisciplinas.length / itemsPerPage);

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
          <div className="filter-button">
            <img className="filter-icon" src="filter0.svg" alt="Filtrar" />
          </div>
        </div>
        
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
              <div className="header-checkbox"></div>
            </div>
            
            {currentItems.map((disciplina, index) => (
              <div className="disciplina-row" key={index}>
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

          <div className="confirmar-selecao-container">
            <button 
              className="confirmar-selecao-btn"
              onClick={handleConfirmSelection}
              disabled={selectedDisciplinas.length === 0}
            >
              Confirmar Seleção
              <img className="confirm-icon" src="check0.svg" alt="Confirmar" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disciplinas;