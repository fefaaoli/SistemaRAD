import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/disciplinas'
});

export const listarTodas = () => api.get('/');
export const criarDisciplina = (dados) => api.post('/', dados);
export const atualizarDisciplina = (id, dados) => api.put(`/${id}`, dados);
export const ativarParaPeriodo = (periodo, id) => api.post(`/${periodo}/ativar/${id}`);