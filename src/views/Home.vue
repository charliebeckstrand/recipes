<template>
    <div class="home">
        <div class="container">
            <Navbar />

            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item active" aria-current="page">Recipes</li>
                </ol>
            </nav>

            <div class="mb-3">
                <input type="text" class="form-control" placeholder="Search" v-model="search">
            </div>

            <div class="list-group">
                <router-link :to="{name: 'view-recipe', params: {recipe_id: recipe['.key']}}" class="list-group-item list-group-item-action" v-for="(recipe, recipeIndex) in filteredRecipes">
                    <div class="d-flex align-items-center">
                        <div class="d-flex img-thumbnail">
                            <img :src="recipe.thumbnail" class="img-fluid rounded my-auto">
                        </div>
                        <div class="ml-2 text-capitalize">{{recipe.name}}</div>
                        <div class="ml-auto text-right">
                            <span class="badge badge-secondary d-md-inline-block d-block" v-for="type in recipe.types">{{type}}</span>
                        </div>
                    </div>
                </router-link>
            </div>

        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import Navbar from "@/components/Navbar.vue";

import { db } from '@/main';

export default {
    name: "home",
    components: {
        Navbar
    },
    data() {
        return {
            recipes: [],
            search: null
        }
    },
    firestore() {
        return {
            recipes: db.collection('recipes'),
        }
    },
    watch: {
        recipes(recipes) {
            _.forEach(recipes, recipe => {

            });
        }
    },
    computed: {
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
