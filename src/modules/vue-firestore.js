import Vue from 'vue'
import VueFirestore from 'vue-firestore'

Vue.use(VueFirestore, {
    objects: true,
    key: 'id'
})
