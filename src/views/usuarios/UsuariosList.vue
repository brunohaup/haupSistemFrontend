<script setup>
import { ref, onMounted } from 'vue';
import usuarioService from '../../services/usuarioService'

const usuarios = ref([]);
const dialogEdicao = ref(false);
const usuarioEmEdicao = ref(null);
const usuarioNovo = ref(false);
const passwordVisible = ref(false);
const desabilitarEdicao = ref(false);
const cadastroUsuarioFormRef = ref(null);
const loading = ref(false);

const nomeRules = [
  v => !!v || 'O nome é obrigatório'
];
const emailRules = [
];
const identificadorRules = [
];
const usernameRules = [
  v => !!v || 'O usuário é obrigatório',
  v => v.length >= 3 || 'O usuário deve ter pelo menos 3 caracteres'
];
const passwordRules = [
  v => !!v || 'A senha é obrigatória',
  v => v.length >= 6 || 'A senha deve ter pelo menos 6 caracteres'
];

function novo() {
  console.log('Iniciar dialog inclusao passando id null');
  dialogEdicao.value = true;
  usuarioNovo.value = true;
  usuarioEmEdicao.value = {};
}

async function editar(id, desabilitaEdicao) {
  dialogEdicao.value = true;
  usuarioEmEdicao.value = await usuarioService.carregar(id);
  desabilitarEdicao.value = desabilitaEdicao;
}

function fecharDialogEdicao() {
  dialogEdicao.value = false;
  usuarioEmEdicao.value = null;
  usuarioNovo.value = false;
}

function verSenha() {
  if(desabilitarEdicao.value) return;
  passwordVisible.value = !passwordVisible.value;
}

async function salvar() {
  loading.value = true
  const valid = await cadastroUsuarioFormRef.value.validate();
  if (valid.valid) {
    const response = await usuarioService.criarNovo(usuarioEmEdicao.value);
    if(response.status === 201){
      
    }
    fecharDialogEdicao();
    loading.value = false;
    recarregaListagem();
  } else {
    loading.value = false;
  }
}

async function recarregaListagem() {
  usuarios.value = await usuarioService.listar();
}

onMounted(async () => {
  recarregaListagem()
});
</script>

<template>
  <v-container>
    <v-btn class="btnPrimary" @click="novo">Novo usuário</v-btn>
    <v-table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>Email</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="usuario in usuarios" :key="usuario.id">
          <td>{{ usuario.id }}</td>
          <td>{{ usuario.nome }}</td>
          <td>{{ usuario.email }}</td>
          <td>
            <v-btn icon="mdi-pencil" size="small" @click="editar(usuario.id, false)"></v-btn>
            <v-btn icon="mdi-magnify" size="small" @click="editar(usuario.id, true)"></v-btn>
            <v-btn icon="mdi-delete" size="small" @click="deletar(usuario.id)"></v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>

  <v-dialog
    v-model="dialogEdicao"
    width="auto"
    persistent
  >
    <v-form ref="cadastroUsuarioFormRef" @submit.prevent="salvar()">
      <v-card
        width="500"
        :prepend-icon="usuarioNovo !== null ? 'mdi-account-edit' : 'mdi-account-plus'"
        :title="usuarioNovo !== null ? 'Editar usuário' : 'Incluir novo usuário'"
      >
        <template v-slot:text>
          <div v-if="usuarioEmEdicao !== null">
            <v-text-field v-model="usuarioEmEdicao.nome" label="Nome" variant="outlined" :clearable="!desabilitarEdicao" :readonly="desabilitarEdicao" :rules="nomeRules"></v-text-field>
            <v-text-field v-model="usuarioEmEdicao.email" label="Email" variant="outlined" :clearable="!desabilitarEdicao" :readonly="desabilitarEdicao" :rules="emailRules"></v-text-field>
            <v-text-field v-model="usuarioEmEdicao.identificador" label="CPF/CNPJ" variant="outlined" :clearable="!desabilitarEdicao" :readonly="desabilitarEdicao" :rules="identificadorRules"></v-text-field>
            <v-divider style="margin: 10px;"></v-divider>
            <v-text-field v-model="usuarioEmEdicao.userName" label="Nome de usuario" variant="outlined" :clearable="!desabilitarEdicao" :readonly="desabilitarEdicao" :rules="usernameRules"></v-text-field>

            <v-text-field
              label="Senha"
              :append-inner-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
              :type="passwordVisible ? 'text' : 'password'"
              placeholder="Digite uma senha"
              variant="outlined"
              @click:append-inner="verSenha()"
              v-model="usuarioEmEdicao.password"
              :clearable="!desabilitarEdicao"
              :readonly="desabilitarEdicao"
              :rules="passwordRules"
            ></v-text-field>
          </div>
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
              v-if="desabilitarEdicao === false"
              class="btnPrimary"
              text="Salvar"
              :loading="loading"
              @click="salvar()"
            ></v-btn>
          </div>
        </template>
      </v-card>
    </v-form>
  </v-dialog>

</template>
