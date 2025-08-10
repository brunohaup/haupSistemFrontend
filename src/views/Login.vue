<script setup>
import api from '../services/baseApi.js';
import { ref } from 'vue';

const username = ref(null);
const password = ref(null);

function login() {

    console.log("AAAAAAAAAAAAAAA");
    
    /*const response = await api.post('/login', {
        username: username.value,
        password: password.value
    });

    console.log('Token:', response.data.token);
    localStorage.setItem('token', response.data.token);
    this.$router.push('/usuarios'); // redireciona para a listagem
    */
}
  
</script>

<template>
  <div>
    <h1>Login</h1>

    <v-btn color="primary" @click="login()">
      <v-icon left>mdi-login</v-icon>
      Entrar
    </v-btn>

  </div>
</template>