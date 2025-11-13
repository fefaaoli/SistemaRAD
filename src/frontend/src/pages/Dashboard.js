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
                  {/* O dropdown é renderizado aqui */}
                  <select value={periodoSelecionado} onChange={handlePeriodoChange} style={{ marginLeft: '8px', border: '1px solid #ccc', borderRadius: '6px', padding: '4px', color: 'var(--neutral-600, #6c757d)', fontFamily: 'var(--h3-font-family, "Inter-Bold", sans-serif)' }}>
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
                </div>

              </div>
            </div>
          </div>
        </div>

        <div className="content-area">
                  <p style={{
                    padding: '50px 20px',
                    textAlign: 'center',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    color: 'var(--neutral-600, #6c757d)',
                    fontFamily: 'var(--h3-font-family, "Inter-Bold", sans-serif)'
                  }}>
                    Bem vindo! Este é o sistema de gerenciamento de horários do Departamento de Administração (RAD) da FEA-RP.
                  </p>
        </div>

        <Footer />
      </div>

      <SideBar />
    </div>
  );
}

export default DashboardPage;