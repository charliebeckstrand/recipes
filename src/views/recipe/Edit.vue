<template>
    <div class="create-recipe">
        <div class="container">
            <Navbar />

            <template v-if="!resolved">
                <div class="spinner-grow" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </template>
            <template v-else>
                <Breadcrumb :breadcrumbItems="breadcrumbItems" />

                <RecipeForm :recipe="recipe" :recipe_key="recipe_key" @editRecipe="editRecipe" />
            </template>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase/app';

// @ is an alias to /src
import Navbar from "@/components/Navbar.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";
import RecipeForm from "@/components/RecipeForm.vue";

export default {
    name: "create-recipe",
    components: {
        Navbar,
        Breadcrumb,
        RecipeForm
    },
    props: ["recipe_key"],
    data() {
        return {
            resolved: false
        }
    },
    firestore() {
        return {
            recipe: {
                ref: firebase.firestore().collection('test_recipes').doc(this.recipe_key),
                resolve: () => {
                    this.resolved = true;
                },
                reject: (error) => {
                    this.$swal({
                        toast: true,
                        html: error.message,
                        type: 'error',
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 5000
                    });
                    this.resolved = true;
                }
            }
        }
    },
    computed: {
        breadcrumbItems() {
            var breadcrumbItems = [];
            if(this.recipe.name) {
                var message = 'Edit "' + this.recipe.name + '"';
            } else {
                var message = 'Edit "' + this.recipe['.key'] + '"';
            }
            breadcrumbItems.push(
                {
                    text: 'Recipes',
                    to: {
                        name: 'home'
                    }
                },
                {
                    text: message,
                    active: true
                }
            );
            return breadcrumbItems;
        },
        currentUser() {
			return firebase.auth().currentUser;
		}
    },
    methods: {
        editRecipe(recipeObj) {

            var name = recipeObj.name;
            var description = recipeObj.description;

            var types = recipeObj.types;
            var ingredients = recipeObj.ingredients;
            var instructions = recipeObj.instructions;
            var nutrition = recipeObj.nutrition;

            var time = recipeObj.time;
            var created = recipeObj.created;
            var created_by = recipeObj.created_by;

            var updated = {
                date: this.moment().format("MM-DD-YYYY"),
                date_time: this.moment().format("MM-DD-YYYY HH:mm:ss")
            };

            if(!description) { var description = null };
            if(!types || types && !types.length) { var types = [] };
            if(!ingredients || ingredients && !ingredients.length) { var ingredients = [] };
            if(!instructions || instructions && !instructions.length) { var instructions = [] };
            if(!nutrition || nutrition && !nutrition.length) { var nutrition = [] };

            if(!time) { var time = {} };
            if(!created) { var created = {} };
            if(!created_by) { var created_by = {} };

            if(this.recipe_key) {
                firebase.firestore().collection("test_recipes").doc(this.recipe_key).update({
                    name: name,
                    description: description,

                    types: types,
                    ingredients: ingredients,
                    instructions: instructions,
                    nutrition: nutrition,

                    time: time,
                    created: created,
                    created_by: created_by,
                    updated: updated
                })
                .then(response => {
                    this.$router.push({name: 'home'});
                })
                .catch(error => {
                    this.$swal("Error", error.message, "error");
                });
            }
        },
    }
};
</script>
