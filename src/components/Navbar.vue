<template>
    <div>
        <b-navbar toggleable="lg" type="light" variant="light">
            <b-container>
                <b-navbar-brand
                    :to="{
                        name: 'Recipes'
                    }"
                >
                    <img src="@/assets/logo2.svg" width="40">
                </b-navbar-brand>

                <b-navbar-toggle target="nav-collapse" class="p-0">
                    <div class="open">
                        <font-awesome-icon :icon="['far', 'bars']" size="lg" fixed-width />
                    </div>
                    <div class="closed">
                        <font-awesome-icon :icon="['fal', 'bars']" size="lg" fixed-width />
                    </div>
                </b-navbar-toggle>

                <b-collapse id="nav-collapse" is-nav>
                    <b-navbar-nav class="my-lg-0 my-3 align-items-lg-center ml-auto">
                        <!-- <b-nav-item :to="{name: 'Recipes'}">
                            Recipes
                        </b-nav-item> -->
                        <template v-if="currentUser && currentUser.uid">
                            <b-nav-item-dropdown class="ml-lg-1 ml-0" right>
                                <template v-slot:button-content>
                                    <!-- <font-awesome-icon :icon="['fad', 'user-circle']" fixed-width /> -->
                                    <div class="d-flex align-items-center">
                                        <div class="d-lg-inline-flex d-none mr-2">
                                            <v-gravatar :email="currentUser.email" width="30" class="rounded-circle" />
                                        </div>
                                        <div class="d-lg-none d-inline-flex mr-2">
                                            {{currentUser.displayName}}
                                        </div>
                                        <div>
                                            <font-awesome-icon :icon="['fas', 'caret-down']" />
                                        </div>
                                    </div>
                                </template>
                                <b-dropdown-header class="d-lg-block d-none">
                                    {{currentUser.displayName}}
                                </b-dropdown-header>
                                <!-- <b-dropdown-item
                                    :to="{
                                        name: 'CreateRecipe'
                                    }"
                                >
                                    <font-awesome-icon :icon="['far', 'plus']" fixed-width /> Create Recipe
                                </b-dropdown-item> -->
                                <b-dropdown-item
                                    :to="{
                                        name: 'UserDashboard'
                                    }"
                                >
                                    <font-awesome-icon :icon="['fad', 'tachometer']" fixed-width /> Dashboard
                                </b-dropdown-item>
                                <b-dropdown-item
                                    :to="{
                                        name: 'UserProfile'
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
                                <font-awesome-icon :icon="['fad', 'sign-in']" fixed-width /> Login
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
    data: () => ({

    }),
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
    }
}
</script>

<style lang="scss">
</style>

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
        font-weight: 500;
    }

    .navbar-toggler {
        .open {
            display: none;
        }
        .closed {
            display: block;
        }
        &.not-collapsed {
            .open {
                display: block;
            }
            .closed {
                display: none;
            }
        }
        border-color: transparent;
        &:focus {
            box-shadow: none;
            // outline: 5px auto -webkit-focus-ring-color;
        }
    }
}
</style>
