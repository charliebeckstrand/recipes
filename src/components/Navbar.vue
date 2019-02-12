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
                <li class="nav-item" v-else>
                    <router-link :to="{name: 'login'}">
                        Login
                    </router-link>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script>
import firebase from 'firebase/app';

export default {
    name: "Navbar",
    data() {
        return {
            showDropdownMenu: false
        }
    },
    computed: {
        user() {
			return this.$store.state.user;
		}
    },
    methods: {
        toggleDropdownMenu() {
            this.showDropdownMenu = !this.showDropdownMenu;
        },
        logOut() {
            firebase.auth().signOut().then(() => {
                this.$router.replace("login");
            });
        }
    },
    mounted() {
    }
};
</script>

<style scoped>

</style>
