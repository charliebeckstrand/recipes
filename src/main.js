import Vue from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'
import bootstrap from './plugins/bootstrap'
import firebase from './plugins/firebase'
import fontawesome from './plugins/fontawesome'
import lodash from './plugins/lodash'
import multiselect from './plugins/vue-multiselect'

import VueTippy, { TippyComponent } from 'vue-tippy'
Vue.use(VueTippy, {
    animation: 'fade',
    placement: 'bottom',
    // arrow: true,
    arrowType: 'round',
    flip: true,
    flipBehavior: ['bottom', 'top'],
    flipOnUpdate: true,
    // delay: [250, 0],
    hideOnClick: false
})
Vue.component('tippy', TippyComponent)

import VueSweetalert2 from 'vue-sweetalert2'
Vue.use(VueSweetalert2)

import './assets/css/custom.scss'

import VueMoment from 'vue-moment'
Vue.use(VueMoment)

Vue.directive('focus', {
    inserted (el) {
        Vue.nextTick(() => {
            el.focus()
        })
    }
})

Vue.config.productionTip = false

new Vue({
    router,
    store,
    bootstrap,
    firebase,
    fontawesome,
    lodash,
    multiselect,
    render: h => h(App)
}).$mount('#app')
