import Vue from 'vue'
import Vuex from 'vuex'

const _importSync = file => require(`./modules/${file}`).default

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app: _importSync('app'),
    // hotspot: _importSync('hotspot'),
    audio: _importSync('audio'),
  },
})
