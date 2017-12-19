 // The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import vueResource from 'vue-resource'
import L from 'Leaflet'
import Map from './components/Map'

import '../node_modules/leaflet/dist/leaflet.css';

Vue.use(vueResource)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el:'#app',
  template : '<Map/>',
  components : {Map}
})
