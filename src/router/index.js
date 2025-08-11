import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue'
import Usuarios from '../views/Usuario.vue';

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/usuarios', name: 'Usuarios', component: Usuarios }
];

const router = createRouter({
  history: createWebHistory(),
  routes
})


export default router
