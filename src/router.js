import Vue from 'vue'
import Router from 'vue-router'
import Template from './components/Template'
import Material from './components/Material'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: Home
    // },
    {
      path: '/',
      name: 'template',
      component: Template
    },
    {
      path: '/material',
      name: 'material',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: Material
    }
  ]
})
