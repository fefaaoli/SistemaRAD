import { useNavigate } from 'react-router-dom';
import './GerenciarDisciplinas.css';

function GerenciarDisciplinas() {
  const navigate = useNavigate();

  return (
    <div className="frame-48">
      <div className="frame-41">
        <div className="frame-44">
          <div className="frame-2333">
            {/* Botão 1: Adicionar Disciplinas */}
            <button 
              className="transaction-item" 
              onClick={() => navigate('/adicionar-disciplinas')} // Redireciona
              aria-label="Adicionar Disciplinas"
            >
              <div className="frame-19">
                <img className="plus" src="plus0.svg" alt="Ícone de adição" />
              </div>
              <div className="frame-34">
                <div className="adicionar-disciplinas">Adicionar Disciplinas</div>
                <div className="inclus-o-de-novas-disciplinas-para-o-semestre-vigente">
                  Inclusão de novas disciplinas para o semestre vigente.
                </div>
              </div>
            </button>

            {/* Botão 2: Editar Disciplinas */}
            <button 
              className="transaction-item2" 
              onClick={() => navigate('/editar-disciplinas')} // Redireciona
              aria-label="Editar Disciplinas"
            >
              <div className="frame-19">
                <img className="pencil" src="pencil0.svg" alt="Ícone de edição" />
              </div>
              <div className="frame-34">
                <div className="editar-disciplinas">Editar Disciplinas</div>
                <div className="edi-o-das-disciplinas-para-o-semestre-vigente">
                  Edição das disciplinas para o semestre vigente.
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GerenciarDisciplinas;