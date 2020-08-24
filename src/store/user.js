import firebase from 'firebase/app'
import 'firebase/auth'

export default {
    state: {
        user: {}
    },
    mutations: {
        setUser (state, payload) {
            state.user = payload
        }
    },
    actions: {
        getUser (context) {
            let user = firebase.auth().currentUser

            console.log(user)
            
            context.commit('setUser', user)
        },
        logout () {

        }
    }
}
