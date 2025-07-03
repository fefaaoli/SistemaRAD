import { useState } from 'react';
import './Horario.css';

function Horario() {
  const [horarios, setHorarios] = useState([
    { id: 1, periodo: '08:00 - 09:40', dias: [false, false, false, false, false, false] },
    { id: 2, periodo: '10:00 - 11:40', dias: [false, false, false, false, false, false] },
    { id: 3, periodo: '19:00 - 20:40', dias: [false, false, false, false, false, false] },
    { id: 4, periodo: '20:50 - 22:30', dias: [false, false, false, false, false, false] }
  ]);

  const [diasSemana] = useState(['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']);
  const [editandoId, setEditandoId] = useState(null);
  const [novoPeriodo, setNovoPeriodo] = useState('');

  const adicionarHorario = () => {
    const novoHorario = {
      id: Date.now(),
      periodo: '00:00 - 00:00',
      dias: new Array(diasSemana.length).fill(false)
    };
    setHorarios([...horarios, novoHorario]);
    setEditandoId(novoHorario.id);
    setNovoPeriodo(novoHorario.periodo);
  };

  const removerHorario = (id) => {
    setHorarios(horarios.filter(horario => horario.id !== id));
  };

  const iniciarEdicao = (id, periodo) => {
    setEditandoId(id);
    setNovoPeriodo(periodo);
  };

  const salvarEdicao = (id) => {
    setHorarios(horarios.map(horario => 
      horario.id === id ? { ...horario, periodo: novoPeriodo } : horario
    ));
    setEditandoId(null);
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
  };

  const toggleDia = (horarioId, diaIndex) => {
    setHorarios(horarios.map(horario => {
      if (horario.id === horarioId) {
        const novosDias = [...horario.dias];
        novosDias[diaIndex] = !novosDias[diaIndex];
        return { ...horario, dias: novosDias };
      }
      return horario;
    }));
  };

  const confirmarSelecao = () => {
    console.log("Horários selecionados:", horarios);
    alert("Seleção confirmada com sucesso!");
  };

  return (
    <div className="schedule-container">
      <div className="schedule-card">
        <div className="schedule-inner">
          <div className="schedule-content">
            <div className="schedule-header">
              <div className="schedule-title">Horários</div>
              {diasSemana.map((dia, index) => (
                <div key={index} className="schedule-day-header">
                  {dia}
                </div>
              ))}
              <div className="schedule-empty-cell"></div>
            </div>

            {horarios.map((horario) => (
              <div key={horario.id} className="schedule-row">
                {editandoId === horario.id ? (
                  <>
                    <input
                      type="text"
                      value={novoPeriodo}
                      onChange={(e) => setNovoPeriodo(e.target.value)}
                      className="schedule-input"
                    />
                    <button 
                      onClick={() => salvarEdicao(horario.id)}
                      className="schedule-action-btn"
                    >
                      ✓
                    </button>
                    <button 
                      onClick={cancelarEdicao}
                      className="schedule-action-btn"
                    >
                      ✗
                    </button>
                  </>
                ) : (
                  <>
                    <div 
                      className="schedule-time"
                      onClick={() => iniciarEdicao(horario.id, horario.periodo)}
                    >
                      {horario.periodo}
                    </div>
                    <button 
                      onClick={() => removerHorario(horario.id)}
                      className="schedule-action-btn"
                    >
                      ×
                    </button>
                  </>
                )}
                
                {horario.dias.map((selecionado, diaIndex) => (
                  <div key={diaIndex} className="schedule-day-cell">
                    <label style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <input 
                        type="checkbox" 
                        className="schedule-checkbox-input"
                        checked={selecionado}
                        onChange={() => toggleDia(horario.id, diaIndex)}
                      />
                      <span className="schedule-checkbox-custom"></span>
                    </label>
                  </div>
                ))}

                <div className="schedule-empty-cell"></div>
              </div>
            ))}

            <div className="schedule-footer">
              <div className="schedule-empty-cell"></div>
              <div className="schedule-add-btn">
                <img 
                  src="plus-circle6ESCURO.svg" 
                  alt="Adicionar horário"
                  onClick={adicionarHorario}
                />
              </div>
            </div>
            
            <div className="schedule-confirm-container">
              <button 
                className="schedule-confirm-btn"
                onClick={confirmarSelecao}
              >
                Confirmar Seleção
                <img className="popup-check-icon" src="check0.svg" alt="Confirmar"/>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Horario;