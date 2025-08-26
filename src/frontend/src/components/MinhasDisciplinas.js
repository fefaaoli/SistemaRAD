import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";
import axios from 'axios';
import './MinhasDisciplinas.css';

const DisciplinasManager = () => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [filteredDisciplinas, setFilteredDisciplinas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [disciplinaEditando, setDisciplinaEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 20;

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const docenteId = usuario?.id || usuario?.docenteId;

  const formatarTipo = (tipo) => {
    const tipos = {
      'optativa_eletiva': 'op. eletiva',
      'optativa_livre': 'op. livre',
      'obrigatoria': 'obrigatória'
    };
    return tipos[tipo] || tipo;
  };

  const formatarTurma = (turma) => turma.toLowerCase();

  useEffect(() => {
    const fetchDisciplinas = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/inscricao/list/${docenteId}`);
        if (response.data.success) {
          const data = response.data.data.map(d => ({
            id: d.aid,
            codigo: d.cod,
            nome: d.disciplina,
            turma: formatarTurma(d.turma),
            tipo: formatarTipo(d.tipo),
            comentario: d.comentario || '',
            idioma_en: !!d.idioma_en,
            apoio_leia: !!d.apoio_leia,
            max_alunos: d.max_alunos || ''
          }));
          setDisciplinas(data);
          setFilteredDisciplinas(data);
        } else {
          setError('Erro ao buscar disciplinas do backend');
        }
      } catch (err) {
        console.error(err);
        setError('Erro ao buscar disciplinas do backend');
      } finally {
        setLoading(false);
      }
    };
    if (docenteId) {
      fetchDisciplinas();
    }
  }, [docenteId]);

  useEffect(() => {
    const results = disciplinas.filter(d =>
      d.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDisciplinas(results);
    setCurrentPage(1);
  }, [searchTerm, disciplinas]);

  const handleRemoverDisciplina = async (disciplinaId) => {
    if (!window.confirm('Tem certeza que deseja remover esta disciplina?')) return;
    setLoading(true);
    try {
      const response = await axios.delete('http://localhost:5000/api/inscricao/remove', {
        data: { aid: disciplinaId, did: docenteId }
      });
      if (response.data.success) {
        setDisciplinas(prev => prev.filter(d => d.id !== disciplinaId));
        toast.success('Disciplina removida com sucesso!');
      } else {
        toast.error('Erro ao remover disciplina');
      }
    } catch (err) {
      console.error(err);
      toast.error('Erro ao remover disciplina');
    } finally {
      setLoading(false);
    }
  };

  const handleEditarClick = (disciplina) => {
    setDisciplinaEditando(disciplina);
    setShowEditModal(true);
  };

  const handleSalvarEdicao = async () => {
    if (!disciplinaEditando) return;

    try {
      setLoading(true);
      // Chamada ao backend para salvar comentário/metadados
      const response = await axios.post('http://localhost:5000/api/inscricao/comentario', {
        did: docenteId,
        aid: disciplinaEditando.id,
        comentario: disciplinaEditando.comentario,
        idioma_en: disciplinaEditando.idioma_en,
        apoio_leia: disciplinaEditando.apoio_leia,
        max_alunos: disciplinaEditando.max_alunos
      });
      if (response.data.success) {
        setDisciplinas(prev => prev.map(d =>
          d.id === disciplinaEditando.id ? { ...d, ...disciplinaEditando } : d
        ));
        setShowEditModal(false);
        toast.success('Informações sobre disciplina atualizadas!');
      } else {
        toast.error('Erro ao salvar comentário/metadados');
      }
    } catch (err) {
      console.error(err);
      toast.error('Erro ao salvar comentário/metadados');
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDisciplinas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDisciplinas.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading && disciplinas.length === 0) {
    return (
      <div className="loading-frame">
        <div className="loading-spinner"></div>
        <p>Carregando disciplinas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-frame">
        <p>Erro: {error}</p>
        <button onClick={() => window.location.reload()}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <div className="main-disciplinas-frame">
      <div className="content-disciplinas-frame">
        <div className="header-disciplinas-frame">
          <div className="search-frame">
            <div className="search-input-frame">
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

        <div className="list-disciplinas-frame">
          <div className="table-disciplinas-frame">
            <div className="table-header-frame">
              <div className="header-codigo-frame">Código</div>
              <div className="header-nome-frame">Disciplina</div>
              <div className="header-turma-frame">Turma</div>
              <div className="header-tipo-frame">Tipo</div>
              <div className="header-turno-frame"></div>
              <div className="header-editar-frame">Editar</div>
            </div>

            {currentItems.map((disciplina, index) => (
              <div className="table-row-frame" key={index}>
                <div className="cell-codigo-frame">{disciplina.codigo}</div>
                <div className="cell-nome-frame">{disciplina.nome}</div>
                <div className="cell-turma-frame">{disciplina.turma}</div>
                <div className="cell-tipo-frame">{disciplina.tipo}</div>
                <div className="cell-turno-frame">{disciplina.turno}</div>
                <div className="cell-editar-frame">
                  <button 
                    className="edit-button-frame"
                    onClick={() => handleEditarClick(disciplina)}
                  >
                    <img className="pencil-icon" src="pencil0.svg" alt="Editar" />
                  </button>
                  <button 
                    className="schedule-action-btn"
                    onClick={() => handleRemoverDisciplina(disciplina.id)}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination-frame">
            <button 
              className="pagination-button-frame" 
              disabled={currentPage === 1}
              onClick={() => paginate(currentPage - 1)}
            >
              <div className="pagination-text-frame">Anterior</div>
            </button>
            <div className="pagination-numbers-frame">
              {[...Array(totalPages).keys()].map(number => (
                <button
                  key={number}
                  className={`page-number-frame ${currentPage === number + 1 ? 'active' : ''}`}
                  onClick={() => paginate(number + 1)}
                >
                  {number + 1}
                </button>
              ))}
            </div>
            <button 
              className="pagination-button-frame" 
              disabled={currentPage === totalPages}
              onClick={() => paginate(currentPage + 1)}
            >
              <div className="pagination-text-frame">Próxima</div>
            </button>
          </div>
        </div>
      </div>

      {showEditModal && disciplinaEditando && (
        <div className="edit-modal-overlay-frame">
          <div className="edit-modal-frame">
            <div className="modal-header-frame">
              <img className="lapisBRANCO" src="BRANCOpencil0.svg" alt="Ícone editar"/>
              <div className="modal-title-frame">Editar Disciplina</div>
            </div>
            <div className="modal-body-frame">
              <form onSubmit={(e) => { e.preventDefault(); handleSalvarEdicao(); }}>
                <div className="form-group-frame">
                  <label>Oferecimento em Inglês</label>
                  <select
                    value={disciplinaEditando.idioma_en ? 'Sim' : 'Não'}
                    onChange={(e) => setDisciplinaEditando({
                      ...disciplinaEditando,
                      idioma_en: e.target.value === 'Sim'
                    })}
                  >
                    <option>Sim</option>
                    <option>Não</option>
                  </select>
                </div>
                <div className="form-group-frame">
                  <label>Necessita do Leia</label>
                  <select
                    value={disciplinaEditando.apoio_leia ? 'Sim' : 'Não'}
                    onChange={(e) => setDisciplinaEditando({
                      ...disciplinaEditando,
                      apoio_leia: e.target.value === 'Sim'
                    })}
                  >
                    <option>Sim</option>
                    <option>Não</option>
                  </select>
                </div>
                <div className="form-group-frame">
                  <label>Limitar Número de Alunos</label>
                  <input
                    type="number"
                    value={disciplinaEditando.max_alunos || ''}
                    onChange={(e) => setDisciplinaEditando({
                      ...disciplinaEditando,
                      max_alunos: parseInt(e.target.value) || null
                    })}
                    min="30"
                  />
                </div>
                <div className="form-group-frame">
                  <label>Comentário</label>
                  <input
                    type="text"
                    value={disciplinaEditando.comentario || ''}
                    onChange={(e) => setDisciplinaEditando({
                      ...disciplinaEditando,
                      comentario: e.target.value
                    })}
                  />
                </div>
                <div className="popup-disciplina-actions">
                  <button 
                    type="button"
                    className="popup-cancel-button"
                    onClick={() => setShowEditModal(false)}
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
      )}
    </div>
  );
};

export default DisciplinasManager;
