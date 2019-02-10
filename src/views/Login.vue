<template>
    <div class="login h-100">
        <div class="row h-100">
            <div class="col-lg-3 col-md-6 col-sm-8 mx-sm-auto mx-3 my-auto">
                <div class="d-flex">
                    <div class="mx-auto mb-3">
                        <img src="https://image.flaticon.com/icons/svg/45/45332.svg" width="75" height="75" alt="Logo">
                    </div>
                </div>

                <div class="alert bg-danger text-white rounded-0" v-if="invalidEmailorPassword">
                    {{error.message}}
                </div>

                <form @submit.prevent="signInWithEmailAndPassword()">
                    <div class="form-group">
                        <input type="email" class="form-control rounded-0" :class="{'is-invalid': invalidEmailorPassword}" placeholder="Email" v-model="email" @input="invalidEmailorPassword = false">
                    </div>
                    <div class="form-group">
                        <input type="password" class="form-control rounded-0" :class="{'is-invalid': invalidEmailorPassword}" placeholder="Password" v-model="password" @input="invalidEmailorPassword = false">
                    </div>
                    <button type="submit" class="btn btn-block btn-dark text-uppercase rounded-0" :disabled="!email || !password || loggingIn">
                        Login
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase';

// @ is an alias to /src
import Navbar from "@/components/Navbar.vue";

export default {
    name: "home",
    components: {
        Navbar
    },
    data() {
        return {
            email: null,
            password: null,

            loggingIn: false,

            error: null,
            invalidEmailorPassword: false
        }
    },
    methods: {
        signInWithEmailAndPassword() {
            this.loggingIn = true;

            firebase.auth().signInWithEmailAndPassword(this.email, this.password).then((user) => {
                this.loggingIn = false;
                this.$router.replace('/recipes');
            }).catch((error) => {
                this.loggingIn = false;
                this.error = error;
                this.invalidEmailorPassword = true;
            });
        }
    }
};
</script>

<style scoped>
</style>
