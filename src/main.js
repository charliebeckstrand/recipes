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
import VueTippy from 'vue-tippy';
import Lodash from 'lodash';
import VueLodash from 'vue-lodash';
import VueContentPlaceholders from 'vue-content-placeholders';
import Gravatar from 'vue-gravatar';
import VueSweetalert2 from 'vue-sweetalert2';
import Multiselect from 'vue-multiselect';
import Vue2Filters from 'vue2-filters';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'vue-multiselect/dist/vue-multiselect.min.css';

import '@/assets/css/sweet-alert-overrides.css';
import '@/assets/css/app.css';

Vue.component('v-gravatar', Gravatar);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('multiselect', Multiselect);

Vue.use(BootstrapVue);
Vue.use(VueLodash);
Vue.use(Lodash);
Vue.use(VueTippy);
Vue.use(VueContentPlaceholders);
Vue.use(VueSweetalert2);
Vue.use(Vue2Filters);

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
