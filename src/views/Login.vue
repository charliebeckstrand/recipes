<template>
    <div class="login h-100">
        <div class="row h-100">
            <div class="col-lg-3 col-md-6 col-sm-8 mx-sm-auto mx-3 my-auto">
                <div class="d-flex">
                    <div class="mx-auto mb-3">
                        <!-- <router-link: :to="{name: 'home'}">
                            <img src="/assets/45332.svg" width="75" height="75" alt="Logo">
                        </router-link> -->
                        <a href="/">
                            <img src="@/assets/45332.svg" width="75" height="75" alt="Logo">
                        </a>
                    </div>
                </div>

                <div class="alert bg-danger text-white rounded-0" v-if="invalidEmail || invalidPassword">
                    {{error.message}}
                </div>

                <form @submit.prevent="signInWithEmailAndPassword()">
                    <div class="form-group">
                        <input type="email" class="form-control rounded-0" :class="{'is-invalid': invalidEmail}" placeholder="Email" v-model="email" @input="invalidEmail = false" autofocus>
                    </div>
                    <div class="form-group">
                        <input type="password" class="form-control rounded-0" :class="{'is-invalid': invalidPassword}" placeholder="Password" v-model="password" @input="invalidPassword = false">
                    </div>
                    <button type="submit" class="btn btn-block text-uppercase rounded-0" :class="{'btn-dark': email && password, 'btn-light': !email || !password}" :disabled="!email || !password || loggingIn">
                        Login
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase/app';

// @ is an alias to /src
import Navbar from "@/components/Navbar.vue";

export default {
    name: "login",
    components: {
        Navbar
    },
    data() {
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
        signInWithEmailAndPassword() {
            this.loggingIn = true;

            firebase.auth().signInWithEmailAndPassword(this.email, this.password).then((user) => {
                this.loggingIn = false;

                this.$router.replace('/');
            }).catch((error) => {
                this.error = error;

                this.loggingIn = false;

                if(error.code == "auth/user-not-found") {
                    this.invalidEmail = true;
                }
                if(error.code == "auth/wrong-password") {
                    this.invalidPassword = true;
                }
            });
        }
    }
};
</script>

<style scoped>
</style>
