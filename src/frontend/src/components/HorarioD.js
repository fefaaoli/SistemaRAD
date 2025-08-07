import { useState, useEffect, useCallback } from 'react';
import './HorarioD.css';

function HorarioD() {
  const [horarios, setHorarios] = useState([]);
  const [diasSemana, setDiasSemana] = useState([]);
  const [periodoAtual, setPeriodoAtual] = useState('');

  // Processa os dados do backend para o formato usado no frontend
  const processarDadosBackend = useCallback((data) => {
    const diasMap = {};
    let diaAtual = null;

    data.forEach(h => {
      const valor = h.valor?.toLowerCase();
      if (valor?.includes('feira')) {
        diaAtual = normalizarDia(valor);
        if (!diasMap[diaAtual]) diasMap[diaAtual] = [];
      } else if (valor?.match(/\d{2}:\d{2}/)) {
        if (diaAtual) diasMap[diaAtual].push(valor);
      }
    });

    const diasSemana = Object.keys(diasMap);
    const horariosUnicos = Array.from(new Set(Object.values(diasMap).flat()));

    // Modificação: forçar todos os dias como false inicialmente
    const novaTabela = horariosUnicos.map((horarioTexto, i) => ({
      id: i + 1,
      periodo: horarioTexto,
      dias: diasSemana.map(() => false) // Todos desmarcados por padrão
    }));

    setDiasSemana(diasSemana);
    setHorarios(novaTabela);
  }, []);

  const normalizarDia = (texto) => {
    const mapa = {
      '2a feira': 'Segunda',
      '3a feira': 'Terça',
      '4a feira': 'Quarta',
      '5a feira': 'Quinta',
      '6a feira': 'Sexta',
      'sábado': 'Sábado'
    };
    return mapa[texto.toLowerCase()] || texto;
  };

  // Carrega o período mais recente e os horários ao montar o componente
  useEffect(() => {
    const carregarPeriodoRecente = async () => {
      try {
        // 1. Busca o período mais recente
        const responsePeriodo = await fetch('http://localhost:5000/api/admin/horarios/periodo-recente');
        if (!responsePeriodo.ok) throw new Error('Erro ao carregar período');
        
        const { periodo } = await responsePeriodo.json();
        setPeriodoAtual(periodo);

        // 2. Busca os horários do período
        const responseHorarios = await fetch(
          `http://localhost:5000/api/admin/horarios?periodo=${encodeURIComponent(periodo)}`
        );
        if (!responseHorarios.ok) throw new Error('Erro ao carregar horários');

        const data = await responseHorarios.json();
        processarDadosBackend(data);
      } catch (error) {
        console.error('Erro:', error);
        // Mantém os dados padrão caso ocorra erro
        setDiasSemana(['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']);
        setHorarios([
          { id: 1, periodo: '08:00 - 09:40', dias: [false, false, false, false, false, false] },
          { id: 2, periodo: '10:00 - 11:40', dias: [false, false, false, false, false, false] },
          { id: 3, periodo: '19:00 - 20:40', dias: [false, false, false, false, false, false] },
          { id: 4, periodo: '20:50 - 22:30', dias: [false, false, false, false, false, false] }
        ]);
      }
    };

    carregarPeriodoRecente();
  }, [processarDadosBackend]);

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
              <div className="horario-title">Horários {periodoAtual && `- ${periodoAtual}`}</div>
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

export default HorarioD;