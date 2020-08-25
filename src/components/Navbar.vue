<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
            <div class="container">
                <router-link class="navbar-brand" :to="{path: '/'}">
                    <!-- <img src="@/assets/logo.svg" width="40" /> -->
                    <img src="@/assets/logo2.svg" width="40">
                </router-link>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav ml-auto mt-2 mt-lg-0">
                        <template v-if="currentUser && currentUser.uid">
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-expanded="false">
                                    {{currentUser.displayName}}
                                </a>
                                <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                                    <li>
                                        <a class="dropdown-item" href="#" @click.prevent>
                                            <font-awesome-icon :icon="['fad', 'user']" fixed-width /> Profile
                                        </a>
                                    </li>
                                    <li>
                                        <a class="dropdown-item" href="#" @click.prevent="logout">
                                            <font-awesome-icon :icon="['fad', 'sign-out']" fixed-width /> Logout
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </template>

                        <template v-else>
                            <li class="nav-item">
                                <router-link :to="{name: 'Login'}" class="nav-link">
                                    Login
                                    <!-- <font-awesome-icon :icon="['fad', 'sign-in']" /> -->
                                </router-link>
                            </li>

                            <!-- <li class="nav-item">
                                <router-link :to="{name: 'sign-up'}" class="nav-link">
                                    Sign Up
                                </router-link>
                            </li> -->
                        </template>
                    </ul>
                </div>
            </div>
        </nav>
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
@import '@/assets/css/colors';
@import '@/assets/css/variables';

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
