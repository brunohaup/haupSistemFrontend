import axios from 'axios';

const baseApi = axios.create({
  baseURL: 'https://haupsistem.onrender.com',
});

// Interceptor para adicionar o token a cada requisição
baseApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Já no formato Bearer
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor para capturar erros globais
baseApi.interceptors.response.use(
  (response) => response, // se sucesso, só retorna
  (error) => {
    
    if (error.response && error.response.status === 401) {
      // Remove token inválido
      localStorage.removeItem('token');

      // Redireciona para login (se estiver no navegador)
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default baseApi;
