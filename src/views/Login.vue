<template>
    <div class="login h-100">
        <div class="row h-100">
            <div class="col-lg-3 col-md-6 col-sm-8 mx-sm-auto mx-3 my-auto">
                <div class="d-flex">
                    <div class="mx-auto mb-3">
                        <router-link :to="{name: 'home'}">
                            <img src="@/assets/img/45332.svg" width="75" height="75" alt="Logo">
                        </router-link>
                    </div>
                </div>

                <b-alert v-if="invalidEmail || invalidPassword" variant="danger" show>{{error.message}}</b-alert>

                <form @submit.prevent="signInWithEmailAndPassword()">
                    <div class="form-group mb-1">
                        <div class="input-group">
                            <!-- <div class="input-group-prepend">
                                <div class="input-group-text">
                                    <font-awesome-icon :icon="['far', 'at']" fixed-width />
                                </div>
                            </div> -->
                            <input type="email" class="form-control" :class="{'is-invalid': invalidEmail}" placeholder="Email" v-model="email" @input="invalidEmail = false" autofocus>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="input-group">
                            <!-- <div class="input-group-prepend">
                                <div class="input-group-text">
                                    <font-awesome-icon :icon="['far', 'lock']" fixed-width />
                                </div>
                            </div> -->
                            <input type="password" class="form-control" :class="{'is-invalid': invalidPassword}" placeholder="Password" v-model="password" @input="invalidPassword = false">
                        </div>
                    </div>
                    <button type="submit" class="btn btn-block text-uppercase" :class="{'btn-dark': email && password, 'btn-light': !email || !password}" :disabled="!email || !password || loggingIn">
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

                this.$router.push({name: 'home'});

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
