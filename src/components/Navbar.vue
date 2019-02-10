<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-transparent px-0">
            <a class="navbar-brand" href="#">
                <img src="https://image.flaticon.com/icons/svg/45/45332.svg" width="50" height="50" alt="Logo">
            </a>

            <ul class="navbar-nav ml-auto">
                <!-- <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" @click.prevent="toggleDropdownMenu()">
                        {{user.email}}
                    </a>
                    <div class="dropdown-menu dropdown-menu-right p-0 rounded-0" :class="{'show': showDropdownMenu}">
                        <a class="dropdown-item py-2 text-center" href="#" @click.prevent="logOut()">Log Out</a>
                    </div>
                </li> -->
                <li class="nav-item">
                    <a class="nav-link" href="#" @click.prevent="logOut()">
                        Log Out
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
import Vue from 'vue';
import firebase from 'firebase';
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
            }
        });
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.dropdown-item.active, .dropdown-item:active {
    color: inherit;
    text-decoration: none;
    background-color: inherit;
}
</style>
