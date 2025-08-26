import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import SideBar from '../components/Sidebar';
import Footer from '../components/Footer';
import './NovoPeriodo.css';
import { criarPeriodo } from '../services/apiPeriodo';

function NovoPeriodo() {
  const [showPopup, setShowPopup] = useState(false);
  const [periodo, setPeriodo] = useState('');
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

  // Função modificada para integrar com o backend
  const handleAddPeriodo = async () => {
    if (!/^\d{4}\/[12]$/.test(periodo)) {
      toast.warning('Formato inválido! Use AAAA/S (Ex: 2025/1 ou 2026/2)');
      return;
    }

    try {
      // Chamada à API
      await criarPeriodo(periodo);
      toast.success(`Período ${periodo} criado com sucesso!`);
      setPeriodo('');
      setShowPopup(false);
    } catch (error) {
      toast.error(`Erro ao criar período: ${error.response?.data?.error || error.message}`);
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
          <div className="frame-2333">
            <button 
              className="transaction-item" 
              onClick={() => setShowPopup(true)}
              aria-label="Adicionar Novo Período"
            >
              <div className="frame-19">
                <img className="plus" src="plus0.svg" alt="Ícone de adição" />
              </div>
              <div className="frame-34">
                <div className="adicionar-disciplinas">Adicionar Novo Período</div>
                <div className="inclus-o-de-novas-disciplinas-para-o-semestre-vigente">
                  Inclusão de um novo período para o semestre atual.
                </div>
              </div>
            </button>
          </div>  
        </div>

        <div className="configurar-disciplinas">Novo Periodo</div>

        <Footer />
      </div>
      <SideBar />

      {/* Pop-up */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-periodo-container">
            <div className="popup-periodo-header">
              <img className="popup-periodo-icon" src="plus-circle0.svg" alt="Ícone adicionar"/>
              <div className="popup-periodo-title">Adicionar Novo Período</div>
            </div>
            
            <div className="popup-periodo-body">
              <div className="popup-periodo-content">
                <div className="popup-text-input-field">
                  <div className="popup-label">Período</div>
                  <div className="popup-text-input">
                    <input
                      type="text"
                      value={periodo}
                      onChange={(e) => setPeriodo(e.target.value)}
                      placeholder="aaaa/s"
                      className="popup-input-text"
                    />
                  </div>
                </div>
              </div>
              
              <div className="popup-periodo-actions">
                <button 
                  className="popup-button-cancel"
                  onClick={() => setShowPopup(false)}
                >
                  <div className="popup-button-label">Cancelar</div>
                  <img className="popup-x-icon" src="x0.svg" alt="Cancelar"/>
                </button>
                
                <button 
                  className="popup-button-confirm"
                  onClick={handleAddPeriodo}
                >
                  <div className="popup-button-label">Adicionar</div>
                  <img className="popup-check-icon" src="check0.svg" alt="Confirmar"/>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NovoPeriodo;