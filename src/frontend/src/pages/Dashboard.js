import SideBar from '../components/Sidebar';
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
          </div>
        </div>

        {/* Área de conteúdo ajustável (nova adição) */}
        <div className="content-area">
          {/* Conteúdo dinâmico aqui */}
          
        </div>

        <Footer />
      </div>
      {/* Sidebar */}
      <SideBar />
    </div>
  );
}

export default DashboardPage;

