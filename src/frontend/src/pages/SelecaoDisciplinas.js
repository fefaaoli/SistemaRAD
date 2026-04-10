import React, { useEffect, useState } from 'react';
import SideBar from '../components/Sidebar';
import Footer from '../components/Footer';
import DDisciplinas from '../components/DDisciplinas'; 
import MinhasDisciplinas from '../components/MinhasDisciplinas';
import './ConfigurarDisciplinas.css'; 

function SelecaoDisciplinas() {
  // Estado para controlar as abas (inicia na aba de seleção)
  const [abaAtiva, setAbaAtiva] = useState('selecao');
  
  // Estados de dados do usuário
  const [periodoAtual, setPeriodoAtual] = useState('Carregando...');
  const [nome, setNome] = useState('Carregando...');
  const [perfil, setPerfil] = useState('Carregando...');

  useEffect(() => {
    async function fetchPeriodo() {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/horarios/periodo-recente`);
        if (!response.ok) throw new Error('Erro ao buscar período');
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
          headers: { 'Authorization': `Bearer ${token}` }
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

  return (
    <div className="frame-2315">
      <div className="frame-2304">
        {/* Header / Top Navigation */}
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
          {/* AQUI ESTÁ A ESTRUTURA DE ABAS IDÊNTICA AO CONFIGURARDISCIPLINAS */}
          <div className="frame-2318">
            <div className="frame-32">
              <button 
                className={`tab ${abaAtiva === 'selecao' ? 'active' : ''}`}
                onClick={() => setAbaAtiva('selecao')}
              >
                <div className="tab-label">Seleção de Disciplinas</div>
              </button>
              <button 
                className={`tab2 ${abaAtiva === 'minhas' ? 'active' : ''}`}
                onClick={() => setAbaAtiva('minhas')}
              >
                <div className="tab-label2">Minhas Disciplinas</div>
              </button>
            </div>
          </div>
          
          {/* Conteúdo dinâmico (Renderiza o componente com base na aba) */}
          <div className="conteudo-dinamico">
            {abaAtiva === 'selecao' && <DDisciplinas />}
            {abaAtiva === 'minhas' && <MinhasDisciplinas />}
          </div>
        </div>

        {/* Título da página no rodapé do conteúdo, conforme layout original */}
        <div className="configurar-disciplinas">Seleção de Disciplinas</div>

        <Footer />
      </div>
      <SideBar />
    </div>
  );
}

export default SelecaoDisciplinas;