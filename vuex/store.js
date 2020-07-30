import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		MainUrl: 'http://zhedian.vicp.net:43569/Service1.asmx',
		fdept: '',
		fuser: ''
	},     
	mutations: {       
		updateUserInfo(state, Info) {
			state.fdept = Info.fdept
			state.fuser = Info.fuser
		}
	}
})
export default store