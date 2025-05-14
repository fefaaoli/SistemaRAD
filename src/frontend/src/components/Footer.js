// src/components/Footer.js
import './Footer.css'; // Para o estilo do rodapé

function Footer() {
  return (
    <div className="frame-55">
      <div className="footer-logo">
        <img src="/LOGOCINZA.png" alt="Letra 1" />
      </div>
      <div className="footer-text">
        <span>
          <span className="footer-text-span">
            Todos os Direitos Reservados © 2025 | Departamento de Administração
            FEARP-USP
          </span>
          <span className="footer-text-span2"> | Termos e Condições</span>
          <span className="footer-text-span"> | </span>
          <span className="footer-text-span2">Políticas de Privacidade</span>
        </span>
      </div>
    </div>
  );
}

export default Footer;