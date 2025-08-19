import React, { useState, useEffect } from 'react';
import './Disciplinas.css';
import axios from 'axios';

const DDisciplina = () => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [filteredDisciplinas, setFilteredDisciplinas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [selectedDisciplinas, setSelectedDisciplinas] = useState([]);
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

  // Busca as disciplinas ativas
  useEffect(() => {
    const fetchDisciplinasAtivas = async () => {
      try {
        setLoading(true);
        console.log('Iniciando busca de disciplinas ativas...');
        
        const response = await axios.get('http://localhost:5000/api/admin/disciplinas/ativas');
        console.log('Resposta do backend:', response.data);
        
        if (response.data.length === 0) {
          console.log('Nenhuma disciplina retornada pelo backend');
          setNotification({
            type: 'info',
            message: 'Nenhuma disciplina ativa no período atual',
            details: 'O período atual é 2026/2, mas não há disciplinas vinculadas'
          });
        }

        const dadosFormatados = response.data.map(item => ({
          id: item.id,
          aid: item.id, // Adicionado para usar na inscrição
          codigo: item.cod,
          nome: item.nome || item.disciplina,
          turma: formatarTurma(item.turma),
          tipo: formatarTipo(item.tipo),
          turno: formatarTurno(item.turma),
          selected: false // Adicionado para controle de seleção
        }));

        console.log('Disciplinas formatadas:', dadosFormatados);
        setDisciplinas(dadosFormatados);
        setFilteredDisciplinas(dadosFormatados);
        
      } catch (error) {
        console.error("Erro completo:", error);
        console.error("Resposta de erro:", error.response);
        setNotification({
          type: 'error',
          message: 'Erro ao carregar disciplinas',
          details: error.response?.data?.error || error.message
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDisciplinasAtivas();
  }, []);

  // Filtra as disciplinas conforme o termo de busca
  useEffect(() => {
    const results = disciplinas.filter(disciplina =>
      disciplina.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disciplina.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDisciplinas(results);
    setCurrentPage(1);
  }, [searchTerm, disciplinas]);

  // Lógica de paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDisciplinas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDisciplinas.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Função para lidar com a seleção/deseleção de disciplinas
  const handleSelectDisciplina = (disciplinaId) => {
    setDisciplinas(prevDisciplinas => 
      prevDisciplinas.map(disciplina => 
        disciplina.id === disciplinaId 
          ? { ...disciplina, selected: !disciplina.selected } 
          : disciplina
      )
    );
    
    setFilteredDisciplinas(prevFiltered => 
      prevFiltered.map(disciplina => 
        disciplina.id === disciplinaId 
          ? { ...disciplina, selected: !disciplina.selected } 
          : disciplina
      )
    );

    setSelectedDisciplinas(prevSelected => {
      if (prevSelected.includes(disciplinaId)) {
        return prevSelected.filter(id => id !== disciplinaId);
      } else {
        return [...prevSelected, disciplinaId];
      }
    });
  };

  // Função para confirmar a seleção e enviar ao backend
  const handleConfirmarSelecao = async () => {
    if (selectedDisciplinas.length === 0) {
      setNotification({
        type: 'warning',
        message: 'Nenhuma disciplina selecionada',
        details: 'Selecione pelo menos uma disciplina para confirmar'
      });
      return;
    }

    try {
      setLoading(true);
      
      // Obter o ID do docente (você pode precisar ajustar isso conforme sua autenticação)
      const docenteId = 14595546; // Exemplo - ajustar conforme necessário
      
      if (!docenteId) {
        throw new Error('ID do docente não encontrado');
      }

      // Enviar cada disciplina selecionada
      const promises = selectedDisciplinas.map(async (aid) => {
        await axios.post('http://localhost:5000/api/inscricao/add', {
          aid,
          did: docenteId
        });
      });

      await Promise.all(promises);

      setNotification({
        type: 'success',
        message: 'Inscrições confirmadas com sucesso!',
        details: `Você foi inscrito em ${selectedDisciplinas.length} disciplina(s)`
      });

      // Limpar seleções após confirmação
      setSelectedDisciplinas([]);
      setDisciplinas(prev => prev.map(d => ({ ...d, selected: false })));
      setFilteredDisciplinas(prev => prev.map(d => ({ ...d, selected: false })));

    } catch (error) {
      console.error('Erro ao confirmar inscrições:', error);
      setNotification({
        type: 'error',
        message: 'Erro ao confirmar inscrições',
        details: error.response?.data?.message || error.message
      });
    } finally {
      setLoading(false);
    }
  };

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
      {notification && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-message">{notification.message}</div>
          {notification.details && (
            <div className="notification-details">{notification.details}</div>
          )}
          <button 
            className="notification-close"
            onClick={() => setNotification(null)}
          >
            ×
          </button>
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
        </div>
        
        <div className="disciplinas-list-container">
          <div className="disciplinas-table">
            <div className="disciplinas-table-header">
              <div className="header-codigo">Código</div>
              <div className="header-nome">Disciplina</div>
              <div className="header-turma">Turma</div>
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
          
          {/* Paginação - SEMPRE VISÍVEL */}
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
          
          {/* Botão Confirmar Seleção - SEMPRE VISÍVEL */}
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
    </div>
  );
};

export default DDisciplina;