<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import comprasService from '../../services/comprasService'
import orcamentoService from '../../services/orcamentoService'

const route = useRoute()
const router = useRouter()

const compra = ref(null)

onMounted(async () => {
  const id = route.query.id
  compra.value = await comprasService.carregar(id)
  
  for (const item of compra.value.itens) {
    item.exibePainelOrcamento = false;
    try {
      item.orcamentos = await orcamentoService.listarOrcamentosPorItem(item.id)
    } catch (error) {
      item.orcamentos = []
    }
  }
  console.log(compra.value);
})

function cancelarPedido() {
  router.push({ name: 'Compras' })
}
</script>

<template>
  <v-container v-if="compra !== null">

    <div style="margin-bottom: 15px; border: 1px solid #ddd; padding: 15px; border-radius: 5px;">

      <strong>Informacoes gerais</strong>

      <v-divider/>

      <div style="display: flex;flex-direction: column;">
        <span>ID</span>
        <span style="margin-bottom: 10px;">{{ compra.id }}</span>

        <span>Etapa</span>
        <span style="margin-bottom: 10px;">{{ compra.etapa }}</span>

        <span>Data e hora da inclusao</span>
        <span style="margin-bottom: 10px;">{{ compra.dataHoraInclusao }}</span>

        <span>Usuario de inclusao</span>
        <span style="margin-bottom: 10px;">{{ compra.solicitanteNome }}</span>
      </div>

    </div>

    <div style="margin-bottom: 30px; border: 1px solid #ddd; padding: 15px; border-radius: 5px;">

      <strong>Itens</strong>

      <v-divider/>

      <div style="margin-top: 10px;">
        <div v-for="item in compra.itens" :key="item.id" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; border-radius: 3px;">
          <div style="flex: 1; border: 1px solid #ddd; padding: 10px; border-radius: 5px;">
            <span>{{ item.nome }}</span><br>
            <small>Quantidade: {{ item.quantidade }}</small>
            <div v-if="item.observacoes" style="margin-top: 5px;">
              <small style="color: #666;">{{ item.observacoes }}</small>
            </div>
            <div @click="item.exibePainelOrcamento = !item.exibePainelOrcamento" style="cursor: pointer; padding: 5px;">
              <v-icon :icon="item.exibePainelOrcamento ? 'mdi-minus-circle-outline' : 'mdi-plus-circle-outline'"></v-icon>
              <span>Orcamentos</span>
              <div v-if="item.exibePainelOrcamento">
                <div v-for="orcamento in item.orcamentos" style="border: 1px solid #ddd; padding: 5px; border-radius: 5px;">
                  <span>{{ orcamento.fornecedor }}</span><br>
                  <span>R$ {{ orcamento.precoUnitario.toFixed(2) }} (Total: R$ {{ (orcamento.precoUnitario * item.quantidade).toFixed(2) }})</span><br>
                  <small>Prazo: {{ orcamento.prazoEntrega }} dias</small>
                  <div v-if="orcamento.observacoes" style="margin-top: 5px;">
                    <small style="color: #666;">{{ orcamento.observacoes }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>

    </div>
    
    <v-btn class="btnSecundary" style="margin-right: 10px;" @click="cancelarPedido">Fechar</v-btn>
  </v-container>
</template>
