import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '../components/Sidebar';
import Footer from '../components/Footer';
import './ConfigurarDisciplinas.css';
import './ConfigurarUsuarios.css';

function ConfigurarUsuarios() {
  const navigate = useNavigate();
  
  // Estado para controlar o popup
  const [showAddUsuarioPopup, setShowAddUsuarioPopup] = useState(false);
  
  // Estados para o formulário
  const [usuario, setUsuario] = useState({
    nome: '',
    email: '',
    tipo: 'Professor',
    matricula: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUsuario(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para adicionar usuário
    console.log('Novo usuário:', usuario);
    setShowAddUsuarioPopup(false);
  };

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
                  Período Letivo Atual: 2025/01
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
                  {/* Botão 1: Adicionar Novo Usuário (Popup) */}
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

                  {/* Botão 2: Gerenciar Usuários (Redirecionamento) */}
                  <button 
                    className="transaction-item2" 
                    onClick={() => navigate('/gerenciar-usuarios')}
                    aria-label="Gerenciar Usuários"
                  >
                    <div className="frame-19">
                      <img className="pencil" src="pencil0.svg" alt="Ícone de edição" />
                    </div>
                    <div className="frame-34">
                      <div className="editar-disciplinas">Gerenciar Usuários</div>
                      <div className="edi-o-das-disciplinas-para-o-semestre-vigente">
                        Edição e remoção de usuários existentes.
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
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
                  <div className="popup-input-field">
                    <div className="popup-label">Número USP</div>
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
                    <div className="popup-label">Nome</div>
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
                    <div className="popup-label">E-mail</div>
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
                    <div className="popup-label">Matrícula</div>
                    <div className="popup-input-wrapperCU">
                      <input
                        type="text"
                        name="matricula"
                        value={usuario.matricula}
                        onChange={handleInputChange}
                        className="popup-input-text"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="popup-actions">
                  <button 
                    type="button"
                    className="popup-button-cancel"
                    onClick={() => setShowAddUsuarioPopup(false)}
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