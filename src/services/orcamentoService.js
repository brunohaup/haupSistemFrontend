import api from "./baseApi.js"

export default {
  async listarOrcamentosPorItem(itemId) {
    const response = await api.get(`/orcamento/item/${itemId}`)
    return response.data
  },

  async adicionarOrcamento(orcamento) {
    const response = await api.post("/orcamento", orcamento)
    return response.data
  },

  async atualizarOrcamento(id, orcamento) {
    const response = await api.put(`/orcamento/${id}`, orcamento)
    return response.data
  },

  async removerOrcamento(id) {
    const response = await api.delete(`/orcamento/${id}`)
    return response.data
  },

  async obterComparativo(idCompra) {
    const response = await api.get(`/orcamento/comparativo/${idCompra}`)
    return response.data
  },
}
