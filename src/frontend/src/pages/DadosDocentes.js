import SideBar from '../components/Sidebar';
import Footer from '../components/Footer';
import DAltDocentes from '../components/DAltDocentes';
import './ConfigurarDisciplinas.css';

function DadosDocentes() {

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
          <div class="frame-2318config">
            <div class="frame-config">
              <div class="tabconfig">
                <div class="tab-labelconfig">Dados Docentes</div>
              </div>
            </div>
        </div>
      </div>

        <div className="configurar-disciplinas">Dados Docentes</div>

        <DAltDocentes />

        <Footer />
      </div>
      <SideBar />
    </div>
  );
}

export default DadosDocentes;