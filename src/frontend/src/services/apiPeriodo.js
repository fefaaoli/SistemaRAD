import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`, 
});

export const criarPeriodo = (periodo) => {
  return api.post('/admin/periodos', { 
    periodo,
    dataLimite: '31/12/2025' // Data padrão (pode ser ajustada depois)
  });
};

export const definirDataLimite = (periodo, dataLimite) => {
  return api.put('/admin/config/prazos', { 
    periodo,
    dataLimite // Formato DD/MM/AAAA
  });
};

