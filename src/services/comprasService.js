import api from "./baseApi.js"

export default {
  async criarCompra(compra) {
    const response = await api.post("/compra/criarCompra", compra)
    return response.data
  },

  async listarCompras() {
    const response = await api.get("/compra")
    return response.data
  },

  async listarComprasPaginadas(params) {
    const response = await api.get("/compra/paginado", { params })
    return response.data
  },

  async carregar(id) {
    const response = await api.get("/compra/carregar/" + id)
    return response.data
  },

  async avancarEtapa(dto) {
    const response = await api.post("/compra/avancarEtapa", dto);
    return response.data
  },

  async salvar(dto) {
    const response = await api.post("/compra/salvar", dto);
    return response.data
  },

}
