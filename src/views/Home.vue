<script setup>
import { ref } from 'vue'

const arrayTarefas = ref([
  {titulo: 'Modulo de compras', texto: 'Implementar tudo do zero'},
]);


</script>

<template>
  <div style="display: flex; flex-wrap: wrap; justify-content: flex-start; padding: 10px;">
    <v-card v-for="tarefa in arrayTarefas" max-width="344" hover>
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