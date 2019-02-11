import firebase from 'firebase/app';
import 'firebase/firestore';

// firebase init
const config = {
    apiKey: "AIzaSyBIqUrT0E4w-hDs26h6IoRS8l10VdWVtTQ",
    authDomain: "recipes-5892c.firebaseapp.com",
    databaseURL: "https://recipes-5892c.firebaseio.com",
    projectId: "recipes-5892c",
    storageBucket: "",
    messagingSenderId: "727385991229"
}
firebase.initializeApp(config)

// firebase utils
const db = firebase.firestore()
const auth = firebase.auth()
const currentUser = auth.currentUser

// date issue fix according to firebase
const settings = {

}
db.settings(settings)

// firebase collections
const recipesCollection = db.collection('recipes')

export {
    db,
    auth,
    currentUser,
    recipesCollection,
}
