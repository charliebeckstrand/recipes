import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import { library } from '@fortawesome/fontawesome-svg-core';
import { dom } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/pro-solid-svg-icons';
import { far } from '@fortawesome/pro-regular-svg-icons';
import { fal } from '@fortawesome/pro-light-svg-icons';

import moment from 'moment';

import BootstrapVue from 'bootstrap-vue';
import Lodash from 'lodash';
import VueLodash from 'vue-lodash';
import VueSweetalert2 from 'vue-sweetalert2';

import Gravatar from 'vue-gravatar';
import Multiselect from 'vue-multiselect';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'vue-multiselect/dist/vue-multiselect.min.css';

import '@/assets/css/sweet-alert-overrides.css';
import '@/assets/css/vue-multiselect-overrides.css';
import '@/assets/css/app.css';

Vue.use(BootstrapVue);
Vue.use(Lodash);
Vue.use(VueLodash);
Vue.use(VueSweetalert2);

Vue.component('v-gravatar', Gravatar);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('multiselect', Multiselect);

Vue.prototype.moment = moment;

// Firebase
import Firebase from 'firebase/app';
import VueFirestore from 'vue-firestore';
import 'firebase/auth';
import 'firebase/firestore';

Vue.use(VueFirestore);

Firebase.initializeApp({
    apiKey: 'AIzaSyBIqUrT0E4w-hDs26h6IoRS8l10VdWVtTQ',
    authDomain: 'recipes-5892c.firebaseapp.com',
    databaseURL: 'https://recipes-5892c.firebaseio.com',
    projectId: 'recipes-5892c',
    storageBucket: '',
    messagingSenderId: '727385991229'
});

let app;
Firebase.auth().onAuthStateChanged((currentUser) => {
    if(!app) {
        app = new Vue({
        router,
        store,
        render: h => h(App)
        }).$mount('#app');
    }
    if(currentUser) {
        store.commit('setUser', currentUser);
    } else {
        store.commit('setUser', null);
    }
});

// FontAwesome
library.add(far, fas, fal);

dom.watch() // This will kick of the initial replacement of i to svg tags and configure a MutationObserver
