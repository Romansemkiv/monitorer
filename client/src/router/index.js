import Vue from 'vue'
import VueRouter from 'vue-router'
import Scenes from '../views/Scenes.vue'
import Devices from '../views/Devices.vue'
import Records from '../views/Records.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Scenes',
    component: Scenes
  },
  {
    path: '/devices',
    name: 'Devices',
    component: Devices
  },
  {
    path: '/records',
    name: 'Records',
    component: Records
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

export default router
