import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('../App.vue') },
    //{ path: '/about', component: () => import('../views/About.vue') },
  ],
})

export default router