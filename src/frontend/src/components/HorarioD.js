import { useState } from 'react';
import './HorarioD.css';

function Horario() {
  const [horarios, setHorarios] = useState([
    { id: 1, periodo: '08:00 - 09:40', dias: [false, false, false, false, false, false] },
    { id: 2, periodo: '10:00 - 11:40', dias: [false, false, false, false, false, false] },
    { id: 3, periodo: '19:00 - 20:40', dias: [false, false, false, false, false, false] },
    { id: 4, periodo: '20:50 - 22:30', dias: [false, false, false, false, false, false] }
  ]);

  const [diasSemana] = useState(['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']);

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

  const handleConfirm = () => {
    console.log("Horários selecionados:", horarios);
    alert("Seleção confirmada com sucesso!");
  };

  return (
    <div className="horario-container">
      <div className="horario-card">
        <div className="horario-content">
          <div className="horario-grid">
            {/* Cabeçalho */}
            <div className="horario-header">
              <div className="horario-title">Horários</div>
              {diasSemana.map((dia, index) => (
                <div key={index} className="horario-dia">
                  {dia}
                </div>
              ))}
            </div>

            {/* Linhas de horários */}
            {horarios.map((horario) => (
              <div key={horario.id} className="horario-row">
                <div className="horario-periodo">{horario.periodo}</div>
                
                {horario.dias.map((selecionado, diaIndex) => (
                  <div key={diaIndex} className="horario-cell">
                    <label className="horario-checkbox-label">
                      <input
                        type="checkbox"
                        checked={selecionado}
                        onChange={() => toggleDia(horario.id, diaIndex)}
                        className="horario-checkbox-input"
                      />
                      <span className="horario-checkbox-custom"></span>
                    </label>
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          {/* Botão de confirmação */}
          <div className="horario-confirm-container">
            <button className="horario-confirm-button" onClick={handleConfirm}>
              Confirmar Seleção
              <img className="popup-check-icon" src="check0.svg" alt="Confirmar"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Horario;