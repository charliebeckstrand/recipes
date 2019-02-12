<template>
    <div class="home">
        <div class="container">
            <Navbar />

            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item active" aria-current="page">Recipes</li>
                </ol>
            </nav>

            <template v-if="loadingRecipes">
                <content-placeholders>
                    <content-placeholders-text :lines="5" />
                </content-placeholders>
            </template>
            <template v-else>
                <template v-if="user">
                    <div class="mb-3">
                        <router-link :to="{name: 'create-recipe'}" class="btn btn-outline-success">
                            Create Recipe
                        </router-link>
                    </div>
                </template>

                <div class="mb-3" v-if="recipes && recipes.length">
                    <input type="text" class="form-control" placeholder="Search" v-model="search">
                </div>

                <div class="list-group" v-if="filteredRecipes && filteredRecipes.length">
                    <router-link :to="{name: 'view-recipe', params: {recipe_key: recipe['.key']}}" class="list-group-item list-group-item-action" v-for="(recipe, recipeIndex) in filteredRecipes">
                        <div class="d-flex align-items-center">
                            <div class="d-flex img-thumbnail" v-if="recipe.thumbnail">
                                <img :src="recipe.thumbnail" class="img-fluid rounded my-auto">
                            </div>
                            <div class="d-flex img-thumbnail" v-else>
                                <img src="http://placehold.it/500x500/e9ecef/e9ecef" class="img-fluid rounded my-auto">
                            </div>
                            <div class="ml-3">
                                <h6 class="m-0 text-capitalize mr-lg-0 mr-auto">{{recipe.name}}</h6>
                                <div class="d-flex">
                                    <div>
                                        <span class="badge badge-secondary" v-for="type in recipe.types">{{type}}</span>
                                    </div>
                                    <div class="ml-1" v-if="recipe.total_time">
                                        <span class="badge" :class="{'badge-success': recipe.total_time < 10, 'badge-warning': recipe.total_time >= 10 && recipe.total_time < 30, 'badge-danger': recipe.total_time >= 30}">{{recipe.total_time}} minutes</span>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex ml-auto pl-2" v-if="user">
                                <router-link :to="{name: 'edit-recipe', params: {recipe_key: recipe['.key']}}" class="btn btn-sm btn-outline-primary">
                                    <font-awesome-icon :icon="['far', 'edit']" />
                                </router-link>
                                <button type="button" class="btn btn-sm btn-outline-danger ml-1">
                                    <font-awesome-icon :icon="['far', 'trash']" />
                                </button>
                            </div>
                        </div>
                    </router-link>
                </div>
                <div class="alert bg-warning text-white" v-if="!filteredRecipes || filteredRecipes && !filteredRecipes.length">
                    0 recipes match your search
                </div>
                <div class="alert bg-danger text-white" v-if="!recipes || recipes && !recipes.length">
                    0 recipes
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase/app';

// @ is an alias to /src
import Navbar from "@/components/Navbar.vue";

export default {
    name: "home",
    components: {
        Navbar
    },
    data() {
        return {
            recipes: [],

            search: null,

            loadingRecipes: true
        }
    },
    firestore() {
        return {
            recipes: firebase.firestore().collection('recipes'),
        }
    },
    watch: {
        filteredRecipes(recipes) {
            if(recipes && recipes.length) {
                this.loadingRecipes = false;
            }
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        },
        filteredRecipes() {
            var filteredRecipes = [];
            if(this.search) {
                return this.recipes.filter(recipe => {
                    var search = this.search.toLowerCase();
                    var searchMatch = true ? (this.search === '' || recipe.name.toLowerCase().indexOf(search) > -1) : false;

                    if(recipe.types) {
                        var typeMatch = false;
                        var typeMatches = recipe.types.filter(type => {
                            if(type.indexOf(this.search) > -1) {
                                return type;
                            }
                        });
                        var typeMatch = true ? (this.search === '' || typeMatches.length) : false;

                        return searchMatch || typeMatch;
                    } else {
                        return searchMatch;
                    }
                });
            } else {
                filteredRecipes = this.recipes;
            }
            return filteredRecipes;
        }
    }
};
</script>

<style scoped>
.img-thumbnail {
    height: 50px;
    width: 50px;
}
.badge + .badge {
    margin-top: .25rem;
}
</style>
