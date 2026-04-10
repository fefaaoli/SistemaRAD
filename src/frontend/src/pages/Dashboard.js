import React, { useEffect, useState } from 'react';
import { usePeriodo } from '../context/PeriodoContext';
import SideBar from '../components/Sidebar';
import Footer from '../components/Footer';
import './Dashboard.css';

function DashboardPage() {
  const { periodoSelecionado, setPeriodoSelecionado } = usePeriodo(); 
  const [periodos, setPeriodos] = useState([]);

  const [nome, setNome] = useState('Carregando...');
  const [perfil, setPerfil] = useState('Carregando...');

  useEffect(() => {
    async function fetchTodosPeriodos() {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/admin/horarios/periodos`);
        if (!response.ok) throw new Error('Erro ao buscar lista de períodos');
        
        const data = await response.json();
        setPeriodos(data);

        // Se o período global ainda não foi definido, define o primeiro da lista como padrão
        if (data && data.length > 0) {
          setPeriodoSelecionado(data[0]);
        }
      } catch (error) {
        console.error('Erro ao buscar períodos:', error);
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

    fetchTodosPeriodos(); 
    fetchUsuario();
  }, [setPeriodoSelecionado]);

  const handlePeriodoChange = (event) => {
      setPeriodoSelecionado(event.target.value); 
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
                Período Letivo:
                {/* Container do dropdown personalizado */}
                <div className="custom-select-wrapper" style={{ marginLeft: '8px', display: 'inline-block' }}>
                  <select 
                    value={periodoSelecionado} 
                    onChange={handlePeriodoChange} 
                    className="modern-select"
                  >
                    {periodos.length > 0 ? (
                      periodos.map((periodo) => (
                        <option key={periodo} value={periodo}>
                          {periodo}
                        </option>
                      ))
                    ) : (
                      <option>Carregando...</option>
                    )}
                  </select>
                  <div className="select-arrow">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

              </div>
            </div>
          </div>
        </div>

        <div className="content-area desk-welcome-container">
          <div className="desk-welcome-card">
            <div className="desk-welcome-illustration">
              <img 
                src="/LOGOCINZA.png" 
                alt="Logo RAD FEA-RP" 
                className="welcome-logo-img" 
              />
            </div>
            <div className="desk-welcome-content">
              <h2 className="desk-subtitle">Bem Vindo ao Sistema de Gerenciamento de Horários</h2>
              <div className="desk-divider"></div>
              <p className="desk-institution">
                 Departamento de Administração (RAD) <span className="desk-sep">|</span> FEA-RP
              </p>
            </div>
          </div>
        </div>

        <Footer />
      </div>

      <SideBar />
    </div>
  );
}

export default DashboardPage;