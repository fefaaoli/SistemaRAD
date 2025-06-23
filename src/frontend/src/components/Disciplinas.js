import React from 'react';
import './Disciplinas.css';

const Disciplinas = ({ disciplinas = [] }) => {
  // Dados mockados
  const mockDisciplinas = [
    {
      codigo: "RAD2802",
      nome: "Planejamento e Gestão Estratégica de Marketing",
      turma: "1º Semestre",
      tipo: "Optativa Livre",
      turno: "Noturno"
    },
    {
      codigo: "INF101",
      nome: "Introdução à Programação",
      turma: "3º Semestre",
      tipo: "Obrigatória",
      turno: "Noturno"
    },
    {
      codigo: "RAD2802",
      nome: "Gestão Empresarial",
      turma: "1º Semestre",
      tipo: "Obrigatória",
      turno: "Diurno"
    }
  ];

  const disciplinasParaExibir = disciplinas.length > 0 ? disciplinas : mockDisciplinas;

  return (
    <div className="disciplinas-container">
      <div className="disciplinas-card">
        <div className="disciplinas-content">
          <div className="search-filter-container">
            <div className="search-input-field">
              <div className="text-input">
                <div className="text">Buscar Disciplina</div>
                <img className="search" src="search0.svg" alt="Buscar" />
              </div>
            </div>
            <div className="icon-buttons">
              <img className="filter" src="filter0.svg" alt="Filtrar" />
            </div>
          </div>
          
          <div className="disciplinas-list-container">
            <div className="disciplinas-table">
              <div className="disciplinas-header">
                {/* Cabeçalho da tabela */}
                <div className="header-item codigo">Código</div>
                <div className="header-item nome">Listagem de Disciplinas</div>
                <div className="header-item turma">Turma</div>
                <div className="header-item tipo">Tipo</div>
                <div className="header-item turno">Turno</div>
                <div className="header-item checkbox"></div>
              </div>
              
              {/* Lista de disciplinas */}
              {disciplinasParaExibir.map((disciplina, index) => (
                <div className="disciplina-row" key={`${disciplina.codigo}-${index}`}>
                  <div className="disciplina-item codigo">{disciplina.codigo}</div>
                  <div className="disciplina-item nome">{disciplina.nome}</div>
                  <div className="disciplina-item turma">{disciplina.turma}</div>
                  <div className={`disciplina-item tipo ${disciplina.tipo.toLowerCase().includes('obrigatória') ? 'obrigatoria' : 'optativa'}`}>
                    {disciplina.tipo}
                  </div>
                  <div className={`disciplina-item turno ${disciplina.turno.toLowerCase()}`}>
                    {disciplina.turno}
                  </div>
                  <div className="disciplina-item checkbox">
                    <div className="checkbox">
                      <div className="checkbox-inner"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Paginação */}
            <div className="pagination-container">
              <div className="pagination-button">
                <img className="chevron-left" src="chevron-left0.svg" alt="Anterior" />
                <div className="pagination-text">Anterior</div>
              </div>
              <div className="pagination-numbers">
                <div className="page-number active">1</div>
                <div className="page-number">2</div>
                <div className="page-number">3</div>
                <div className="page-number">4</div>
              </div>
              <div className="pagination-button">
                <div className="pagination-text">Próxima</div>
                <img className="chevron-right" src="chevron-right0.svg" alt="Próxima" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disciplinas;