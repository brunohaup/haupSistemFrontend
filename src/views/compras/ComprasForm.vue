

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import comprasService from '../../services/comprasService';

const router = useRouter();
const compra = ref({etapa: "CRIACAO", itens: []});
const indexItemEdicao = ref(null);
const dialogEdicao = ref(false);
const cadastroCompraItemFormRef = ref(null);
const itemEdicao = ref({});

const nomeItemRules = [
  v => !!v || 'O nome do item é obrigatório',
];
const quantidadeItemRules = [
  v => !!v || 'A quantidade é obrigatória',
];
const valorItemRules = [
  v => !!v || 'O valor é obrigatório',
];

function cancelarPedido(){
  router.push({ name: 'Compras' });
}

function adicionarItem() {
  dialogEdicao.value = true;
  indexItemEdicao.value = null;
}

function removerItem(index) {
  compra.value.itens.splice(index, 1);
}

async function salvarItem(){
  const valid = await cadastroCompraItemFormRef.value.validate();
  if (valid.valid) {
    compra.value.itens.push(itemEdicao.value);
    fecharDialogEdicao();
  }
}

function formatarMoeda(valor) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(valor)
}

function removerFormatacao(valorStr) {
  if (!valorStr) return null;

  // troca vírgula por ponto
  let valor = valorStr.replace(",", ".").replace(/[^\d.]/g, "");

  if (valor.includes(".")) {
    return parseFloat(valor);
  } else {
    return parseInt(valor, 10);
  }
}

function onInputValor(v) {
  itemEdicao.value.valor = removerFormatacao(v);
}

function onBlurValor() {
  if (itemEdicao.value.valor != null) {
    itemEdicao.value.valorDigitado = formatarMoeda(itemEdicao.value.valor);
  }
}

async function salvarCompra() {
  if (validaSePodeSalvarCompra()) {
    try {
      console.log("compra.value", compra.value);
      
      await comprasService.criarCompra(compra.value);
      compra.value = { etapa: "CRIACAO", itens: [] };
      router.push({ name: 'Compras' });
    } catch (error) {
      console.error(error);
    }
  }
}

function validaSePodeSalvarCompra() {
  if(compra.value.itens.length <= 0){
    return false;
  }
  if(compra.value.descricao === ""){
    return false;
  }
  return true;
}

async function avacarEtapa() {
  
  salvarCompra();

}

function fecharDialogEdicao() {
  dialogEdicao.value = false;
  indexItemEdicao.value = null;
  itemEdicao.value = {};
}

</script>

<template>
  <div class="p-4" style="padding: 10px;">
    <h2 class="text-xl font-bold mb-4">Nova Compra</h2>

    <div class="mb-4">
      <span>Etapa: {{ compra.etapa }}</span>
    </div>

    <v-text-field v-model="compra.descricao" label="Descrição" variant="outlined"></v-text-field>

    <v-btn class="mb-4 btnSecundary" @click="adicionarItem">+ Adicionar Item</v-btn>

    <div style="display: flex; flex-wrap: wrap; justify-content: flex-start;">
      <v-card v-for="(item, index) in compra.itens" :key="index" max-width="344" hover style="margin-right: 10px;">
        <v-card-item>
          <v-card-title>
            <span>{{ item.nome }}</span>
          </v-card-title>
        </v-card-item>
        <v-card-text>
          <span>{{ item.quantidade }}</span>
          <span> - {{ item.valorDigitado }}</span>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="removerItem(index)">Remover</v-btn>
        </v-card-actions>
      </v-card>
    </div>
    
    <div class="mt-6" style="display: flex; justify-content: center;">
      <v-btn class="btnSecundary" style="margin-right: 10px;"@click="cancelarPedido">Cancelar</v-btn>
      <v-btn class="btnSecundary" style="margin-right: 10px;"@click="avacarEtapa">Avançar para orçamento</v-btn>
      <v-btn class="btnPrimary" @click="salvarCompra">Salvar</v-btn>
    </div>
  </div>

  <v-dialog
    v-model="dialogEdicao"
    width="auto"
    persistent
  >
    <v-form ref="cadastroCompraItemFormRef" @submit.prevent="salvarItem()">
      <v-card
        width="500"
        :prepend-icon="itemEdicao !== null ? 'mdi-text-box-edit-outline' : 'mdi-text-box-plus-outline'"
        :title="itemEdicao !== null ? 'Editar item' : 'Incluir novo item'"
      >
        <template v-slot:text>
            <v-text-field 
              v-model="itemEdicao.nome" 
              label="Nome do item" 
              variant="outlined" 
              :rules="nomeItemRules"
            ></v-text-field>
            <v-number-input
              v-model="itemEdicao.quantidade"
              :reverse="false"
              controlVariant="stacked"
              label="Quantidade"
              :hideInput="false"
              inset
              variant="outlined"
              :rules="quantidadeItemRules"
            ></v-number-input>
            <v-text-field 
              v-model="itemEdicao.valorDigitado" 
              label="Valor" variant="outlined" 
              :rules="valorItemRules" 
              @blur="onBlurValor(itemEdicao.valor)" 
              @input="onInputValor(itemEdicao.valorDigitado)"
            ></v-text-field>
            <v-text-field 
              v-model="itemEdicao.observacoes" 
              label="Observações" 
              variant="outlined"
            ></v-text-field>
        </template>

        <template v-slot:actions>
          <div style="display: flex; justify-content: center; width: 100%;">
            <v-btn
              text="Fechar"
              @click="fecharDialogEdicao()"
              class="btnSecundary"
              style="margin-right: 10px;"
            ></v-btn>
            <v-btn
              class="btnPrimary"
              text="Salvar"
              :loading="loading"
              @click="salvarItem()"
            ></v-btn>
          </div>
        </template>
      </v-card>
    </v-form>
  </v-dialog>
</template>