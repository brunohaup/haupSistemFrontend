<script setup>
import { ref, onMounted } from 'vue'
import orcamentoService from '../../../services/orcamentoService'
import comprasService from '../../../services/comprasService'

const props = defineProps({
  compra: Object
})

const listaItens = ref([]);

onMounted(async () => {
  await carregarDadosAprovacao()
})

async function carregarDadosAprovacao() {
  try {

    for (const item of props.compra.itens) {
      try {
          item.orcamentos = await orcamentoService.listarOrcamentosPorItem(item.id);
      } catch (error) {
          item.orcamentos = [];
      }

      await listarNotasDoItem(item);

    }

    listaItens.value = props.compra.itens.map(item => ({
      ...item
    }))

    console.log(listaItens.value);
    

  } catch (error) {
    console.error('Erro ao carregar dados de aprovação:', error)
  }
}

async function listarNotasDoItem(item){
  return item.arquivos = await comprasService.listarNotas(item.id);
}

async function anexarNota(item) {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.pdf,.png,.jpg,.jpeg'
  input.multiple = true 
  input.onchange = async (ev) => {
    const files = ev.target.files
    if (!files || files.length === 0) return

    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('idItem', item.id)
      try {
        await comprasService.incluirNotaFiscal(formData)
        await listarNotasDoItem(item)
      } catch (e) {
        console.error('Erro ao anexar nota:', e)
        alert('Erro ao anexar nota.')
      }
    }
  }
  input.click()
}

async function removerNota(item, nota) {
  try {
    await comprasService.removerNota(nota.id)
    item.arquivos = item.arquivos.filter(n => n.id !== nota.id)
  } catch (e) {
    console.error('Erro ao remover nota:', e)
    alert('Erro ao remover nota.')
  }
}

async function validaDados() {

  const itensSemNota = listaItens.value.filter(item => item.aprovado && 
    (!item.arquivos || item.arquivos.length === 0)
  )

  if (itensSemNota.length > 0) {
    return {
      valido: false,
      mensagem: `Os seguintes itens não possuem nota: ${itensSemNota.map(i => i.nome).join(', ')}`
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
  <div v-if="listaItens.length > 0" style="padding: 10px;">
    <div style="margin-bottom: 20px;">
        <h4 style="margin-bottom: 15px;">Itens</h4>
        <div
            v-for="item in props.compra.itens"
            :key="item"
            style="border:1px solid #ddd; border-radius:8px; padding:16px; margin-bottom:18px;"
        >
            <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:12px;">
                <h4 style="margin:0;">{{ item.nome }}</h4>
                <v-btn
                    @click="anexarNota(item)"
                    v-if="item.aprovado === true"
                    style="background-color: #6c757d; color: white;"
                >
                    Anexar nota
            </v-btn>
            </div>

            <div v-if="item.aprovado === true">
                <!-- Lista de itens desse fornecedor -->
                <div style="border:1px solid #eee; border-radius:6px; padding:12px; margin-bottom:12px;">
                    <h5 style="margin:0 0 10px 0; color:#555;">Orçamentos</h5>
                    <div
                        v-for="orc in item.orcamentos.filter(o => o.id === item.idOrcamentoSelecionado)"
                        :key="orc.id"
                        style="display:flex; justify-content:space-between; gap:8px; border-bottom:1px dashed #eee; padding:8px 0;"
                    >
                        <div>
                            <div style="font-weight:600;">Fornecedor: {{ orc.fornecedor }}</div>
                            <div style="color:#666;">
                                Qtd: {{ item.quantidade }} |
                                Preço unit.: R$ {{ orc.precoUnitario.toFixed(2).replace('.', ',') }} |
                                Total: R$ {{ ((orc.precoUnitario || 0) * (item.quantidade || 0)).toFixed(2).replace('.', ',') }} |
                                Prazo: {{ orc.prazoEntrega }} dia(s)
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Notas desse fornecedor -->
                <div style="background:#fff; border:1px solid #eee; border-radius:6px; padding:12px;">
                    <h5 style="margin:0 0 10px 0; color:#555;">Notas anexadas</h5>

                    <div v-if="item.arquivos === null || item.arquivos.length === 0">
                      <span style="color:#777;">Nenhuma nota anexada ainda.</span>
                    </div>

                    <div v-else style="display: flex;">
                      <div v-for="nota in item.arquivos" style="display: flex; flex-direction: column; width: 100px; margin-right: 20px;">
                        <div style="display: flex;justify-content: flex-end;margin-bottom: -15px;">
                          <v-icon icon="mdi-delete" color="error" @click="removerNota(item, nota)"></v-icon>
                        </div>
                        <div style="display: flex; justify-content: center;">
                          <v-icon icon="mdi-file-outline" style="font-size: 50px;"></v-icon>
                        </div>
                        <div style="display: flex;">
                          <span class="nomeArquivo">
                            {{ nota.nomeArquivo }}
                          </span>
                        </div>
                      </div>
                    </div>

                </div>
            </div>

            <div v-else>
                <div style="background:#fff; border:1px solid #eee; border-radius:6px; padding:12px;">
                    <h5 style="margin:0 0 10px 0; color:#555;">Motivo da recusa</h5>

                    <div>
                        <span style="color:#777;">{{ item.motivoRecusa }}</span>
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>
</template>

<style scoped>

.nomeArquivo {
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis;
}

</style>