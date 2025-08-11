<script setup>
import api from '../services/baseApi.js';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const username = ref(null);
const password = ref(null);
const loading = ref(false);
const loginFormRef = ref(null);

const usernameRules = [
  v => !!v || 'O usuário é obrigatório',
  v => v.length >= 3 || 'O usuário deve ter pelo menos 3 caracteres'
];
const passwordRules = [
  v => !!v || 'A senha é obrigatória',
  v => v.length >= 6 || 'A senha deve ter pelo menos 6 caracteres'
];

    
    /*const response = await api.post('/login', {
        username: username.value,
        password: password.value
    });

    console.log('Token:', response.data.token);
    
    */

async function login() {
  loading.value = true
  const valid = await loginFormRef.value.validate();
  if (valid.valid) {
    const response = await api.post('/login', {
        username: username.value,
        password: password.value
    });
    if(response.status === 200){
      localStorage.setItem('token', response.headers.authorization);
      router.push('/usuarios'); // redireciona para a listagem
    }
    
    loading.value = false;
  } else {
    loading.value = false;
  } 
}
  
</script>

<template>
  <div class="login-background">
    <v-form ref="loginFormRef" @submit.prevent="login">
      <v-card
        elevation="8"
        width="400"
      >
        <v-card-item>
          <v-card-title>
            Login
          </v-card-title>
        </v-card-item>

        <v-card-text style="padding-bottom: 0px; padding-top: 8px;">
          <div>
            <v-text-field
              label="Usuário"
              variant="outlined"
              v-model="username"
              :rules="usernameRules"
              prepend-inner-icon="mdi-account"
            ></v-text-field>

            <v-text-field
              label="Senha"
              variant="outlined"
              type="password"
              v-model="password"
              :rules="passwordRules"
              prepend-inner-icon="mdi-lock"
            ></v-text-field>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-btn
            type="submit"
            style="width: 100%; color: white; background: orange;"
            :loading="loading"
          >
            <v-icon left>mdi-login</v-icon>
            Entrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>

<style scoped>
.login-background {
  background-image: url('/public/5137894.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>