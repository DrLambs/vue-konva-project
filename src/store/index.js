import Vue from 'vue'
import Vuex from 'vuex'
import template from './modules/template'
import material from './modules/material'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {
    //
  },
  modules: {
    template,
    material
  }
})
