<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import comprasService from '../../services/comprasService'

// Hooks devem ser chamados no topo
const router = useRouter()

const compras = ref([])
const loading = ref(false)
const totalItems = ref(0)
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref([])
const search = ref('')

const headers = ref([
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Etapa', key: 'etapa', sortable: true },
  { title: 'Descrição', key: 'descricao', sortable: true },
  { title: 'Data Inclusão', key: 'dataHoraInclusao', sortable: true },
  { title: 'Solicitante', key: 'solicitanteNome', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false, width: '120px' }
])

const etapaColors = {
  'CRIACAO': '#B4C1C7',
  'ORCAMENTO': '#A5D8EA',
  'AGUARDANDO_APROVACAO': '#F8E6A0',
  'APROVADA': '#B0F0A5',
  'APROVADA_PARCIAL': '#F5CBA7',
  'RECUSADA': '#FB9F9E',
  'REALIZADA': '#CBA6F7',
  'FINALIZADA': '#D7BDE2'
}

onMounted(() => {
  carregarCompras({
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    sortBy: sortBy.value
  })
})

function novaCompra() {
  router.push({ name: 'NovaCompra' })
}

function converterTimestampParaData(timestamp) {
  const data = new Date(timestamp)
  return data.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
}

function detalhes(id) {
  router.push({ path: '/compra/detalhe', query: { id } })
}

function editar(id) {
  router.push({ path: '/compra/editar', query: { id } })
}

async function carregarCompras(options = {}) {
  loading.value = true
  try {
    const { page: currentPage = 1, itemsPerPage: perPage = 10, sortBy = [] } = options
    
    let sortParam = 'id,desc' // default
    if (sortBy && sortBy.length > 0) {
      const sortItem = sortBy[0]
      const direction = sortItem.order === 'desc' ? 'desc' : 'asc'
      sortParam = `${sortItem.key},${direction}`
    }
    
    const params = {
      page: currentPage - 1, // Backend usa 0-based
      size: perPage,
      search: search.value || '',
      sort: sortParam
    }
    
    const response = await comprasService.listarComprasPaginadas(params)
    compras.value = response.content || response.data || []
    totalItems.value = response.totalElements || response.total || 0
  } catch (error) {
    console.error('Erro ao carregar compras:', error)
    compras.value = []
    totalItems.value = 0
  } finally {
    loading.value = false
  }
}

let searchTimeout
watch(search, (newSearch) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    page.value = 1
    carregarCompras({
      page: page.value,
      itemsPerPage: itemsPerPage.value,
      sortBy: sortBy.value
    })
  }, 500)
})

function getEtapaStyle(etapa) {
  const bg = etapaColors[etapa] || '#ccc'
  return { backgroundColor: bg, color: '#000' }
}

</script>

<template>
  <v-container>
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-btn class="btnPrimary" @click="novaCompra" prepend-icon="mdi-plus">
          Nova Compra
        </v-btn>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          label="Buscar compras..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          clearable
          hide-details
        />
      </v-col>
    </v-row>

    <v-data-table-server
      v-model:items-per-page="itemsPerPage"
      v-model:page="page"
      v-model:sort-by="sortBy"
      :headers="headers"
      :items="compras"
      :items-length="totalItems"
      :loading="loading"
      :search="search"
      @update:options="carregarCompras"
      class="elevation-1"
      loading-text="Carregando compras..."
      no-data-text="Nenhuma compra encontrada"
      items-per-page-text="Itens por página:"
      page-text="{0}-{1} de {2}"
    >
      <template v-slot:item.etapa="{ item }">
        <v-chip
          :style="getEtapaStyle(item.etapa)"
          variant="flat"
          size="small"
        >
          {{ item.etapa }}
        </v-chip>
      </template>

      <template v-slot:item.dataHoraInclusao="{ item }">
        {{ converterTimestampParaData(item.dataHoraInclusao) }}
      </template>

      <template v-slot:item.solicitanteNome="{ item }">
        {{ item.solicitanteNome || 'N/A' }}
      </template>

      <template v-slot:item.actions="{ item }">
        <v-btn
          v-if="item.etapa !== 'FINALIZADA' && item.etapa !== 'RECUSADA'"
          icon="mdi-pencil"
          size="small"
          variant="text"
          @click="editar(item.id)"
          title="Editar"
        />
        <v-btn
          icon="mdi-magnify"
          size="small"
          variant="text"
          @click="detalhes(item.id)"
          title="Detalhes"
        />
      </template>
    </v-data-table-server>
  </v-container>
</template>
