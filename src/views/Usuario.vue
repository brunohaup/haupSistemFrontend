<script setup>
import api from '../services/api';

export default {
  data() {
    return {
      usuario: []
    };
  },
  async mounted() {
    const token = localStorage.getItem('token');
    const response = await api.get('/usuarios', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    this.usuarios = response.data;
  }
};
</script>

<template>
  <div>
    <h1>Lista de Usuários</h1>
    <ul>
      <li v-for="user in usuarios" :key="user.id">{{ user.nome }}</li>
    </ul>
  </div>
</template>