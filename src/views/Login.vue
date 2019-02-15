<template>
    <div class="login h-100">
        <div class="d-flex h-100">
            <div class="mx-auto my-auto px-3" style="width: 350px;">
                <div class="d-flex">
                    <div class="mx-auto mb-3">
                        <router-link :to="{name: 'home'}">
                            <img src="@/assets/img/45332.svg" width="75" height="75" alt="Logo">
                        </router-link>
                    </div>
                </div>

                <b-alert v-if="(error && error.message) && (invalidEmail || invalidPassword)" variant="danger" fade show>{{error.message}}</b-alert>

                <b-form @submit.prevent="signInWithEmailAndPassword()">
                    <b-form-group class="mb-1">
                        <b-form-input type="email" :class="{'is-invalid': invalidEmail}" placeholder="Email" v-model="email" @input="invalidEmail = false" autofocus></b-form-input>
                    </b-form-group>
                    <b-form-group class="mb-1">
                        <b-form-input type="password" :class="{'is-invalid': invalidPassword}" placeholder="Password" v-model="password" @input="invalidPassword = false" autofocus></b-form-input>
                    </b-form-group>
                    <b-button type="submit" :class="{'btn-dark': email && password, 'btn-light': !email || !password}" :disabled="!email || !password || loggingIn" block>
                        <template v-if="loggingIn">
                            <div class="spinner-border spinner-border-sm" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                        </template>
                        <template v-else>
                            Login
                        </template>
                    </b-button>
                </b-form>
            </div>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import Navbar from "@/components/Navbar.vue"

export default {
    name: "login",
    components: {
        Navbar
    },
    data () {
        return {
            email: null,
            password: null,

            error: null,

            loggingIn: false,

            invalidEmail: false,
            invalidPassword: false
        }
    },
    methods: {
        async signInWithEmailAndPassword () {
            this.loggingIn = true

            try {
                const auth = await this.$auth.login(this.email, this.password).then(response => {
                    this.$router.push({name: 'home'})

                    this.loggingIn = false
                });
            } catch (error) {
                this.loggingIn = false

                this.error = error

                if(error.code == "auth/user-not-found") {
                    this.invalidEmail = true
                }
                if(error.code == "auth/wrong-password") {
                    this.invalidPassword = true
                }
            }
        }
    }
};
</script>

<style>
html,
body,
#app {
    height: 100%;
}
</style>
