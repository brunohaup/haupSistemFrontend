<template>
  <v-container>
    <v-btn class="btnPrimary" @click="novaCompra">Nova Compra</v-btn>
    <v-table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Etapa</th>
          <th>Descrição</th>
          <th>Data inclusão</th>
          <th>Solicitante</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="compra in compras" :key="compra.id">
          <td>{{ compra.id }}</td>
          <td>{{ compra.etapa }}</td>
          <td>{{ compra.descricao }}</td>
          <td>{{ converterTimestampParaData(compra.dataHoraInclusao) }}</td>
          <td>{{ compra.solicitante.nome }}</td>
          <td>
            
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

function converterTimestampParaData(timestamp) {
  const data = new Date(timestamp);
  return data.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

function editarCompra(id) {
  router.push(`/compras/${id}/editar`);
}

onMounted(async () => {
  compras.value = await comprasService.listarCompras();
});
</script>
