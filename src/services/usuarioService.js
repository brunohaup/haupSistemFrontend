import api from './baseApi.js';


export default {
  async listar() {
    const response = await api.get('/usuario/listar');
    return response.data;
  },
  async carregar(id) {
    const response = await api.get('/usuario/carregar/'+id);
    return response.data;
  },
  async criarNovo(dto) {
    const response = await api.post('/usuario', dto);
    return response.data;
  },
};