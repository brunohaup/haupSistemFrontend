<template>
  <v-container>
    <v-btn color="primary" @click="novaCompra">Nova Compra</v-btn>
    <v-table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Fornecedor</th>
          <th>Data</th>
          <th>Valor Total</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="compra in compras" :key="compra.id">
          <td>{{ compra.id }}</td>
          <td>{{ compra.fornecedor }}</td>
          <td>{{ compra.data }}</td>
          <td>{{ compra.valor }}</td>
          <td>
            <v-btn icon="mdi-pencil" @click="editarCompra(compra.id)"></v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import comprasService from '../../services/comprasService';

const router = useRouter();
const compras = ref([]);

function novaCompra() {
  router.push({ name: 'NovaCompra' });
}

function editarCompra(id) {
  router.push(`/compras/${id}/editar`);
}

onMounted(async () => {
  compras.value = await comprasService.listarCompras();
});
</script>
