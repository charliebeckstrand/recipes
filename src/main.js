import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import VueFirestore from 'vue-firestore';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import VueTippy from 'vue-tippy';
import lodash from 'lodash';
import VueLodash from 'vue-lodash';

// Initialize Firebase
firebase.initializeApp({
    apiKey: "AIzaSyBIqUrT0E4w-hDs26h6IoRS8l10VdWVtTQ",
    authDomain: "recipes-5892c.firebaseapp.com",
    databaseURL: "https://recipes-5892c.firebaseio.com",
    projectId: "recipes-5892c",
    storageBucket: "",
    messagingSenderId: "727385991229"
});

export const db = firebase.firestore();

let app
firebase.auth().onAuthStateChanged(() => {
    if(!app) {
        app = new Vue({
        router,
        store,
        render: h => h(App)
        }).$mount("#app");
    }
});

import 'bootstrap/dist/css/bootstrap.min.css';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import '@/assets/css/app.css';

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import VueContentPlaceholders from 'vue-content-placeholders';


// add fonts to library
library.add(far, fas);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(VueFirestore, VueTippy, VueLodash, lodash);
Vue.use(VueContentPlaceholders);

// config
Vue.config.productionTip = false;
