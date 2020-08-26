import Vue from 'vue'
import VueSticky from 'vue-sticky'

Vue.directive('sticky', VueSticky)

Vue.directive('focus', {
    inserted (el) {
        Vue.nextTick(() => {
            el.focus()
        })
    }
})

export default {}
