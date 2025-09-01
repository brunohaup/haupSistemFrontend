<script setup>
import { ref, computed, onMounted } from 'vue'
import orcamentoService from '../../../services/orcamentoService'

const props = defineProps({
  compra: Object
})

const usuarioLogado = ref(null)
const itensAprovacao = ref([])
const carregandoUsuario = ref(true)

const podeAprovar = computed(() => {
  return usuarioLogado.value && usuarioLogado.value.tipo === 'ADMIN'
})

const valorTotal = computed(() => {
  return itensAprovacao.value.reduce((total, item) => {
    if (item.aprovado && item.idOrcamentoSelecionado) {
      const orcamento = item.orcamentos.find(orc => orc.id === item.idOrcamentoSelecionado)
      if (orcamento) {
        return total + (orcamento.precoUnitario * item.quantidade)
      }
    }
    return total
  }, 0)
})

onMounted(async () => {
  await carregarDadosAprovacao()
})

async function carregarDadosAprovacao() {
  try {

    const token = localStorage.getItem('token');
    if (token) {
        const dados = decodeToken(token);
        usuarioLogado.value = dados;
    }

    for (const item of props.compra.itens) {
        item.exibePainelOrcamento = false;
        try {
            item.orcamentos = await orcamentoService.listarOrcamentosPorItem(item.id)
        } catch (error) {
            item.orcamentos = []
        }
    }
    
    itensAprovacao.value = props.compra.itens.map(item => ({
      ...item,
      aprovado: null,
      idOrcamentoSelecionado: null,
      motivoRecusa: ''
    }))

    carregandoUsuario.value = false
  } catch (error) {
    console.error('Erro ao carregar dados de aprovação:', error)
    carregandoUsuario.value = false
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

function aprovarItem(index) {
  itensAprovacao.value[index].aprovado = true
}

function reprovarItem(index) {
  itensAprovacao.value[index].aprovado = false
  itensAprovacao.value[index].idOrcamentoSelecionado = null
}

function selecionarOrcamento(itemIndex, orcamentoId) {
  itensAprovacao.value[itemIndex].idOrcamentoSelecionado = orcamentoId
}

async function validaDados() {
  if (!podeAprovar.value) {
    return { valido: false, mensagem: 'Você não tem permissão para aprovar compras.' }
  }
  
  for(const item of itensAprovacao.value) {
    if(item.aprovado === null){
        return { valido: false, mensagem: 'É necessário aprovar ou reprovar o item ' + item.nome }
    }

    if(item.idOrcamentoSelecionado === null && item.aprovado) {
        return { valido: false, mensagem: 'É necessário marcar algum orcamento para o item ' + item.nome }
    }

    if(item.aprovado === false && (item.motivoRecusa === null || item.motivoRecusa === '')) {
        return { valido: false, mensagem: 'É necessário informar o motivo da recusa do item ' + item.nome }
    }

  }
  
  return { valido: true }
}

function montaDtoRetorno() {
  const dto = props.compra;
  dto.itens = itensAprovacao.value;
  return dto;
}

defineExpose({
  validaDados,
  montaDtoRetorno
})
</script>

<template>
  <div style="padding: 10px;">
    <!-- Loading -->
    <div v-if="carregandoUsuario" style="text-align: center; padding: 10px;">
      <p>Carregando dados de aprovação...</p>
    </div>

    <!-- Sem permissão -->
    <div v-else-if="!podeAprovar" style="padding: 20px; background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 5px; margin-bottom: 20px;">
      <h4 style="color: #856404; margin-bottom: 10px;">⚠️ Sem Permissão</h4>
      <p style="color: #856404; margin: 0;">Apenas administradores podem aprovar compras. Esta solicitação aguarda aprovação de um usuário com permissões adequadas.</p>
    </div>

    <!-- Interface de aprovação -->
    <div v-else>
      
      <!-- Lista de itens para aprovação -->
      <div style="margin-bottom: 20px;">
        <h4 style="margin-bottom: 15px;">Itens para Aprovação</h4>
        
        <div v-for="(item, index) in itensAprovacao" :key="item.id" 
             :style="{
               border: '1px solid #ddd', 
               borderRadius: '5px', 
               padding: '15px', 
               marginBottom: '15px',
               backgroundColor: item.aprovado ? '#d4edda' : 
                               item.aprovado === false ? '#f8d7da' : '#ffffff'
             }">

          <!-- Cabeçalho do item com status -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px;">
            <div>
              <strong>{{ item.nome }}</strong>
              <span style="margin-left: 10px; color: #666;">Qtd: {{ item.quantidade }}</span>
            </div>
            <div style="display: flex; gap: 10px;">
              <v-btn @click="aprovarItem(index)"
                      :style="{
                        padding: '5px 15px',
                        backgroundColor: item.aprovado ? '#28a745' : '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }"
                      prepend-icon="mdi-check">
                Aprovar
              </v-btn>
              <v-btn @click="reprovarItem(index)"
                      :style="{
                        padding: '5px 15px',
                        backgroundColor: item.aprovado === false ? '#dc3545' : '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }"
                      prepend-icon="mdi-close">
                Reprovar
              </v-btn>
            </div>
          </div>

          <!-- Seleção de orçamento (só aparece se aprovado) -->
          <div v-if="item.aprovado !== false && item.orcamentos && item.orcamentos.length > 0" style="margin-bottom: 15px;">
            <h5 style="margin-bottom: 10px; color: #555;">Selecione o Orçamento:</h5>
            <div v-for="(orcamento, orcIndex) in item.orcamentos" :key="orcamento.id"
                 style="background-color: #f8f9fa; padding: 10px; border-radius: 3px; margin-bottom: 8px; border-left: 3px solid #007bff;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <input type="radio" 
                       :name="`orcamento-${item.id}`"
                       :value="orcamento.id"
                       :checked="item.idOrcamentoSelecionado === orcamento.id"
                       @change="selecionarOrcamento(index, orcamento.id)"
                       style="transform: scale(1.2);">
                <div style="flex: 1;">
                  <p style="margin: 0; font-weight: bold;">{{ orcamento.fornecedor }}</p>
                  <p style="margin: 0; color: #666;">Preço Unit.: R$ {{ orcamento.precoUnitario.toFixed(2).replace('.', ',') }}</p>
                  <p style="margin: 0; color: #666;">Total: R$ {{ (orcamento.precoUnitario * item.quantidade).toFixed(2).replace('.', ',') }}</p>
                  <p v-if="orcamento.prazoEntrega" style="margin: 0; color: #666;">Prazo: {{ orcamento.prazoEntrega }} dias</p>
                  <p v-if="orcamento.observacoes" style="margin: 0; color: #666; font-style: italic;">{{ orcamento.observacoes }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Observação do item -->
          <div v-if="item.aprovado === false" style="margin-top: 10px;">
            <label style="display: block; margin-bottom: 5px; font-weight: bold;">Motivo da recusa:</label>
            <textarea v-model="item.motivoRecusa" 
                      placeholder="Observações específicas para este item..."
                      style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 3px; resize: vertical; min-height: 60px;"></textarea>
          </div>
        </div>
      </div>

      <!-- Resumo da compra -->
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <p><strong>Valor Total Aprovado:</strong> R$ {{ valorTotal.toFixed(2).replace('.', ',') }}</p>
      </div>
    </div>
  </div>
</template>
