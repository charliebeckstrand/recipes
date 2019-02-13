<template>
    <div class="profile">
        <div class="container">
            <Navbar />

            <Breadcrumb :breadcrumbItems="breadcrumbItems" />

            <form @submit.prevent="updateUser()">
                <div class="form-group">
                    <label for="uid">UID</label>
                    <input type="text" class="form-control" v-model="currentUser.uid" readonly>
                </div>

                <div class="form-group">
                    <label for="displayName">Display Name</label>
                    <div class="input-group">
                        <input type="text" class="form-control" v-model="editableUser.displayName">
                        <div class="input-group-append" v-if="userChanges()">
                            <button type="submit" class="btn btn-primary" :disabled="savingUser">
                                <template v-if="savingUser">
                                    <div class="spinner-border spinner-border-sm" role="status"><span class="sr-only">Loading...</span></div>
                                </template>
                                <template v-else>Save Changes</template>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" class="form-control" v-model="currentUser.email" readonly>
                </div>
            </form>

        </div>
    </div>
</template>

<script>
import firebase from 'firebase/app';

// @ is an alias to /src
import Navbar from "@/components/Navbar.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";

export default {
    name: "profile",
    components: {
        Navbar,
        Breadcrumb
    },
    data() {
        return {
            editableUser: {},
            editableUserCache: {},

            breadcrumbItems: [
                {
                    text: 'Profile',
                    active: true
                }
            ],

            savingUser: false
        }
    },
    computed: {
        currentUser() {
            return firebase.auth().currentUser;
        }
    },
    methods: {
        updateUser() {
            var currentUser = firebase.auth().currentUser;

            this.savingUser = true;

            currentUser.updateProfile({
                displayName: this.editableUser.displayName
            }).then(response => {
                // this.$swal({
                //     toast: true,
                //     html: 'display name updated',
                //     type: 'success',
                //     position: 'top-end',
                //     showConfirmButton: false,
                //     timer: 5000
                // });

                this.editableUser = _.cloneDeep(firebase.auth().currentUser);
                this.editableUserCache = _.cloneDeep(firebase.auth().currentUser);

                this.savingUser = false;

            }).catch(error => {
                this.savingUser = false;
                this.$swal({
                    toast: true,
                    html: error.message,
                    type: 'error',
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 5000
                });
            });
        },
        userChanges() {
            var changes = false;
            if(!_.isEqual(this.editableUser, this.editableUserCache)) {
                changes = true;
            } else {
                changes = false;
            }
            return changes;
        }
    },
    mounted() {
        this.editableUser = _.cloneDeep(this.currentUser);
        this.editableUserCache = _.cloneDeep(this.currentUser);
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
