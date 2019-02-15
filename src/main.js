import Vue from 'vue'
import App from './App.vue'

import router from './router'
import { sync } from 'vuex-router-sync'

import store from './store'
import fontawesome from './fontawesome'

import FirebaseAuthPlugin from './FirebaseAuthPlugin'

import BootstrapVue from 'bootstrap-vue'
import Lodash from 'lodash'
import Multiselect from 'vue-multiselect'
import VueLodash from 'vue-lodash'
import VueSweetalert2 from 'vue-sweetalert2'
import VueFirestore from 'vue-firestore'
import Moment from 'moment'

// CSS
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-multiselect/dist/vue-multiselect.min.css'

import '@/assets/css/bootstrap-overrides.css'
import '@/assets/css/sweet-alert-overrides.css'
import '@/assets/css/vue-multiselect-overrides.css'
import '@/assets/css/app.css'

Vue.use(FirebaseAuthPlugin)

Vue.use(BootstrapVue)
Vue.use(Lodash)
Vue.use(VueLodash)
Vue.use(VueSweetalert2)
Vue.use(VueFirestore)

Vue.component('multiselect', Multiselect)

Vue.prototype.moment = Moment

Vue.config.productionTip = false

sync(store, router)

const app = new Vue({
    router,
    store,
    ...App
})

export { app, router, store }

app.$mount('#app')
