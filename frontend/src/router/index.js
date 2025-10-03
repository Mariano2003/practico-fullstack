import { createRouter, createWebHistory } from 'vue-router';
import AtletaList from '../views/AtletaList.vue';
import CiudadList from '../views/CiudadList.vue';
import HomeView from '../views/HomeView.vue';
import AtletaForm from '../views/AtletaForm.vue';
import CiudadForm from '../views/CiudadForm.vue';

const routes = [
  { path: '/', redirect: '/atletas' },
  { path: '/atletas', component: AtletaList },
  { path: '/ciudades', component: CiudadList },
  { path: '/home', component: HomeView },
  { path: '/atleta-form', component: AtletaForm },
  { path: '/ciudad-form', component: CiudadForm },
];

 const router = createRouter({
  history: createWebHistory(),
  routes
});
export default router;
