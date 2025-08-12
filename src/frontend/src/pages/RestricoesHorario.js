import React, { useEffect, useState } from 'react';
import SideBar from '../components/Sidebar';
import Footer from '../components/Footer';
import Horario from '../components/HorarioD';
import './ConfigurarDisciplinas.css';

function RestricoesHorario() {
  const [periodoAtual, setPeriodoAtual] = useState('Carregando...');

  useEffect(() => {
    async function fetchPeriodo() {
      try {
        const response = await fetch('http://localhost:5000/api/admin/horarios/periodo-recente');
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

    fetchPeriodo();
  }, []);

  return (
    <div className="frame-2315">
      <div className="frame-2304">
        <div className="frame-2322">
          <div className="frame-2319">
            <img className="mask-group" src="mask-group0.svg" alt="logo" />
            <div className="top-navigation-bar">
              <div className="ol-carlos-silva">Olá, Carlos Silva.</div>
              <div className="frame-2320">
                <div className="perfil-de-administrador">Perfil de Administrador</div>
                <div className="per-odo-letivo-atual-2025-01">
                  Período Letivo Atual: {periodoAtual}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="content-area">
          <div class="frame-2318config">
            <div class="frame-config">
              <div class="tabconfig">
                <div class="tab-labelconfig">Seleção de Horários</div>
              </div>
            </div>
        </div>
      </div>

        <div className="configurar-disciplinas">Restrições de Horário</div>

        <Horario />

        <Footer />
      </div>
      <SideBar />
    </div>
  );
}

export default RestricoesHorario;