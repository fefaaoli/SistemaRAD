import { useState, useEffect, useCallback } from 'react';
import { toast } from "react-toastify";
import './Horario.css';

function Horario() {
  const [horarios, setHorarios] = useState([]);
  const [diasSemana, setDiasSemana] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [novoPeriodo, setNovoPeriodo] = useState('');
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
    if (!periodoAtual) {
      toast.warning('Nenhum período definido para salvar os horários');
      return;
    }

  const dadosParaSalvar = [
    { ordem: 0, cat: 'init', valor: 'init' },
    ...diasSemana.map((dia, index) => ({
      ordem: (index + 1) * 10,
      cat: 'dia',
      valor: dia.toLowerCase().includes('feira') ? dia : `${index + 2}a feira`
    })),
    ...horarios.map((horario, index) => ({
      ordem: (index + 1) * 100,
      cat: 'hora',
      valor: horario.periodo
    }))
  ];

    fetch('http://localhost:5000/api/admin/horarios/salvar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        periodo: periodoAtual,
        horarios: dadosParaSalvar
      })
    })
    .then(res => {
      if (!res.ok) throw new Error('Erro ao salvar horários');
      return res.json();
    })
    .then(() => {
      toast.success('Horários salvos com sucesso!');
    })
    .catch(err => {
      console.error('Erro:', err);
      toast.error(err.message);
    });
  };

  return (
    <div className="schedule-container">
      <div className="schedule-card">
        <div className="schedule-inner">
          <div className="schedule-content">
            <div className="schedule-header">
              <div className="schedule-title">Horários {periodoAtual && `- ${periodoAtual}`}</div>
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