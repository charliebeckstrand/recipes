<template>
    <div class="view-recipe">
        <div class="container">
            <Navbar />

            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <router-link :to="{name: 'home'}" class="breadcrumb-item text-capitalize">Recipes</router-link>
                    <li class="breadcrumb-item text-capitalize active" aria-current="page" v-if="recipe.name">
                        {{recipe.name}}
                    </li>
                </ol>
            </nav>

            <template v-if="loadingRecipe">
                <content-placeholders>
                    <content-placeholders-heading :img="false" />
                    <content-placeholders-text :lines="5" />
                </content-placeholders>
            </template>
            <template v-else>
                <div class="mb-3 pb-3">
                    <h3 class="mb-3">
                        <span class="text-capitalize">{{recipe.name}}</span><sup class="d-none text-muted" v-if="recipe.types && recipe.types.length"> (<span class="recipe-type" v-for="type in recipe.types">{{type}}</span>)</sup>
                    </h3>

                    <div class="row">
                        <div class="col-lg-4 mb-3" v-if="recipe.prep_time">
                            <div class="card">
                                <h5 class="card-header text-uppercase">Prep Time</h5>
                                <div class="card-body">
                                    <p class="card-text">
                                        <span class="badge" :class="{'badge-success': recipe.prep_time < 10, 'badge-warning': recipe.prep_time >= 10 && recipe.prep_time < 30, 'badge-danger': recipe.prep_time >= 30}">
                                            {{recipe.prep_time}} minutes
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4 mb-3 pl-lg-0" v-if="recipe.cook_time">
                            <div class="card">
                                <h5 class="card-header text-uppercase">Cook Time</h5>
                                <div class="card-body">
                                    <p class="card-text">
                                        <span class="badge" :class="{'badge-success': recipe.cook_time < 10, 'badge-warning': recipe.cook_time >= 10 && recipe.cook_time < 30, 'badge-danger': recipe.cook_time >= 30}">
                                            {{recipe.cook_time}} minutes
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-4 pl-lg-0" v-if="recipe.total_time">
                            <div class="card mb-3">
                                <h5 class="card-header text-uppercase">Total Time</h5>
                                <div class="card-body">
                                    <p class="card-text">
                                        <span class="badge" :class="{'badge-success': recipe.total_time < 10, 'badge-warning': recipe.total_time >= 10 && recipe.total_time < 30, 'badge-danger': recipe.total_time >= 30}">
                                            {{recipe.total_time}} minutes
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card mb-3" v-if="recipe.ingredients && recipe.ingredients.length">
                        <h5 class="card-header text-uppercase">Ingredients</h5>
                        <div class="list-group list-group-flush">
                            <div class="list-group-item" v-for="ingredient in recipe.ingredients">
                                - <strong>{{ingredient.measurement}}</strong> {{ingredient.ingredient}}
                            </div>
                        </div>
                    </div>

                    <div class="card mb-3" v-if="recipe.instructions && recipe.instructions.length">
                        <h5 class="card-header text-uppercase">Instructions</h5>
                        <div class="list-group list-group-flush">
                            <div class="list-group-item" v-for="(instruction, instructionIndex) in recipe.instructions">
                                {{instructionIndex + 1}}. {{instruction}}
                            </div>
                        </div>
                    </div>
                </div>
            </template>

        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import Navbar from "@/components/Navbar.vue";

import { db } from '@/main';

export default {
    name: "view-recipe",
    components: {
        Navbar
    },
    data() {
        return {
            recipe: {},

            loadingRecipe: false
        }
    },
    props: ['recipe_id'],
    methods: {
        getRecipe() {
            this.loadingRecipe = true;
            let ref = db.collection('recipes').doc(this.recipe_id)
            ref.get()
            .then(snapshot => {
                if (snapshot.exists) {
                    this.recipe = snapshot.data();

                    this.loadingRecipe = false;
                } else {
                    console.log("No such document exists!");

                    this.loadingRecipe = false;
                }
            })
        }
    },
    mounted() {
        this.getRecipe();
    }
};
</script>

<style lang="scss">
.recipe-type + .recipe-type:before {
    content: ", ";
}
</style>
