<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import comprasService from '../../../services/comprasService'

const props = defineProps({
  compra: Object
});

const route = useRoute()
const router = useRouter()

const itemEdicao = ref({})

const descricao = ref(props.compra.descricao);
const listaItens = ref(props.compra.itens);

function removerItem(index) {
  listaItens.value.splice(index, 1)
}

async function adicionarItem() {
  if (!itemEdicao.value.nome || !itemEdicao.value.quantidade) {
    alert('Preencha o nome do item e a quantiade')
    return
  }
  listaItens.value.push({ ...itemEdicao.value })
  itemEdicao.value = {};
}


async function avacarEtapa() {

  const validacao = await validaDados()
  if (!validacao.valido) {
    alert(validacao.mensagem || 'Dados inválidos. Verifique os campos obrigatórios.')
    return
  }

  try {

    const response = await comprasService.avancarEtapa(montaDtoRetorno())
    
    const isNovaCompra = route.path === '/compra/nova'
    
    if (isNovaCompra) {
      router.push({ 
        path: '/compra/editar', 
        query: { id: response.id } 
      })
    } else {
      window.location.reload()
    }

  } catch (error) {
    console.error(error)
    alert('Erro ao avançar para orçamento')
  }
  
}

async function validaDados() {
  // Validações para etapa de criação
  if (!descricao.value || descricao.value.trim() === '') {
    return {
      valido: false,
      mensagem: 'Descrição da compra é obrigatória'
    }
  }

  if (!listaItens.value || listaItens.value.length === 0) {
    return {
      valido: false,
      mensagem: 'Adicione pelo menos um item à compra'
    }
  }

  // Verifica se todos os itens têm nome e quantidade
  const itensInvalidos = listaItens.value.filter(item => 
    !item.nome || item.nome.trim() === '' || !item.quantidade || item.quantidade <= 0
  )

  if (itensInvalidos.length > 0) {
    return {
      valido: false,
      mensagem: 'Todos os itens devem ter nome e quantidade válidos'
    }
  }

  return { valido: true }
}

function montaDtoRetorno() {
  const dto = props.compra;
  dto.descricao = descricao.value;
  dto.itens = listaItens.value;
  return dto;
}

defineExpose({
  validaDados,
  montaDtoRetorno
})

</script>

<template>
  
  <v-text-field v-model="descricao" label="Descrição" variant="outlined"></v-text-field>

  <div style="border-top: 1px solid #eee; padding-top: 15px; margin-bottom: 30PX;">
    <h5 style="margin-bottom: 10px;">Adicionar novo item</h5>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
      <input v-model="itemEdicao.nome" placeholder="Nome" 
              style="padding: 8px; border: 1px solid #ddd; border-radius: 3px;">
      <input v-model.number="itemEdicao.quantidade" type="number" placeholder="Quantidade" 
              style="padding: 8px; border: 1px solid #ddd; border-radius: 3px;">
    </div>
    <div style="margin-bottom: 10px;">
      <textarea v-model="itemEdicao.observacoes" placeholder="Observações" 
                style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 3px; resize: vertical; min-height: 60px;"></textarea>
    </div>
    <v-btn @click="adicionarItem()" class="btnSecundary">
      + Adicionar Item
    </v-btn>
  </div>

  <div v-for="(item, index) in listaItens" :key="item.id" style="display: flex; align-items: center; justify-content: space-between; padding: 10px; margin-bottom: 10px; background-color: #f9f9f9; border-radius: 3px;">
    <div style="flex: 1;">
      <strong>{{ item.nome }}</strong><br>
      <small>Quantidade: {{ item.quantidade }}</small>
      <div v-if="item.observacoes" style="margin-top: 5px;">
        <small style="color: #666;">{{ item.observacoes }}</small>
      </div>
    </div>
    <div style="display: flex; align-items: center;">
      <v-btn size="small" @click="removerItem(index)" style="background-color: #dc3545; color: white;">
        Remover
      </v-btn>
    </div>
  </div>

  <div style="margin-top: 1.5rem; display: flex; justify-content: flex-end;">
    <v-btn style="background-color: #6c757d; color: white; margin-right: 10px;" @click="avacarEtapa" append-icon="mdi-chevron-double-right">Avançar para orçamento</v-btn>
  </div>

</template>