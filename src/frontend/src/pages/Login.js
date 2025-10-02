// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { toast } from "react-toastify";
import Footer from '../components/Footer'; 
import './Login.css';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate(); 

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        navigate('/dashboard');
      } else {
        toast.error(data.message || 'Email ou senha incorretos');
      }
    } catch (error) {
      toast.error('Erro de conexão com o servidor');
      console.error('Erro no login:', error);
    }
  };

  return (
    <div className="frame-2304">
      <div className="frame-2323">
        <div className="grid">
          <div className="frame-2324">
            <div className="heading-h-1">
              Sistema de Geração e Gerenciamento de Horários de Aulas
            </div>
            <div className="paragraph">
              Plataforma online para organização e otimização do horário de
              disciplinas do Departamento de Administração da FEARP-USP.
            </div>
          </div>
        </div>
        <div className="modal">
          <div className="image">
            <img className="image-6-2" src="image-6-20.png" alt="Imagem 1" />
            <img className="image-6-22" src="image-6-21.png" alt="Imagem 2" />
            <img className="image-6-23" src="image-6-22.png" alt="Imagem 3" />
          </div>
          <div className="frame-2305">
            <div className="text-input-field">
              <div className="label">Usuário</div>
              <div className="text-input">
                <img className="user-circle" src="user-circle0.svg" alt="Ícone de usuário" />
                <input
                  className="input-text"
                  type="text"
                  placeholder="user@usp.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="text-input-field">
              <div className="label">Senha</div>
              <div className="text-input">
                <img className="finger-print" src="finger-print0.svg" alt="Ícone de impressão digital" />
                <input
                  className="input-text"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
                <img
                  className="eye-off"
                  src="eye-off0.svg"
                  alt="Ícone de olho"
                  onClick={togglePasswordVisibility}
                />
              </div>
            </div>
          </div>
          <div className="frame-29">
            <div className="button" onClick={handleLogin} style={{ cursor: 'pointer' }}>
              <div className="button-label">Entrar</div>
              <img className="arrow-sm-right" src="arrow-sm-right0.svg" alt="Seta para a direita" />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Login;