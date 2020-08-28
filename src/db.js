import firebase from 'firebase/app'
import 'firebase/firestore'

// Initialize Firebase
let config = {
    apiKey: 'AIzaSyBIqUrT0E4w-hDs26h6IoRS8l10VdWVtTQ',
    authDomain: 'recipes-5892c.firebaseapp.com',
    databaseURL: 'https://recipes-5892c.firebaseio.com',
    projectId: 'recipes-5892c',
    storageBucket: '',
    messagingSenderId: '727385991229'
}

// export const db = firebase.initializeApp(config).firestore()
firebase.initializeApp(config).firestore()

export default {}
