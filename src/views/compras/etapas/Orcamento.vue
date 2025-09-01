<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import orcamentoService from '../../../services/orcamentoService'
import comprasService from '../../../services/comprasService'

const props = defineProps({
  compra: Object
});

const router = useRouter()

const novoOrcamento = reactive({})
const listaItens = ref();

onMounted(async () => {

  listaItens.value = props.compra.itens;

  listaItens.value.forEach(item => {
    novoOrcamento[item.id] = {
      fornecedor: '',
      precoUnitario: null,
      prazoEntrega: null,
      observacoes: ''
    }
  })

  for (const item of listaItens.value) {
    try {
      item.orcamentos = await orcamentoService.listarOrcamentosPorItem(item.id)
    } catch (error) {
      console.error(`Erro ao carregar orçamentos do item ${item.id}:`, error)
      item.orcamentos = []
    }
  }
  
})

async function adicionarOrcamento(itemId) {
  const orcamento = novoOrcamento[itemId]
  if (!orcamento.fornecedor || !orcamento.precoUnitario) {
    alert('Preencha fornecedor e preço unitário')
    return
  }

  try {
    const novoOrc = await orcamentoService.adicionarOrcamento({
      idCompraItem: itemId,
      fornecedor: orcamento.fornecedor,
      precoUnitario: orcamento.precoUnitario,
      prazoEntrega: orcamento.prazoEntrega || 0,
      observacoes: orcamento.observacoes || ''
    })

    const item = listaItens.value.find(i => i.id === itemId)
    if (!item.orcamentos) item.orcamentos = []
    item.orcamentos.push(novoOrc)

    novoOrcamento[itemId] = {
      fornecedor: '',
      precoUnitario: null,
      prazoEntrega: null,
      observacoes: ''
    }
  } catch (error) {
    console.error('Erro ao adicionar orçamento:', error)
    alert('Erro ao adicionar orçamento')
  }
}

async function removerOrcamento(orcamentoId, itemId) {
  try {
    await orcamentoService.removerOrcamento(orcamentoId)
    
    const item = listaItens.value.find(i => i.id === itemId)
    item.orcamentos = item.orcamentos.filter(o => o.id !== orcamentoId)
  } catch (error) {
    console.error('Erro ao remover orçamento:', error)
    alert('Erro ao remover orçamento')
  }
}

function obterMenorPreco(item) {
  if (!item.orcamentos || item.orcamentos.length === 0) return 0
  return Math.min(...item.orcamentos.map(o => o.precoUnitario))
}

async function enviarParaAprovacao() {
  const validacao = await validaDados()
  if (!validacao.valido) {
    alert(validacao.mensagem || 'Dados inválidos. Verifique os campos obrigatórios.')
    return
  }

  try {
    
    await comprasService.avancarEtapa(montaDtoRetorno())
    router.push({ name: 'Compras' })
    
  } catch (error) {
    console.error(error)
    alert('Erro ao avançar para aprovacao')
  }
}

async function validaDados() {
  // Verifica se todos os itens têm pelo menos um orçamento
  const itensSemOrcamento = listaItens.value.filter(item => 
    !item.orcamentos || item.orcamentos.length === 0
  )
  
  if (itensSemOrcamento.length > 0) {
    return {
      valido: false,
      mensagem: `Os seguintes itens não possuem orçamentos: ${itensSemOrcamento.map(i => i.nome).join(', ')}`
    }
  }

  return { valido: true }
}

function montaDtoRetorno() {
  const dto = props.compra;
  return dto;
}

defineExpose({
  validaDados,
  montaDtoRetorno
})

</script>

<template>
  <h3 style="margin-bottom: 15px;">Gerenciar Orçamentos</h3>
        
  <div v-for="item in listaItens" :key="item.id" style="margin-bottom: 30px; border: 1px solid #ddd; padding: 15px; border-radius: 5px;">
    <h4 style="margin-bottom: 10px;">{{ item.nome }} (Qtd: {{ item.quantidade }})</h4>

    <div v-if="novoOrcamento[item.id]" style="margin-bottom: 15px;">
      <h5 style="margin-bottom: 10px;">Adicionar Orçamento</h5>
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 10px;">
        <input v-model="novoOrcamento[item.id].fornecedor" placeholder="Fornecedor" 
                style="padding: 8px; border: 1px solid #ddd; border-radius: 3px;">
        <input v-model.number="novoOrcamento[item.id].precoUnitario" type="number" step="0.01" placeholder="Preço unitário" 
                style="padding: 8px; border: 1px solid #ddd; border-radius: 3px;">
        <input v-model.number="novoOrcamento[item.id].prazoEntrega" type="number" placeholder="Prazo (dias)" 
                style="padding: 8px; border: 1px solid #ddd; border-radius: 3px;">
      </div>
      <div style="margin-bottom: 10px;">
        <textarea v-model="novoOrcamento[item.id].observacoes" placeholder="Observações" 
                  style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 3px; resize: vertical; min-height: 60px;"></textarea>
      </div>
      <v-btn @click="adicionarOrcamento(item.id)" class="btnSecundary">
        + Adicionar Orçamento
      </v-btn>
    </div>
    
    <div v-if="item.orcamentos && item.orcamentos.length > 0"  style="border-top: 1px solid #eee; padding-top: 15px; ">
      <div v-for="orcamento in item.orcamentos" :key="orcamento.id" 
            style="display: flex; align-items: center; justify-content: space-between; padding: 10px; margin-bottom: 10px; background-color: #f9f9f9; border-radius: 3px;">
        <div style="flex: 1;">
          <strong>{{ orcamento.fornecedor }}</strong><br>
          <span>R$ {{ orcamento.precoUnitario.toFixed(2) }} (Total: R$ {{ (orcamento.precoUnitario * item.quantidade).toFixed(2) }})</span><br>
          <small>Prazo: {{ orcamento.prazoEntrega }} dias</small>
          <div v-if="orcamento.observacoes" style="margin-top: 5px;">
            <small style="color: #666;">{{ orcamento.observacoes }}</small>
          </div>
        </div>
        <div style="display: flex; align-items: center;">
          <v-btn size="small" @click="removerOrcamento(orcamento.id, item.id)" style="background-color: #dc3545; color: white;">
            Remover
          </v-btn>
        </div>
      </div>
    </div>

    
  </div>

  <div style="margin-top: 30px; padding: 15px; background-color: #e9ecef; border-radius: 5px;">
    <h4 style="margin-bottom: 10px;">Resumo dos Orçamentos</h4>
    <div v-for="item in compra.itens" :key="'resumo-' + item.id" style="margin-bottom: 10px;">
      <strong>{{ item.nome }}:</strong>
      <span v-if="item.orcamentos && item.orcamentos.length > 0">
        {{ item.orcamentos.length }} orçamento(s) | 
        Menor preço: R$ {{ obterMenorPreco(item).toFixed(2) }} |
      </span>
      <span v-else style="color: #dc3545;">Nenhum orçamento cadastrado</span>
    </div>
  </div>

  <div style="display: flex; justify-content: end; margin-top: 20px; gap: 10px;">
    <v-btn @click="enviarParaAprovacao" style="background-color: #6c757d; color: white;" append-icon="mdi-chevron-double-right">
      Enviar para Aprovação
    </v-btn>
  </div>
</template>