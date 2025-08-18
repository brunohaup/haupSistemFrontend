<script setup>
import api from '../services/baseApi.js';
import { ref, onMounted } from 'vue';
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



function isTokenValid() {
  const token = localStorage.getItem('token');
  if (!token) return false;
  try {
    const dados = decodeToken(token);
    return Date.now() < dados.exp * 1000; // exp é em segundos
  } catch {
    return false;
  }
}

function decodeToken(token) {
  try {
    const payloadBase64 = token.split('.')[1];
    const payloadDecoded = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    console.log(payloadDecoded);
    
    return JSON.parse(payloadDecoded);
  } catch (e) {
    console.error("Token inválido", e);
    return null;
  }
}


onMounted(() => {
  if(!isTokenValid()){
    //localStorage.removeItem('token');
  }else{
    router.push('/home');
  }
});

async function login() {
  loading.value = true
  const valid = await loginFormRef.value.validate();
  if (valid.valid) {
    const response = await api.post('/login', {
        username: username.value,
        password: password.value
    });
    if(response.status === 200){
      
      const token = response.headers.authorization.split(" ");
      localStorage.setItem('token', token[1]);
      router.push('/home');
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