import api from './baseApi.js';


export default {
  async listarCompras() {
    const response = await api.get('/compras');
    return response.data;
  },
  async criarCompra(compra) {
    return api.post('/compras', compra);
  }
};