import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persistedstate'

import RecipesModule from './recipes.js'
import UserModule from './user.js'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        node_env: process.env.NODE_ENV,
        vue_app_environment: process.env.VUE_APP_ENVIRONMENT
    },
    mutations: {

    },
    actions: {

    },
    modules: {
        recipes: RecipesModule,
        user: UserModule,
    },
    plugins: [
        VuexPersistence({
            paths: ['user']
        })
    ]
})
