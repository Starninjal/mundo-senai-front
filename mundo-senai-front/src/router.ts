import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Upload from './components/Upload.vue';
import HomeVue from './components/icons/Home.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: HomeVue
  },
  {
    path: '/upload',
    name: 'upload',
    component: Upload,
  },
  // Adicione outras rotas conforme necessário
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;