<template>
    <div>
        <b-navbar toggleable="lg" type="light" variant="light" class="botder-bottom">
            <b-container>
                <b-navbar-brand
                    :to="{
                        name: 'Recipes'
                    }"
                >
                    <img src="@/assets/logo2.svg" width="40">
                </b-navbar-brand>

                <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

                <b-collapse id="nav-collapse" is-nav>
                    <b-navbar-nav class="ml-auto">
                        <b-nav-item :to="{name: 'Recipes'}">
                            Recipes
                        </b-nav-item>
                        <template v-if="currentUser && currentUser.uid">
                            <b-nav-item-dropdown right>
                                <template v-slot:button-content>
                                    {{currentUser.displayName}}
                                </template>
                                <b-dropdown-item
                                    :to="{
                                        name: 'Dashboard'
                                    }"
                                >
                                    <font-awesome-icon :icon="['fad', 'tachometer']" fixed-width /> Dashboard
                                </b-dropdown-item>
                                <b-dropdown-item
                                    :to="{
                                        name: 'Profile'
                                    }"
                                >
                                    <font-awesome-icon :icon="['fad', 'user']" fixed-width /> Profile
                                </b-dropdown-item>
                                <b-dropdown-item @click.prevent="logout">
                                    <font-awesome-icon :icon="['fad', 'sign-out']" fixed-width /> Logout
                                </b-dropdown-item>
                            </b-nav-item-dropdown>
                        </template>
                        <template v-else>
                            <b-nav-item :to="{name: 'Login'}">
                                Login
                            </b-nav-item>
                        </template>
                    </b-navbar-nav>
                </b-collapse>
            </b-container>
        </b-navbar>
    </div>
</template>

<script>
import { mapState } from 'vuex'

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

import { Dropdown } from 'bootstrap'

Array.from(document.querySelectorAll('.dropdown')).forEach(dropdownNode => new Dropdown(dropdownNode))

export default {
    name: 'Navbar',
    computed: {
        ...mapState({
            currentUser: state => state.user.user
        })
    },
    methods: {
        logout () {
            firebase.auth().signOut()
            .then(() => {
                this.$store.commit('setUser', {})

                this.$router.push({
                    name: 'Login'
                })
            })
        }
    },
    data: () => ({

    }),
    created () {

    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/_colors';
@import '@/assets/css/_variables';

.navbar {
    .navbar-brand {
        transition: $transition;
        // &:hover {
        //     transform: scale(1.1);
        // }
    }

    .nav-link {
        // text-transform: uppercase;
    }
}
</style>
