import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import firebase from 'firebase';
import VueTippy from 'vue-tippy';

let app = '';

// Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyBIqUrT0E4w-hDs26h6IoRS8l10VdWVtTQ",
    authDomain: "recipes-5892c.firebaseapp.com",
    databaseURL: "https://recipes-5892c.firebaseio.com",
    projectId: "recipes-5892c",
    storageBucket: "",
    messagingSenderId: "727385991229"
});

firebase.auth().onAuthStateChanged(() => {
    if(!app) {
        app = new Vue({
        router,
        store,
        render: h => h(App)
        }).$mount("#app");
    }
});

// node_modules
import 'bootstrap/dist/css/bootstrap.min.css';

// config
Vue.config.productionTip = false;

//
Vue.use(VueTippy);
