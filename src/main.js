 // The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import vueResource from 'vue-resource'
import L from 'Leaflet'
import Map from './components/Map'

import '../node_modules/leaflet/dist/leaflet.css';

Vue.use(vueResource)

Vue.config.productionTip = false

Vue.mixin({
	data: function() {
		let mainUrl = "http://saricicek.epac.to:8080/geoserver";
		return {
			get dataUrl() {
				return mainUrl + "/urbanInfo/ows?service=WFS" +
				"&version=1.0.0&request=GetFeature&maxFeatures=100&outputFormat=application%2Fjson" +
				"&typeName=urbanInfo:";
			},
			get layerUrl() {
				return mainUrl + "/gwc/service/wms";
			}
		}
	}
})

/* eslint-disable no-new */
new Vue({
	el:'#app',
	template : '<Map/>',
	components : {Map}
});


