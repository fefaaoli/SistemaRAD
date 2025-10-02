import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import SideBar from '../components/Sidebar';
import Footer from '../components/Footer';
import './ConfigurarDisciplinas.css';
import './ConfigurarRestricoes.css';
import './NovoPeriodo.css';
import { definirDataLimite } from '../services/apiPeriodo';

function ConfigurarRestricoes() {
  const [showRestricaoPopup, setShowRestricaoPopup] = useState(false);
  const [showDataLimitePopup, setShowDataLimitePopup] = useState(false);
  const [periodoAtual, setPeriodoAtual] = useState('Carregando...');
  const [nome, setNome] = useState('Carregando...');
  const [perfil, setPerfil] = useState('Carregando...');

  // Estado para data limite
  const [dataLimite, setDataLimite] = useState('');
  const [ultimaDataLimite, setUltimaDataLimite] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Estado para restrição de horários
  const [minSlotsDisponiveis, setMinSlotsDisponiveis] = useState('');
  const [maxIndisponiveis, setMaxIndisponiveis] = useState('');

  // Buscar o período atual
  useEffect(() => {
    async function fetchPeriodo() {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/horarios/periodo-recente`);
        if (!response.ok) {
          throw new Error('Erro ao buscar período');
        }

        const data = await response.json();
        setPeriodoAtual(data.periodo);
      } catch (error) {
        console.error('Erro ao buscar período:', error);
        setPeriodoAtual('Indisponível');
      }
    }

    async function fetchUsuario() {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/verify`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (!response.ok) throw new Error('Erro ao buscar usuário');
        const data = await response.json();

        const primeirosNomes = data.usuario.nome.split(' ')[0];
        setNome(primeirosNomes);
        setPerfil(data.usuario.admin === 1 ? 'Administrador' : 'Docente');

      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        setNome('Usuário');
        setPerfil('Desconhecido');
      }
    }

    fetchPeriodo();
    fetchUsuario();
  }, []);

  // Buscar última restrição do banco de dados
  const buscarUltimaRestricao = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/restricoes/horario/ultima`);
      if (!response.ok) throw new Error('Erro ao buscar última restrição');

      const data = await response.json();
      return data.valor ?? ''; // Corrigido: pegar "valor" retornado pelo backend
    } catch (error) {
      console.error('Erro ao buscar última restrição:', error);
      return '';
    }
  };

  // Converter data do formato YYYY-MM-DD para DD/MM/YYYY
  const formatarDataParaBr = (dataString) => {
    if (!dataString) return '';
    
    // Se já estiver no formato DD/MM/YYYY, retorna direto
    if (dataString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      return dataString;
    }
    
    // Se estiver no formato YYYY-MM-DD, converte
    if (dataString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [ano, mes, dia] = dataString.split('-');
      return `${dia}/${mes}/${ano}`;
    }
    
    return dataString;
  };

  // Validar formato brasileiro de data
  const validarFormatoDataBr = (dataBr) => {
    return dataBr.match(/^\d{2}\/\d{2}\/\d{4}$/);
  };

  // Validar se a data é válida (não é hoje nem anterior)
  const validarDataLimite = (dataBr) => {
    if (!dataBr || !validarFormatoDataBr(dataBr)) return false;
    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    const [dia, mes, ano] = dataBr.split('/');
    const dataSelecionada = new Date(ano, mes - 1, dia);
    
    // Verifica se a data é válida
    if (isNaN(dataSelecionada.getTime())) {
      return false;
    }
    
    // Verifica se a data é hoje ou anterior
    return dataSelecionada > hoje;
  };

  // Máscara para input de data no formato dd/mm/aaaa
  const aplicarMascaraData = (valor) => {
    // Remove tudo que não é número
    let apenasNumeros = valor.replace(/\D/g, '');
    
    // Aplica a máscara dd/mm/aaaa
    if (apenasNumeros.length <= 2) {
      return apenasNumeros;
    } else if (apenasNumeros.length <= 4) {
      return `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(2)}`;
    } else {
      return `${apenasNumeros.slice(0, 2)}/${apenasNumeros.slice(2, 4)}/${apenasNumeros.slice(4, 8)}`;
    }
  };

  // Handler para mudança no input de data
  const handleDataLimiteChange = (valor) => {
    const valorComMascara = aplicarMascaraData(valor);
    setDataLimite(valorComMascara);
  };

  // Abrir popup e buscar dados da restrição
  const handleAbrirRestricao = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/restricoes/horario?periodo=${periodoAtual}`);
      if (!res.ok) throw new Error('Erro ao buscar restrição de horário');

      const data = await res.json();
      const ultimaRestricao = await buscarUltimaRestricao();

      setMinSlotsDisponiveis(data.restricao ?? ultimaRestricao ?? '');
      setMaxIndisponiveis(data.maxIndisponiveis ?? 0);

      setShowRestricaoPopup(true);
    } catch (error) {
      console.error('Erro ao abrir popup de restrição:', error);
      toast.error('Erro ao buscar restrição de horário');
    }
  };

  // Salvar nova restrição
  const handleSalvarRestricao = async () => {
    try {
      const body = {
        restricao: parseInt(minSlotsDisponiveis)
      };

      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/restricoes/horario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        throw new Error('Erro ao salvar restrição');
      }

      toast.success('Restrição atualizada com sucesso!');
      setShowRestricaoPopup(false);
    } catch (error) {
      toast.error(`Erro: ${error.message}`);
    }
  };

  // Buscar a última data limite registrada ao abrir o popup
  const handleAbrirDataLimite = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/config/ultima-data-limite`);
      const result = await response.json();
      console.log('Resultado do backend:', result); // <-- depuração

      if (result.success && result.data) {
        const rawData = result.data.data_limite;
        console.log('Data bruta recebida:', rawData);

        if (rawData) {
          const dataFormatada = formatarDataParaBr(rawData);
          setUltimaDataLimite(dataFormatada);
        } else {
          setUltimaDataLimite('não registrada');
        }

        setDataLimite(''); // input vazio
      } else {
        setUltimaDataLimite('não registrada');
        setDataLimite('');
      }

      setShowDataLimitePopup(true);
    } catch (error) {
      console.error('Erro ao buscar última data limite:', error);
      setDataLimite('');
      setUltimaDataLimite('não registrada');
      setShowDataLimitePopup(true);
    }
  };

  // Salvar data limite
  const handleSalvarDataLimite = async () => {
    if (!dataLimite) {
      toast.warning('Selecione uma data válida!');
      return;
    }

    // Validação do formato
    if (!validarFormatoDataBr(dataLimite)) {
      toast.warning('Formato de data inválido! Use dd/mm/aaaa');
      return;
    }

    // Validação no frontend - não permite datas anteriores ou iguais a hoje
    if (!validarDataLimite(dataLimite)) {
      toast.warning('A data limite deve ser posterior ao dia atual!');
      return;
    }

    setIsLoading(true);
    try {
      await definirDataLimite(periodoAtual, dataLimite); 
      toast.success('Data limite configurada com sucesso!');
      setShowDataLimitePopup(false);
    } catch (error) {
      toast.error(`Erro: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="frame-2315">
      <div className="frame-2304">
        <div className="frame-2322">
          <div className="frame-2319">
            <img className="mask-group" src="mask-group0.svg" alt="logo" />
            <div className="top-navigation-bar">
              <div className="ol-carlos-silva">Olá, {nome}</div>
              <div className="frame-2320">
                <div className="perfil-de-administrador">Perfil de {perfil}</div>
                <div className="per-odo-letivo-atual-2025-01">
                  Período Letivo Atual: {periodoAtual}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="content-area">
          <div className="frame-48">
            <div className="frame-41">
              <div className="frame-44">
                <div className="frame-2333">
                  <button 
                    className="transaction-item" 
                    onClick={handleAbrirRestricao}
                    aria-label="Restrição de Horário"
                  >
                    <div className="frame-19">
                      <img className="plus" src="plus0.svg" alt="Ícone de adição" />
                    </div>
                    <div className="frame-34">
                      <div className="adicionar-disciplinas">Restrição de Horário</div>
                      <div className="inclus-o-de-novas-disciplinas-para-o-semestre-vigente">
                        Configurar a quantidade de horários disponíveis para seleção pelos docentes.
                      </div>
                    </div>
                  </button>

                  <button 
                    className="transaction-item2" 
                    onClick={handleAbrirDataLimite}
                    aria-label="Data Limite"
                  >
                    <div className="frame-19">
                      <img className="pencil" src="pencil0.svg" alt="Ícone de edição" />
                    </div>
                    <div className="frame-34">
                      <div className="editar-disciplinas">Data Limite</div>
                      <div className="edi-o-das-disciplinas-para-o-semestre-vigente">
                        Definir o prazo para ajustes de disciplinas e envio de comentários pelos docentes.
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="configurar-disciplinas">Configurar Restrições</div>
        <Footer />
      </div>
      <SideBar />

      {/* Popup - Restrição de Horário */}
      {showRestricaoPopup && (
        <div className="popup-overlay">
          <div className="popup-periodo-container">
            <div className="popup-periodo-header">
              <img className="popup-periodo-icon" src="plus-circle0.svg" alt="Ícone adicionar"/>
              <div className="popup-periodo-title">Restrição de Horário</div>
            </div>
            
            <div className="popup-periodo-body">
              <div className="popup-periodo-content">
                <div className="popup-text-input-field">
                  <div className="popup-label">Restrição:</div>
                  <div className="popup-text-input" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <input
                      type="number"
                      value={minSlotsDisponiveis}
                      onChange={(e) => {
                        let value = e.target.value;

                        // Limita a no máximo 2 dígitos
                        if (value.length > 2) {
                          value = value.slice(0, 2);
                        }

                        // Garante que seja número >= 0
                        value = Math.max(0, Number(value));

                        setMinSlotsDisponiveis(value);
                      }}
                      className="popup-input-text"
                      placeholder={minSlotsDisponiveis || "Digite o valor da restrição"}
                      min="0"
                    />
                  </div>
                </div>

                <div className="popup-label" style={{ marginTop: '10px' }}>
                  Horários disponíveis para seleção pelos docentes: <strong>{maxIndisponiveis}</strong> 
                </div>
              </div>
              
              <div className="popup-periodo-actions">
                <button 
                  className="popup-button-cancel"
                  onClick={() => setShowRestricaoPopup(false)}
                >
                  <div className="popup-button-label">Cancelar</div>
                  <img className="popup-x-icon" src="x0.svg" alt="Cancelar"/>
                </button>
                
                <button 
                  className="popup-button-confirm"
                  onClick={handleSalvarRestricao}
                >
                  <div className="popup-button-label">Salvar</div>
                  <img className="popup-check-icon" src="check0.svg" alt="Confirmar"/>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup - Data Limite */}
      {showDataLimitePopup && (
        <div className="popup-overlay">
          <div className="popup-periodo-container">
            <div className="popup-periodo-header">
              <img className="popup-periodo-icon" src="plus-circle0.svg" alt="Ícone adicionar"/>
              <div className="popup-periodo-title">Configurar Data Limite</div>
            </div>
            
            <div className="popup-periodo-body">
              <div className="popup-periodo-content">
                <div className="popup-text-input-field">
                  <div className="popup-label">Data Limite</div>
                  <div className="popup-text-input">
                    <input
                      type="text"
                      value={dataLimite}
                      onChange={(e) => handleDataLimiteChange(e.target.value)}
                      placeholder="dd/mm/aaaa"
                      className="popup-input-text"
                      maxLength={10}
                    />
                  </div>
                  <div className="popup-label" style={{ marginTop: '10px' }}>
                    A última data limite registrada é: {ultimaDataLimite || 'não registrada'}
                  </div>
                </div>
              </div>
              
              <div className="popup-periodo-actions">
                <button 
                  className="popup-button-cancel"
                  onClick={() => setShowDataLimitePopup(false)}
                  disabled={isLoading}
                >
                  <div className="popup-button-label">Cancelar</div>
                  <img className="popup-x-icon" src="x0.svg" alt="Cancelar"/>
                </button>
                
                <button 
                  className="popup-button-confirm"
                  onClick={handleSalvarDataLimite}
                  disabled={isLoading}
                >
                  <div className="popup-button-label">
                    {isLoading ? 'Salvando...' : 'Salvar'}
                  </div>
                  {!isLoading && <img className="popup-check-icon" src="check0.svg" alt="Confirmar"/>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConfigurarRestricoes;