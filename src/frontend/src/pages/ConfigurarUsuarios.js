import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import SideBar from '../components/Sidebar';
import Footer from '../components/Footer';
import { apiUsuarios } from '../services/apiUsuarios';
import './ConfigurarDisciplinas.css';
import './ConfigurarUsuarios.css';
import AltDocentes from '../components/AltDocentes';

function ConfigurarUsuarios() {
  const [showAddUsuarioPopup, setShowAddUsuarioPopup] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [periodoAtual, setPeriodoAtual] = useState('Carregando...');
  const [nome, setNome] = useState('Carregando...');
  const [perfil, setPerfil] = useState('Carregando...');
  
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
        const token = localStorage.getItem('token'); // pega o token do login

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/verify`, {
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

  const [usuario, setUsuario] = useState({
    numeroUSP: '',
    nome: '',
    email: '',
    setor: '',
    funcao: 'Docente',
    senha: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUsuario(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
  try {
    // Validação básica
    if (!usuario.numeroUSP || !usuario.nome || !usuario.email || !usuario.setor) {
      throw new Error('Preencha todos os campos obrigatórios');
    }

    await apiUsuarios.adicionarDocente(usuario);
    
    toast.success('Usuário adicionado com sucesso!');
    
    setUsuario({
      numeroUSP: '',
      nome: '',
      email: '',
      setor: '',
      funcao: 'Docente',
      senha: ''
    });
    
    // Fecha o popup imediatamente (sem esperar 2 segundos como antes)
    setShowAddUsuarioPopup(false);
    
  } catch (error) {
    console.error('Erro ao adicionar usuário:', error);
    toast.error(error.message || 'Erro ao adicionar usuário');
  }}

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
                <div class="tab-labelconfig">Configuração de Usuários</div>
              </div>
            </div>
        </div>

          <div className="frame-48AD">

                <div className="frame-2333AD">
                  <button 
                    className="transaction-item" 
                    onClick={() => setShowAddUsuarioPopup(true)}
                    aria-label="Adicionar Novo Usuário"
                  >
                    <div className="frame-19">
                      <img className="plus" src="plus0.svg" alt="Ícone de adição" />
                    </div>
                    <div className="frame-34">
                      <div className="adicionar-disciplinas">Adicionar Novo Usuário</div>
                      <div className="inclus-o-de-novas-disciplinas-para-o-semestre-vigente">
                        Cadastro de novos usuários no sistema.
                      </div>
                    </div>
                  </button>
                </div>

              <AltDocentes />

          </div>
        </div>

        <div className="configurar-disciplinas">Configurar Usuários</div>

        <Footer />
      </div>
      <SideBar />

      {/* Popup para Adicionar Novo Usuário */}
      {showAddUsuarioPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <div className="popup-header">
              <img className="popup-icon" src="plus-circle0.svg" alt="Ícone adicionar"/>
              <div className="popup-title">Adicionar Novo Usuário</div>
            </div>
            
            <div className="popup-body">
              <form onSubmit={handleSubmit}>
                <div className="popup-content">
                  {error && <div className="popup-error-message">{error}</div>}
                  {success && <div className="popup-success-message">{success}</div>}

                  <div className="popup-input-field">
                    <div className="popup-label">Número USP *</div>
                    <div className="popup-input-wrapperCU">
                      <input
                        type="text"
                        name="numeroUSP"
                        value={usuario.numeroUSP}
                        onChange={handleInputChange}
                        className="popup-input-text"
                        required
                      />
                    </div>
                  </div>

                  <div className="popup-input-field">
                    <div className="popup-label">Nome *</div>
                    <div className="popup-input-wrapperCU">
                      <input
                        type="text"
                        name="nome"
                        value={usuario.nome}
                        onChange={handleInputChange}
                        className="popup-input-text"
                        required
                      />
                    </div>
                  </div>

                  <div className="popup-input-field">
                    <div className="popup-label">E-mail *</div>
                    <div className="popup-input-wrapperCU">
                      <input
                        type="email"
                        name="email"
                        value={usuario.email}
                        onChange={handleInputChange}
                        className="popup-input-text"
                        required
                      />
                    </div>
                  </div>

                  <div className="popup-input-field">
                    <div className="popup-label">Setor *</div>
                    <div className="popup-input-wrapperCU">
                      <input
                        type="text"
                        name="setor"
                        value={usuario.setor}
                        onChange={handleInputChange}
                        className="popup-input-text"
                        required
                      />
                    </div>
                  </div>

                  <div className="popup-input-field">
                    <div className="popup-label">Função *</div>
                    <div className="popup-input-wrapperCU">
                      <select
                        name="funcao"
                        value={usuario.funcao}
                        onChange={handleInputChange}
                        className="popup-input-text"
                        required
                      >
                        <option value="Docente">Docente</option>
                        <option value="Administrador">Administrador</option>
                      </select>
                    </div>
                  </div>

                  <div className="popup-input-field">
                    <div className="popup-label">Senha *</div>
                    <div className="popup-input-wrapperCU">
                      <input
                        type="password"
                        name="senha"
                        value={usuario.senha}
                        onChange={handleInputChange}
                        className="popup-input-text"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="popup-actionsC">
                  <button 
                    type="button"
                    className="popup-button-cancel"
                    onClick={() => {
                      setShowAddUsuarioPopup(false);
                      setError(null);
                      setSuccess(null);
                    }}
                  >
                    <div className="popup-button-label">Cancelar</div>
                    <img className="popup-x-icon" src="x0.svg" alt="Cancelar"/>
                  </button>
                  
                  <button 
                    type="submit"
                    className="popup-button-confirm"
                  >
                    <div className="popup-button-label">Adicionar</div>
                    <img className="popup-check-icon" src="check0.svg" alt="Confirmar"/>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConfigurarUsuarios;