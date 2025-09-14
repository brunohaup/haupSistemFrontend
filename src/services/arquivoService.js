import api from "./baseApi.js"

export default {

  async carregar(id) {
    const response = await api.get("/arquivo/carregar/" + id)
    return response.data
  },

  async download(id) {
    const response = await api.get("/arquivo/download/" + id)
    return response.data
  },

  async imagem(id) {
    const response = await api.get("/arquivo/imagem/" + id)
    return response.data
  },

}
