import firebase from 'firebase/app'
import 'firebase/auth'

export default {
    state: {
        user: {},
        favorite_recipes: []
    },
    mutations: {
        setUser (state, payload) {
            state.user = payload
        },
        addFavoriteRecipe (state, payload) {
            state.favorite_recipes.push(payload)
        },
        removeFavoriteRecipe (state, payload) {
            if (_.includes(state.favorite_recipes, payload)) {
                state.favorite_recipes = _.reject(state.favorite_recipes, (key) => {
                    return key == payload
                })
            }
        }
    },
    actions: {
        getUser (context) {
            let user = firebase.auth().currentUser

            context.commit('setUser', user)
        },
        logout () {

        }
    }
}
