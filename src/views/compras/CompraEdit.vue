<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import comprasService from '../../services/comprasService'
import Criacao from './etapas/Criacao.vue'
import Orcamento from './etapas/Orcamento.vue'
import Aprovacao from './etapas/Aprovacao.vue'

const route = useRoute()
const router = useRouter()

const compra = ref(null)
const compraEmEdicao = ref(true)

const criacaoRef = ref(null)
const orcamentoRef = ref(null)
const aprovacaoRef = ref(null)

function cancelar() {
  router.push({ name: 'Compras' })
}

async function salvarCompra() {
  try {

    const validacao = await validarEtapaAtual()
    if (!validacao.valido) {
      alert(validacao.mensagem || 'Dados inválidos. Verifique os campos obrigatórios.')
      return
    }

    const dto = await retornaDto();
    
    if(compra.value.etapa === "AGUARDANDO_APROVACAO"){
      await comprasService.avancarEtapa(dto)
    }else{
      await comprasService.salvar(dto)
    }
    
    router.push({ name: 'Compras' })

  } catch (error) {
    console.error(error)
    alert('Erro ao salvar compra')
  }
}

async function validarEtapaAtual() {
  const etapa = compra.value?.etapa
  
  switch (etapa) {
    case 'CRIACAO':
      if (criacaoRef.value && typeof criacaoRef.value.validaDados === 'function') {
        return await criacaoRef.value.validaDados()
      }
      break
    
    case 'ORCAMENTO':
      if (orcamentoRef.value && typeof orcamentoRef.value.validaDados === 'function') {
        return await orcamentoRef.value.validaDados()
      }
      break
    
    case 'AGUARDANDO_APROVACAO':
      if (aprovacaoRef.value && typeof aprovacaoRef.value.validaDados === 'function') {
        return await aprovacaoRef.value.validaDados()
      }
      break
    
    default:
      return { valido: true }
  }
  
  return { valido: true }
}

async function retornaDto() {
  const etapa = compra.value?.etapa

  switch (etapa) {
    case 'CRIACAO':
      if (criacaoRef.value && typeof criacaoRef.value.montaDtoRetorno === 'function') {
        return await criacaoRef.value.montaDtoRetorno();
      }
      break
    
    case 'ORCAMENTO':
      if (orcamentoRef.value && typeof orcamentoRef.value.montaDtoRetorno === 'function') {
        return await orcamentoRef.value.montaDtoRetorno();
      }
      break
    
    case 'AGUARDANDO_APROVACAO':
      if (aprovacaoRef.value && typeof aprovacaoRef.value.montaDtoRetorno === 'function') {
        return await aprovacaoRef.value.montaDtoRetorno();
      }
      break
    
    default:
      return {}
  }
  
  return {}
}

onMounted(async () => {
  await carregarCompra()
})

async function carregarCompra() {
  const id = route.query.id
  if(id != null) {
    compra.value = await comprasService.carregar(id)
    compraEmEdicao.value = true
  } else {
    compra.value = { etapa: "CRIACAO", itens: [] }
    compraEmEdicao.value = false
  }
}

watch(() => route.query.id, async (newId, oldId) => {
  if (newId !== oldId) {
    await carregarCompra()
  }
})

</script>

<template>
  <v-container>
    <div v-if="compra !== null" style="padding: 10px;">
      <h2 v-if="compraEmEdicao" style="margin-bottom: 20px;">Editando: {{ compra.descricao }}</h2>
      <h2 v-else style="margin-bottom: 20px;">Criando nova solicitação de compra</h2>
      
      <div style="margin-bottom: 20px; padding: 10px; background-color: #f5f5f5; border-radius: 5px;">
        <strong>Etapa atual: {{ compra.etapa }}</strong>
      </div>

      <div v-if="compra.etapa === 'CRIACAO'" style="margin-top: 20px;">
        <Criacao ref="criacaoRef" :compra="compra" />
      </div>

      <div v-if="compra.etapa === 'ORCAMENTO'" style="margin-top: 20px;">
        <Orcamento ref="orcamentoRef" :compra="compra" />
      </div>

      <div v-if="compra.etapa === 'AGUARDANDO_APROVACAO'" style="margin-top: 20px;">
        <Aprovacao ref="aprovacaoRef" :compra="compra" />
      </div>
      <div v-if="!['CRIACAO', 'ORCAMENTO', 'AGUARDANDO_APROVACAO'].includes(compra.etapa)" style="margin-top: 20px;">
        <p>Funcionalidade para etapa {{ compra.etapa }} em desenvolvimento...</p>
      </div>

      <div style="display: flex; margin-top: 30px; justify-content: center; gap: 10px;">
        <v-btn @click="cancelar" class="btnSecundary">
          fechar
        </v-btn>

        <v-btn @click="salvarCompra" class="btnPrimary" append-icon="mdi-content-save">
          Salvar
        </v-btn>
      </div>
    </div>
  </v-container>
</template>
