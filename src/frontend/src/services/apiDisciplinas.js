import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/disciplinas'
});

export const listarTodas = () => api.get('/');
export const criarDisciplina = (dados) => api.post('/', dados);
export const atualizarDisciplina = (id, dados) => api.put(`/${id}`, dados);

export const selecionarDisciplinasParaPeriodo = (periodo, disciplinasIds) => 
  api.post(`/${periodo}/selecionar`, { disciplinasIds });

export const listarDisciplinasAtivas = () => 
  api.get('/ativas'); 
