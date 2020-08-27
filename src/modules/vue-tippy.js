import Vue from 'vue'
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
