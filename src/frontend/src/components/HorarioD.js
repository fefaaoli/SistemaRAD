import { useState, useEffect, useCallback } from 'react';
import { toast } from "react-toastify";
import './HorarioD.css';

function HorarioD() {
  const [horarios, setHorarios] = useState([]);
  const [diasSemana, setDiasSemana] = useState([]);
  const [periodoAtual, setPeriodoAtual] = useState('');
  const [maxIndisponiveis, setMaxIndisponiveis] = useState(5); // Valor padrão inicial
  const [totalIndisponiveis, setTotalIndisponiveis] = useState(0);

  // ID do docente fixo (substitui login/autenticação)
  const docenteId = '14595546'; // <--- aqui você coloca o número USP do docente

  // Calcula o total de checkboxes marcados como indisponível
  useEffect(() => {
    const count = horarios.reduce((acc, horario) => {
      return acc + horario.dias.filter(dia => dia).length;
    }, 0);
    setTotalIndisponiveis(count);
  }, [horarios]);

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

    const novaTabela = horariosUnicos.map((horarioTexto, i) => ({
      id: i + 1,
      periodo: horarioTexto,
      dias: diasSemana.map(() => false)
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

  // Carrega o período mais recente, horários e configurações de restrição
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const responsePeriodo = await fetch('http://localhost:5000/api/admin/horarios/periodo-recente');
        if (!responsePeriodo.ok) throw new Error('Erro ao carregar período');
        
        const { periodo } = await responsePeriodo.json();
        setPeriodoAtual(periodo);

        const responseHorarios = await fetch(
          `http://localhost:5000/api/admin/horarios?periodo=${encodeURIComponent(periodo)}`
        );
        if (!responseHorarios.ok) throw new Error('Erro ao carregar horários');

        const dataHorarios = await responseHorarios.json();
        processarDadosBackend(dataHorarios);

        const responseRestricao = await fetch(
          `http://localhost:5000/api/admin/restricoes/horario?periodo=${encodeURIComponent(periodo)}`
        );
        if (responseRestricao.ok) {
          const { maxIndisponiveis } = await responseRestricao.json();
          setMaxIndisponiveis(maxIndisponiveis);
        }
      } catch (error) {
        console.error('Erro:', error);
        setDiasSemana(['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']);
        setHorarios([
          { id: 1, periodo: '08:00 - 09:40', dias: [false, false, false, false, false, false] },
          { id: 2, periodo: '10:00 - 11:40', dias: [false, false, false, false, false, false] },
          { id: 3, periodo: '19:00 - 20:40', dias: [false, false, false, false, false, false] },
          { id: 4, periodo: '20:50 - 22:30', dias: [false, false, false, false, false, false] }
        ]);
      }
    };

    carregarDados();
  }, [processarDadosBackend]);

  const toggleDia = (horarioId, diaIndex) => {
    setHorarios(prevHorarios => {
      return prevHorarios.map(horario => {
        if (horario.id === horarioId) {
          const tentandoMarcar = !horario.dias[diaIndex];
          if (tentandoMarcar && totalIndisponiveis >= maxIndisponiveis) {
            toast.warning(`Você só pode marcar ${maxIndisponiveis} horários como indisponíveis!`);
            return horario;
          }
          
          const novosDias = [...horario.dias];
          novosDias[diaIndex] = !novosDias[diaIndex];
          return { ...horario, dias: novosDias };
        }
        return horario;
      });
    });
  };

  const handleConfirm = async () => {
    try {
      // Mapeia horários indisponíveis no formato do backend
      const indisponibilidades = horarios.flatMap(horario => {
        return horario.dias
          .map((selecionado, diaIndex) => selecionado ? {
            docente: docenteId, // <--- adiciona automaticamente
            hordem: horario.id, // ou outro identificador que o backend espera
            dordem: diaIndex + 1, // mapeia o dia para dordem (1=Segunda, 2=Terça,...)
          } : null)
          .filter(Boolean);
      });

      for (const indisponibilidade of indisponibilidades) {
        await fetch('http://localhost:5000/indisponibilidades', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(indisponibilidade)
        });
      }

      toast.success("Restrições salvas com sucesso!");
    } catch (error) {
      console.error('Erro:', error);
      toast.error("Erro ao salvar restrições. Por favor, tente novamente.");
    }
  };

  return (
    <div className="horario-container">
      <div className="horario-card">
        <div className="horario-content">

          <div className="horario-grid">
            <div className="horario-header">
              <div className="horario-title">Horários {periodoAtual && `- ${periodoAtual}`}</div>
              {diasSemana.map((dia, index) => (
                <div key={index} className="horario-dia">{dia}</div>
              ))}
            </div>

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
                        disabled={
                          !selecionado && 
                          totalIndisponiveis >= maxIndisponiveis
                        }
                      />
                      <span className="horario-checkbox-custom"></span>
                    </label>
                  </div>
                ))}
              </div>
            ))}
          </div>
          
          <div className="horario-confirm-container">
            <button 
              className="horario-confirm-button" 
              onClick={handleConfirm}
              disabled={totalIndisponiveis > maxIndisponiveis}
            >
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