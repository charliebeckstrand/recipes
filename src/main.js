import Vue from 'vue'
import App from './App.vue'

import db from './db'
import directives from './directives'
import modules from './modules'
import router from './router'
import store from './store'

import lineClamp from 'vue-line-clamp'

Vue.use(lineClamp, {
  // plugin options
})

import './assets/css/_custom.scss'

Vue.config.devtools = false
Vue.config.productionTip = false

new Vue({
    db,
    directives,
    modules,
    router,
    store,
    render: h => h(App)
}).$mount('#app')
