<template>
    <div class="login h-100">
        <div class="d-flex h-100">
            <div class="mx-auto my-auto px-3" style="width: 350px;">
                <div class="d-flex">
                    <div class="mx-auto mb-3">
                        <router-link :to="{path: '/'}" class="text-dark">
                            <img src="@/assets/logo.svg" width="50">
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
                        :disabled="logging_in"
                    >
                        Login
                    </button>
                    <!-- <b-form-group class="mb-1">
                        <b-form-input type="email" :class="{'is-invalid': invalid_email}" placeholder="Email" v-model="email" @input="invalid_email = false" v-focus="focus_email" @focus="focus_email = true" @blur="focus_email = false"></b-form-input>
                    </b-form-group>
                    <b-form-group class="mb-1">
                        <b-form-input type="password" :class="{'is-invalid': invalid_password}" placeholder="Password" v-model="password" @input="invalid_password = false"></b-form-input>
                    </b-form-group>
                    <b-button type="submit" :class="{'btn-dark': email && password, 'btn-light': !email || !password}" :disabled="!email || !password || !resolved" block>
                        <template v-if="resolved">
                            Login
                        </template>
                        <template v-else>
                            <div class="spinner-border spinner-border-sm" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                        </template>
                    </b-button> -->
                </form>
                <div class="mt-3 text-center">
                  <button type="button" class="btn btn-light border border-dark">
                    <font-awesome-icon :icon="['fab', 'google']" />
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
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
library.add(faGoogle)

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
                    this.$router.push({
                        name: 'Home'
                    })
                }

                this.logging_in = false
            })
            .catch(error => {
                this.error = error

                if (error.code == "auth/user-not-found") {
                    this.invalid_email = true
                }
                if (error.code == "auth/wrong-password") {
                    this.invalid_password = true
                }

                this.logging_in = false
            })
        }
    },
    data: () => ({
        email: null,
        password: null,

        invalid_email: false,
        invalid_password: false,

        logging_in: false,

        error: {}
    }),
    firestore () {

    }
}
</script>

<style lang="scss" scoped>

</style>
