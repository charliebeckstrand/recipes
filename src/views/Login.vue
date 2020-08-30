<template>
    <div class="login h-100">
        <div class="d-flex h-100">
            <div class="m-auto" style="min-width: 350px;">
                <div class="d-flex">
                    <div class="mx-auto mb-3">
                        <router-link :to="{path: '/'}" class="text-dark">
                            <img src="@/assets/logo2.svg" width="50">
                        </router-link>
                    </div>
                </div>

                <div
                    v-if="(error && error.message) && (invalid_email || invalid_password)"
                    class="alert alert-danger"
                >
                    {{error.message}}
                </div>

                <form @submit.prevent="signInWithEmailAndPassword()">
                    <div class="form-group mb-1">
                        <input
                            type="email"
                            v-model="email"
                            class="form-control"
                            :class="{'is-invalid': invalid_email}"
                            placeholder="Email"
                        >
                    </div>
                    <div class="form-group mb-1">
                        <input
                            type="password"
                            v-model="password"
                            class="form-control"
                            :class="{'is-invalid': invalid_password}"
                            placeholder="Password"
                        >
                    </div>
                    <button
                        type="submit"
                        class="btn btn-dark btn-block"
                        :disabled="logging_in || !email || !password"
                    >
                        <span v-if="logging_in">
                            <font-awesome-icon :icon="['fal', 'spinner-third']" spin fixed-width />
                        </span>
                        <span v-else>
                            <font-awesome-icon :icon="['fad', 'sign-in']" fixed-width /> Login
                        </span>
                    </button>
                </form>

                <div class="mt-2 d-lg-flex align-items-center">
                    <button type="button" v-for="(login_icon, index) in login_icons" :key="index" :class="{'mt-lg-0 ml-lg-1': index > 0}" class="text-center btn btn-light btn-outline-dark btn-block">
                      <font-awesome-icon :icon="['fab', login_icon ]" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

import firebase from 'firebase/app'
import 'firebase/auth'

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faGoogle, faFacebookF } from '@fortawesome/free-brands-svg-icons'
library.add(faGoogle)
library.add(faFacebookF)

export default {
    name: 'Login',
    components: {

    },
    computed: {
        ...mapState({
            currentUser: state => state.user.user
        })
    },
    directives: {

    },
    methods: {
        async signInWithEmailAndPassword () {
            this.logging_in = true

            await firebase.auth().signInWithEmailAndPassword(this.email, this.password)
            .then(response => {
                if (response) {
                    this.$store.commit('setUser', response.user)
                }

                if (
                    this.$route.query &&
                    this.$route.query.redirect
                ) {
                    this.$router.push({
                        path: this.$route.query.redirect
                    })
                }
                else {
                    if (this.currentUser && this.currentUser.uid) {
                        this.$router.push({
                            name: 'Dashboard'
                        })
                    } else {
                        this.$router.push({
                            name: 'Recipes'
                        })
                    }
                }

                this.logging_in = false
            })
            .catch(error => {
                this.logging_in = false

                if (error) {
                    this.error = error
                }

                if (error.code == "auth/user-not-found") {
                    this.invalid_email = true
                }
                if (error.code == "auth/wrong-password") {
                    this.invalid_password = true
                }
            })
        }
    },
    data: () => ({
        email: '',
        password: '',

        invalid_email: false,
        invalid_password: false,

        logging_in: false,

        error: {},

        login_icons: ["google", "facebook-f"]
    }),
    firestore () {

    }
}
</script>

<style lang="scss" scoped>

</style>
