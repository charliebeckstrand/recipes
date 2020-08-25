import Vue from 'vue'
import App from './App.vue'

import directives from './directives'
import modules from './modules'
import router from './router'
import store from './store'

import './assets/css/_custom.scss'

Vue.config.devtools = false
Vue.config.productionTip = false

new Vue({
    directives,
    modules,
    router,
    store,
    render: h => h(App)
}).$mount('#app')
