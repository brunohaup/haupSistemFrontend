import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue';
import DefaultLayout from '../layouts/DefaultLayout.vue'
import ComprasList from '../views/compras/ComprasList.vue';
import Home from '../views/Home.vue';
import UsuariosList from '../views/usuarios/UsuariosList.vue';
import CompraDetail from '../views/compras/CompraDetail.vue';
import CompraEdit from '../views/compras/CompraEdit.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: 'home', name: 'Home', component: Home },
      { path: 'usuarios', name: 'Usuarios', component: UsuariosList },
      { path: 'compra', name: 'Compras', component: ComprasList },
      { path: 'compra/nova', name: 'NovaCompra', component: CompraEdit },
      { path: 'compra/detalhe', name: 'DetalheCompra', component: CompraDetail },
      { path: 'compra/editar', name: 'EdicaoCompra', component: CompraEdit },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
