import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

// Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyBIqUrT0E4w-hDs26h6IoRS8l10VdWVtTQ",
    authDomain: "recipes-5892c.firebaseapp.com",
    databaseURL: "https://recipes-5892c.firebaseio.com",
    projectId: "recipes-5892c",
    storageBucket: "",
    messagingSenderId: "727385991229"
});

firebase.auth().onAuthStateChanged((user) => {

});
