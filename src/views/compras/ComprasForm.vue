<template>
  <v-container>
    <v-form @submit.prevent="salvarCompra">
      <v-text-field v-model="compra.fornecedor" label="Fornecedor" variant="outlined"></v-text-field>
      <v-text-field v-model="compra.valor" type="number" label="Valor Total" variant="outlined"></v-text-field>
      <v-btn @click="cancelarPedido()" color="primary" variant="outlined" style="margin-right: 10px;">Cancelar</v-btn>
      <v-btn type="submit" color="primary">Salvar</v-btn>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import comprasService from '../../services/comprasService';

const router = useRouter();
const compra = ref({});

async function salvarCompra() {
  await comprasService.criarCompra(compra.value);
  router.push({ name: 'Compras' });
}

function cancelarPedido(){
    router.push({ name: 'Compras' });
}
</script>
