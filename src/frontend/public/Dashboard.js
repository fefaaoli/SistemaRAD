import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import './Dashboard.css';

function DashboardPage() {
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
            <div className="frame-2318">
              <div className="frame-32">
                <div className="tab">
                  <div className="tab-label">Selecionar Disciplinas</div>
                </div>
                <div className="tab2">
                  <div className="tab-label2">Gerenciar Disciplinas</div>
                </div>
              </div>
            </div>
            <div className="configurar-disciplinas">Configurar Disciplinas</div>
          </div>
        </div>
      <Footer />
      </div>

      <div className="side-navigation-bar">
        <div className="frame-23">
          <div className="button">
            <img className="user-circle" src="user-circle0.svg" alt="Usuário 1" />
          </div>
          <div className="button">
            <img className="user-circle2" src="user-circle1.svg" alt="Usuário 2" />
          </div>
          <div className="button">
            <img className="user-circle3" src="user-circle2.svg" alt="Usuário 3" />
          </div>
        </div>
        <div className="frame-25">
          <img className="mask-group2" src="mask-group1.svg" alt="Logo lateral" />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;

