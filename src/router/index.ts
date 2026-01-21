import { createRouter, createWebHistory } from 'vue-router'

// import page components, not App.vue
import Home from '../views/Home.vue'
import Host from '../views/Host.vue'
import Room from '../views/Room.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/host', component: Host },
  { path: '/:roomId', component: Room }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
