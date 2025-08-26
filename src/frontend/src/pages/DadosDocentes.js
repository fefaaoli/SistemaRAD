import React, { useEffect, useState } from 'react';
import SideBar from '../components/Sidebar';
import Footer from '../components/Footer';
import DAltDocentes from '../components/DAltDocentes';
import './ConfigurarDisciplinas.css';

function DadosDocentes() {
  const [periodoAtual, setPeriodoAtual] = useState('Carregando...');
  const [nome, setNome] = useState('Carregando...');
  const [perfil, setPerfil] = useState('Carregando...');

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

    async function fetchUsuario() {
      try {
        const token = localStorage.getItem('token'); // pega o token do login

        const response = await fetch('http://localhost:5000/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`, // manda o token no header
          }
        });

        if (!response.ok) throw new Error('Erro ao buscar usuário');
        const data = await response.json();

        // Pega só os dois primeiros nomes
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
          <div class="frame-2318config">
            <div class="frame-config">
              <div class="tabconfig">
                <div class="tab-labelconfig">Dados Docentes</div>
              </div>
            </div>
        </div>
      </div>

        <div className="configurar-disciplinas">Dados Docentes</div>

        <DAltDocentes />

        <Footer />
      </div>
      <SideBar />
    </div>
  );
}

export default DadosDocentes;