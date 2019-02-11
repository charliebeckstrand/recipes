<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-transparent p-0 mb-3">
            <router-link :to="{name: 'home'}" class="navbar-brand">
                <img src="https://image.flaticon.com/icons/svg/45/45332.svg" width="50" height="50" alt="Logo">
            </router-link>

            <ul class="navbar-nav ml-auto">
                <li class="nav-item" v-if="user">
                    {{user.email}}
                    <div class="text-right">
                        <a class="text-danger rounded-0" href="#" @click.prevent="logOut()">
                            Log Out
                        </a>
                    </div>
                </li>
                <!-- <li class="nav-item" v-else>
                    <router-link :to="{name: 'login'}" class="btn btn-outline-primary rounded-0">
                        Log In
                    </router-link>
                </li> -->
            </ul>
        </nav>
    </div>
</template>

<script>
import Vue from 'vue';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import Gravatar from 'vue-gravatar';

// @ is an alias to /src
// import user from '@/user.js';

Vue.component('v-gravatar', Gravatar);

export default {
    name: "Navbar",
    data() {
        return {
            showDropdownMenu: false,
            user: {},
            firebase: firebase
        }
    },
    methods: {
        logOut() {
            firebase.auth().signOut().then(() => {
                this.$router.replace("login");
            });
        },
        toggleDropdownMenu() {
            this.showDropdownMenu = !this.showDropdownMenu;
        }
    },
    mounted() {
        firebase.auth().onAuthStateChanged((user) => {
            if(user) {
                this.user = user;
            } else {
                this.user = null;
            }
        });
    }
};
</script>

<style scoped>

</style>
