<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const drawer = ref(true)
const rail = ref(false)
const router = useRouter()
const usuarioLogado = ref({});

onMounted(() => {
  const token = localStorage.getItem('token');
  if (token) {
    const dados = decodeToken(token);
    usuarioLogado.value = dados;
  }
});

function decodeToken(token) {
  try {
    const payloadBase64 = token.split('.')[1];
    const payloadDecoded = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(payloadDecoded);
  } catch (e) {
    console.error("Token inválido", e);
    return null;
  }
}

function logout() {
  localStorage.removeItem('token')
  router.push('/')
  window.reload;
}
</script>

<template>
  <v-layout>
    <!-- Menu lateral -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      app
    >
      <!-- Cabeçalho do menu -->
      <v-list>
        <v-list-item
          prepend-icon="mdi-account-circle"
          :title="usuarioLogado.sub"
          @click.stop="rail = !rail"
        >
          <template v-slot:append>
            <v-btn
              icon="mdi-chevron-left"
              variant="text"
              @click.stop="rail = !rail"
            ></v-btn>
          </template>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>
      
      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-home"
          title="Home"
          to="/home"
          link
        />

        <v-list-item
          prepend-icon="mdi-cart-outline"
          title="Compras"
          to="/compra"
          link
        />
        <v-list-item
          prepend-icon="mdi-account-group"
          title="Usuários"
          to="/usuarios"
          link
        />
        <v-list-item
          prepend-icon="mdi-logout"
          title="Sair"
          to="/"
          @click="logout"
        />
      </v-list>
    </v-navigation-drawer>

    <!-- Área principal -->
    <v-main >
      <router-view />
    </v-main>
  </v-layout>
</template>