import { useState } from 'react';
import './Horario.css';

function Horario() {
  const [horarios, setHorarios] = useState([
    { id: 1, periodo: '08:00 - 09:40', dias: [false, false, false, false, false, false] },
    { id: 2, periodo: '10:00 - 11:40', dias: [false, false, false, false, false, false] },
    { id: 3, periodo: '19:00 - 20:40', dias: [false, false, false, false, false, false] },
    { id: 4, periodo: '20:50 - 22:30', dias: [false, false, false, false, false, false] }
  ]);

  const [diasSemana, setDiasSemana] = useState(['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']);

  const adicionarHorario = () => {
    const novoHorario = {
      id: Date.now(),
      periodo: '00:00 - 00:00',
      dias: new Array(diasSemana.length).fill(false)
    };
    setHorarios([...horarios, novoHorario]);
  };

  const adicionarDia = () => {
    setDiasSemana([...diasSemana, 'Novo Dia']);
    setHorarios(horarios.map(horario => ({
      ...horario,
      dias: [...horario.dias, false]
    })));
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

  return (
    <div className="horario-frame-41">
      <div className="horario-frame-44">
        <div className="horario-frame-2328">
          <div className="horario-frame-67">
            <div className="horario-frame-2327">
              <div className="horario-header">
                <div className="horario-title">Horários</div>
                {diasSemana.map((dia, index) => (
                  <div 
                    key={index} 
                    className={`horario-dia ${index === 2 ? 'horario-frame-66' : ''}`}
                  >
                    {dia}
                  </div>
                ))}
                <div className="horario-add-dia">
                  <img 
                    className="horario-plus-icon" 
                    src="plus-circle0ESCURO.svg" 
                    alt="Adicionar dia"
                    onClick={adicionarDia}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              </div>

              {horarios.map((horario) => (
                <div key={horario.id} className="horario-row">
                  <div className="horario-periodo">{horario.periodo}</div>
                  
                  {horario.dias.map((selecionado, diaIndex) => (
                    <div 
                      key={diaIndex} 
                      className={`horario-cell horario-cell-${diaIndex}`}
                      onClick={() => toggleDia(horario.id, diaIndex)}
                    >
                      <div className="horario-checkbox">
                        <div 
                          className="horario-checkbox-inner" 
                          style={{ 
                            backgroundColor: selecionado ? '#49a0b6' : 'transparent',
                            border: selecionado ? 'none' : '1px solid #adb5bd'
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  <div className="horario-cell-empty">
                    <div className="horario-plus-placeholder"></div>
                  </div>
                </div>
              ))}

              <div className="horario-footer">
                <div className="horario-cell-empty">
                  <div className="horario-plus-placeholder"></div>
                </div>
                <div className="horario-add-horario">
                  <img 
                    className="horario-plus-icon" 
                    src="plus-circle6ESCURO.svg" 
                    alt="Adicionar horário"
                    onClick={adicionarHorario}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Horario;