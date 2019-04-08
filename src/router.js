import Vue from 'vue'
import Router from 'vue-router'
import TemplateCreate from './components/TemplateCreate'
import MaterialCreate from './components/MaterialCreate'

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
      component: TemplateCreate
    },
    {
      path: '/material',
      name: 'material',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: MaterialCreate
    }
  ]
})
