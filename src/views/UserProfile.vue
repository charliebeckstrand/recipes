<template>
    <div class="user-profile">
        <div class="container">
            <Navbar />

            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item active" aria-current="page">Profile</li>
                </ol>
            </nav>

            <form @submit.prevent="updateUser()">
                <div class="form-group">
                    <label for="displayName">Display Name</label>
                    <input type="text" class="form-control" v-model="editableUser.displayName">
                </div>

                <button type="submit" class="btn btn-primary">
                    Save Changes
                </button>
            </form>

        </div>
    </div>
</template>

<script>
import firebase from 'firebase/app';

// @ is an alias to /src
import Navbar from "@/components/Navbar.vue";

export default {
    name: "user-profile",
    components: {
        Navbar
    },
    data() {
        return {
            editableUser: {},

            confirmEmail: null,

            changeEmail: false,

            underValidation: false
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    watch: {
        user(user) {
            if(user) {
                this.editableUser = _.cloneDeep(user);
            }
        }
    },
    methods: {
        updateUser() {
            var user = firebase.auth().currentUser;

            user.updateProfile({
                displayName: this.editableUser.displayName
            }).then(response => {
                this.$swal({
                    toast: true,
                    html: 'User updated',
                    type: 'success',
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 5000
                });
            }).catch(error => {
                this.$swal({
                    toast: true,
                    html: 'An error occurred. Please try again',
                    type: 'error',
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 5000
                });
            });
        }
    },
    mounted() {
        this.editableUser = _.cloneDeep(this.user);
    }
};
</script>

<style scoped>
.img-thumbnail {
    height: 75px;
    width: 75px;
    min-width: 75px;
    min-height: 75px;
}
.badge + .badge {
    margin-top: .25rem;
}
/* .edit-recipe-button {
    border-top-left-radius: 0;
}
.delete-recipe-button {
    border-bottom-left-radius: 0;
}
.list-group-item.has-actions {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
} */
</style>
