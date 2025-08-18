import api from './baseApi.js';


export default {
  async criarCompra(compra) {
    const response = await api.post("/compra", compra);
    return response.data;
  },

  async listarCompras() {
    const response = await api.get("/compra");
    return response.data;
  }
};