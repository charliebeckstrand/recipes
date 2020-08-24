import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persistedstate'

import UserModule from './user.js'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
    },
    mutations: {
    },
    actions: {
    },
    modules: {
        user: UserModule,
    },
    plugins: [
        VuexPersistence({
            paths: ['user']
        })
    ]
})
