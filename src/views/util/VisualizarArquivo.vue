<script setup>
import { ref } from "vue"
import arquivoService from "../../services/arquivoService"

const props = defineProps({
  idArquivo: Number
})

function isImagem(nome) {
  return nome.match(/\.(jpg|jpeg|png)$/i)
}

function urlNota() {
  return arquivoService.imagem(props.idArquivo);
}
</script>

<template>
  <div>
    <v-dialog v-model="isOpen" max-width="800">
      <div class="bg-white p-4 rounded-xl max-w-3xl w-full relative">
        <button class="absolute top-2 right-2" @click="notaSelecionada = null">❌</button>
        
        <div v-if="isImagem(notaSelecionada.nomeArquivo)">
          <img :src="urlNota(notaSelecionada)" class="max-h-[80vh] mx-auto" />
        </div>
        <div v-else>
          <iframe :src="urlNota(notaSelecionada)" class="w-full h-[80vh]"></iframe>
        </div>
      </div>
    </v-dialog>
  </div>
</template>
