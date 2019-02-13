<template>
    <div>
        <b-navbar toggleable="sm" type="light" class="mb-3 px-0">
            <b-navbar-brand :to="{name: 'home'}">
                <img src="@/assets/img/45332.svg" width="50" height="50" alt="Logo">
            </b-navbar-brand>

            <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

            <b-collapse is-nav id="nav_collapse">
                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto" v-if="currentUser && currentUser.uid">
                    <b-nav-item-dropdown right>
                        <!-- Using button-content slot -->
                        <template slot="button-content">
                            <div class="d-inline-block pt-sm-0 pt-3">
                                {{currentUser.email}}
                            </div>
                        </template>
                        <b-dropdown-item :to="{name: 'user-profile'}">
                            <font-awesome-icon :icon="['far', 'user']" fixed-width /> Profile
                        </b-dropdown-item>
                        <b-dropdown-item href="#" @click.prevent="logOut()">
                            <font-awesome-icon :icon="['far', 'sign-out']" fixed-width /> Logout
                        </b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
                <b-navbar-nav class="ml-auto" v-else>
                    <b-nav-item :to="{name: 'login'}">
                        <div class="d-inline-block pt-sm-0 pt-3">
                            Login
                        </div>
                    </b-nav-item>
                </b-navbar-nav>
            </b-collapse>

        </b-navbar>
    </div>
</template>

<script>
import firebase from 'firebase/app';

export default {
    name: "navbar",
    computed: {
        currentUser() {
			return firebase.auth().currentUser;
		}
    },
    methods: {
        logOut() {
            firebase.auth().signOut().then(() => {
                this.$router.push({name: 'login'});
            });
        }
    },
    mounted() {
    }
};
</script>

<style scoped>

</style>
