import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import VueFirestore from "vue-firestore";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import VueTippy from "vue-tippy";
import Lodash from "lodash";
import VueLodash from "vue-lodash";
import VueContentPlaceholders from "vue-content-placeholders";
import Gravatar from "vue-gravatar";
import VueSweetalert2 from "vue-sweetalert2";
import moment from 'moment';

// Font Awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import { dom } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/pro-solid-svg-icons";
import { far } from "@fortawesome/pro-regular-svg-icons";
import { fal } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// add fonts to library
library.add(far, fas, fal);

dom.watch() // This will kick of the initial replacement of i to svg tags and configure a MutationObserver

import "bootstrap/dist/css/bootstrap.min.css";

import "@/assets/css/sweet-alert-overrides.css";
import "@/assets/css/app.css";

let app;

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
    if(!app) {
        app = new Vue({
        router,
        store,
        render: h => h(App)
        }).$mount("#app");
    }
    if(user) {
        store.commit('setUser', user);
    } else {
        store.commit('setUser', null);
    }
});

export const auth = firebase.auth();
export const db = firebase.firestore();

Vue.component("v-gravatar", Gravatar);
Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.use(VueFirestore, VueTippy, VueLodash, Lodash);
Vue.use(VueContentPlaceholders);
Vue.use(VueSweetalert2);
Vue.prototype.moment = moment;

// config
Vue.config.productionTip = false;
