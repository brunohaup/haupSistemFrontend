<script setup>
import { ref } from 'vue'

const arrayTarefas = ref([
  {titulo: 'Modulo de usuários', texto: 'Implementar sistema de permissões'},
  {titulo: 'Modulo de compras', texto: 'Implementar tudo do zero'},
  {titulo: 'backend', texto:'metodo authenticated() do UsuarioService com erro: Cannot invoke "com.haupsystem.security.UserSpringSecurity.getId()" because "usuarioLogado" is null'},
]);

function tempoRestanteToken() {
  const token = localStorage.getItem('token');

  if (!token) return 0;

  try {
    const decoded = decodeToken(token);
    if (!decoded.exp) return 0;
    const agora = Date.now() / 1000; // em segundos
    const tempoRestante = decoded.exp - agora;
    return tempoRestante > 0 ? tempoRestante : 0; // se já expirou, retorna 0
  } catch (error) {
    console.error('Token inválido:', error);
    return 0;
  }
}

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

</script>

<template>
  Tempo da sessao: {{ tempoRestanteToken() }}
  <div style="display: flex; flex-wrap: wrap; justify-content: flex-start; padding: 10px;">
    <v-card v-for="tarefa in arrayTarefas" max-width="344" hover style="margin: 10px;">
      <v-card-item>
        <v-card-title>
          {{ tarefa.titulo }}
        </v-card-title>
      </v-card-item>
      <v-card-text>
        {{ tarefa.texto }}
      </v-card-text>
    </v-card>
  </div>
</template>