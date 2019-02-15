<template>
    <div class="create-recipe">
        <div class="container">
            <Navbar />

            <Breadcrumb :breadcrumbItems="breadcrumbItems" />

            <RecipeForm ref="recipeForm" :recipe="recipe" @createRecipe="createRecipe" />
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

import firebase from 'firebase/app'

// @ is an alias to /src
import Navbar from '@/components/Navbar.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import RecipeForm from '@/components/RecipeForm.vue'

export default {
    name: 'create-recipe',
    components: {
        Navbar,
        Breadcrumb,
        RecipeForm
    },
    data () {
        return {
            recipe: {
                types: [],
                ingredients: [],
                instructions: [],
                nutrition: [],
                time: {}
            },
        }
    },
    computed: {
        ...mapState(['user']),
        breadcrumbItems () {
            var breadcrumbItems = [];
            breadcrumbItems.push(
                {
                    text: 'Recipes',
                    to: {
                        name: 'home'
                    }
                },
                {
                    text: 'Create Recipe',
                    active: true
                }
            );
            return breadcrumbItems;
        }
    },
    methods: {
        createRecipe (recipeObj) {
            const created = {
                date: this.moment().format("ddd, DD MMM YYYY"),
                date_time: this.moment().format("ddd, DD MMM YYYY HH:mm:ss ZZ")
            }

            const created_by = {
                displayName: this.user.displayName,
                email: this.user.email,
                uid: this.user.uid
            }

            Object.assign(recipeObj, {created});
            Object.assign(recipeObj, {created_by});

            firebase.firestore().collection("recipes").doc().set(recipeObj)
            .then(response => {
                this.$router.push({name: 'home'});

                this.$refs.recipeForm.saving = false;
            })
            .catch(error => {
                this.$swal("Error", error.message, "error");
            });
        }
    }
};
</script>

<style scoped>
.card-mobile {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}
.remove-item-mobile {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}
</style>
