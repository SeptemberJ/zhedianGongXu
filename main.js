import Vue from 'vue'
import App from './App'
import store from './vuex/store.js'  

Vue.prototype.$store = store

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()
