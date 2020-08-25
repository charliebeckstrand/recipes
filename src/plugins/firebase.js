import Vue from 'vue'
import VueFirestore from 'vue-firestore'

import firebase from 'firebase/app'
import 'firebase/firestore'

Vue.use(VueFirestore)

// Initialize Firebase
let config = {
    apiKey: 'AIzaSyBIqUrT0E4w-hDs26h6IoRS8l10VdWVtTQ',
    authDomain: 'recipes-5892c.firebaseapp.com',
    databaseURL: 'https://recipes-5892c.firebaseio.com',
    projectId: 'recipes-5892c',
    storageBucket: '',
    messagingSenderId: '727385991229'
}

firebase.initializeApp(config)

export default {

}
