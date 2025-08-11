<script setup>
import api from '../services/baseApi.js';
import { ref, onMounted } from 'vue';

onMounted ( async () => {
  const token = localStorage.getItem('token');
  console.log("ss", token);
  
  const response = await api.get('/usuario/1', {
    headers: {
      Authorization: token
    }
  });
  console.log("kkkk",response);
})

</script>

<template>
  <div>
    <h1>Lista de Usuários</h1>
  </div>
</template>