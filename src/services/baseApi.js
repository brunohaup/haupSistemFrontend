import axios from 'axios';

const baseApi = axios.create({
  baseURL: 'http://localhost:8080',
});

// Interceptor para adicionar o token a cada requisição
baseApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default baseApi;