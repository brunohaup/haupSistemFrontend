import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import ComprasList from '../views/compras/ComprasList.vue';
import ComprasForm from '../views/compras/ComprasForm.vue';
import Home from '../views/Home.vue';

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
      //{ path: 'usuarios', name: 'Usuarios', components: Usuario },
      { path: '/compras', name: 'Compras', component: ComprasList },
      { path: '/compras/nova', name: 'NovaCompra', component: ComprasForm }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
