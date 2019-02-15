import store from '@/store'
import Firebase from 'firebase/app'

import 'firebase/auth'
import 'firebase/firestore'

const config = {
    apiKey: 'AIzaSyBIqUrT0E4w-hDs26h6IoRS8l10VdWVtTQ',
    authDomain: 'recipes-5892c.firebaseapp.com',
    databaseURL: 'https://recipes-5892c.firebaseio.com',
    projectId: 'recipes-5892c',
    storageBucket: '',
    messagingSenderId: '727385991229'
};

export default {
    install: (Vue, options) => {
        const firebase = Firebase.initializeApp(config)
        // const auth = firebase.auth()
        Vue.prototype.$auth = {
            login: async (email, password) => {
                return await firebase.auth().signInWithEmailAndPassword(email, password)
            },
            logout: async () => {
                await firebase.auth().signOut()
            }
        }
        firebase.auth().onAuthStateChanged(user => {
            store.commit('setUser', { user })
        })
    }
}
