<template>
    <div class="login h-100">
        <div class="d-flex h-100">
            <div class="m-auto" style="width: 350px;">
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
                            :class="{'is-invalid': invalid_email || validating && !email}"
                            placeholder="Email"
                        >
                    </div>
                    <div class="form-group mb-1">
                        <input
                            type="password"
                            v-model="password"
                            class="form-control"
                            :class="{'is-invalid': invalid_password || validating && !password}"
                            placeholder="Password"
                        >
                    </div>
                    <button
                        type="submit"
                        class="btn btn-dark btn-block"
                        :disabled="logging_in"
                    >
                        <span v-if="logging_in">
                            <Spinner />
                        </span>
                        <span v-else>
                            <font-awesome-icon :icon="['fad', 'sign-in']" fixed-width /> Login
                        </span>
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

import firebase from 'firebase/app'
import 'firebase/auth'

import Spinner from '@/components/Spinner'

export default {
    name: 'Login',
    data: () => ({
        error: {},

        email: '',
        password: '',

        validating: false,

        invalid_email: false,
        invalid_password: false,

        logging_in: false
    }),
    components: {
        Spinner
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
            this.validating = true

            if (
                this.email &&
                this.password
            ) {
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
                                name: 'MyRecipes'
                            })
                        } else {
                            this.$router.push({
                                name: 'Recipes'
                            })
                        }
                    }

                    this.validating = false
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
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
