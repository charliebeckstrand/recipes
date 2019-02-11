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
                <div class="mb-5 pb-5">

                    <div class="d-flex flex-md-row flex-column my-4 align-items-center">
                        <div class="mb-md-0 mb-3" v-if="recipe.thumbnail">
                            <a :href="recipe.thumbnail" class="d-flex img-thumbnail" target="_blank">
                                <img :src="recipe.thumbnail" class="img-fluid rounded my-auto" height="auto">
                            </a>
                        </div>
                        <div class="mb-md-0 mb-3" v-else>
                            <div class="img-thumbnail">
                                <img src="http://placehold.it/500x500/e9ecef/e9ecef" class="img-fluid rounded my-auto" height="auto">
                            </div>
                        </div>
                        <div class="ml-md-3 ml-0">
                            <h5 :class="{'mb-1': recipe.description || recipe.types && recipe.types.length || recipe.total_time}">
                                <span class="text-capitalize">{{recipe.name}}</span>
                            </h5>

                            <p class="text-muted text-lg-left text-justify m-0" :class="{'mb-1': recipe.types && recipe.types.length}">
                                {{recipe.description}}
                            </p>

                            <div>
                                <span class="badge badge-secondary" v-for="type in recipe.types">{{type}}</span>
                            </div>

                            <!-- <div class="d-flex">
                                <div>
                                    <span class="badge badge-secondary" v-for="type in recipe.types">{{type}}</span>
                                </div>
                                <div class="ml-1" v-if="recipe.total_time">
                                    <span class="badge" :class="{'badge-success': recipe.total_time < 10, 'badge-warning': recipe.total_time >= 10 && recipe.total_time < 30, 'badge-danger': recipe.total_time >= 30}">{{recipe.total_time}} minutes</span>
                                </div>
                            </div> -->

                        </div>
                    </div>

                    <div class="row">
                        <div class="mb-lg-3 mb-1" :class="{'col-lg-4': recipe.prep_time && recipe.cook_time && recipe.total_time, 'col': recipe.prep_time && (!recipe.cook_time || !recipe.total_time)}" v-if="recipe.prep_time">
                            <div class="card">
                                <h6 class="card-header text-uppercase">Prep Time</h6>
                                <div class="card-body">
                                    <p class="card-text">
                                        <span class="badge" :class="{'badge-success': recipe.prep_time < 10, 'badge-warning': recipe.prep_time >= 10 && recipe.prep_time < 30, 'badge-danger': recipe.prep_time >= 30}">
                                            {{recipe.prep_time}} minutes
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="mb-lg-3 mb-1" :class="{'col-lg-4 pl-lg-0': recipe.prep_time && recipe.cook_time && recipe.total_time, 'col': recipe.cook_time && (!recipe.prep_time || !recipe.total_time)}" v-if="recipe.cook_time">
                            <div class="card">
                                <h6 class="card-header text-uppercase">Cook Time</h6>
                                <div class="card-body">
                                    <p class="card-text">
                                        <span class="badge" :class="{'badge-success': recipe.cook_time < 10, 'badge-warning': recipe.cook_time >= 10 && recipe.cook_time < 30, 'badge-danger': recipe.cook_time >= 30}">
                                            {{recipe.cook_time}} minutes
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="mb-3" :class="{'col-lg-4 pl-lg-0': recipe.prep_time && recipe.cook_time && recipe.total_time, 'col': recipe.total_time && (!recipe.prep_time || !recipe.cook_time)}" v-if="recipe.total_time">
                            <div class="card">
                                <h6 class="card-header text-uppercase">Total Time</h6>
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

                    <ul class="nav nav-tabs mb-3" v-if="recipe.ingredients || recipe.instructions || recipe.nutrition">
                        <li class="nav-item d-block text-lg-left text-center" v-if="recipe.ingredients && recipe.ingredients.length">
                            <a class="nav-link" :class="{'active': showIngredientsTab}" href="#" @click.prevent="toggleIngredientsTab()">
                                Ingredients
                            </a>
                        </li>
                        <li class="nav-item d-block text-lg-left text-center" v-if="recipe.instructions && recipe.instructions.length">
                            <a class="nav-link" :class="{'active': showInstructionsTab}" href="#" @click.prevent="toggleInstructionsTab()">
                                Instructions
                            </a>
                        </li>
                        <li class="nav-item d-block text-lg-left text-center" v-if="recipe.nutrition">
                            <a class="nav-link" :class="{'active': showNutritionTab}" href="#" @click.prevent="toggleNutrutionTab()">
                                Nutrition
                            </a>
                        </li>
                    </ul>

                    <div class="tab-content">
                        <div class="tab-pane" :class="{'active': showIngredientsTab}" v-if="recipe.ingredients && recipe.ingredients.length">
                            <div class="list-group">
                                <div class="list-group-item" v-for="ingredient in recipe.ingredients">
                                    &ndash;	<strong>{{ingredient.measurement}}</strong> {{ingredient.ingredient}}
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane" :class="{'active': showInstructionsTab}" v-if="recipe.instructions && recipe.instructions.length">
                            <div class="list-group">
                                <div class="list-group-item" v-for="(instruction, instructionIndex) in recipe.instructions">
                                    {{instructionIndex + 1}}. {{instruction}}
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane" :class="{'active': showNutritionTab}" v-if="recipe.nutrition">
                            <div class="list-group">
                                <div class="list-group-item" v-if="recipe.nutrition.serving_size">
                                    Serving Size: <strong>{{recipe.nutrition.serving_size}}</strong>
                                </div>
                                <div class="list-group-item" v-if="recipe.nutrition.calories">
                                    Calories: <strong>{{recipe.nutrition.calories}}</strong>
                                </div>
                                <div class="list-group-item" v-if="recipe.nutrition.sugar">
                                    Sugar: <strong>{{recipe.nutrition.sugar}}</strong>
                                </div>
                                <div class="list-group-item" v-if="recipe.nutrition.fat">
                                    Fat: <strong>{{recipe.nutrition.fat}}</strong>
                                </div>
                                <div class="list-group-item" v-if="recipe.nutrition.carbohydrates">
                                    Carbohydrates: <strong>{{recipe.nutrition.carbohydrates}}</strong>
                                </div>
                                <div class="list-group-item" v-if="recipe.nutrition.fiber">
                                    Fiber: <strong>{{recipe.nutrition.fiber}}</strong>
                                </div>
                                <div class="list-group-item" v-if="recipe.nutrition.protein">
                                    Protein: <strong>{{recipe.nutrition.protein}}</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- <div class="card mb-3" v-if="recipe.ingredients && recipe.ingredients.length">
                        <h5 class="card-header bg-white text-uppercase">Ingredients</h5>
                        <div class="list-group list-group-flush">
                            <div class="list-group-item bg-light" v-for="ingredient in recipe.ingredients">
                                &ndash;	<strong>{{ingredient.measurement}}</strong> {{ingredient.ingredient}}
                            </div>
                        </div>
                    </div> -->

                    <!-- <div class="card mb-3" v-if="recipe.instructions && recipe.instructions.length">
                        <h5 class="card-header bg-white text-uppercase">Instructions</h5>
                        <div class="list-group list-group-flush">
                            <div class="list-group-item bg-light" v-for="(instruction, instructionIndex) in recipe.instructions">
                                {{instructionIndex + 1}}. {{instruction}}
                            </div>
                        </div>
                    </div> -->

                    <!-- <div class="card mb-3" v-if="recipe.nutrition">
                        <h5 class="card-header alert-warning text-uppercase">Nutrition</h5>
                        <div class="list-group list-group-flush">
                            <div class="list-group-item">
                                &bull; Serving Size <strong>{{recipe.nutrition.serving_size}}</strong>
                            </div>
                        </div>
                    </div> -->
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
    name: "view-recipe",
    components: {
        Navbar
    },
    props: ['recipe_id'],
    data() {
        return {
            recipe: {},

            loadingRecipe: false,

            showIngredientsTab: true,
            showInstructionsTab: false,
            showNutritionTab: false
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    methods: {
        getRecipe() {
            this.loadingRecipe = true;

            let ref = firebase.firestore().collection('recipes').doc(this.recipe_id);

            ref.get().then(snapshot => {
                if (snapshot.exists) {
                    this.recipe = snapshot.data();

                    this.loadingRecipe = false;
                } else {
                    console.log("No such document exists!");

                    this.loadingRecipe = false;
                }
            })
        },
        toggleIngredientsTab() {
            this.showIngredientsTab = true;
            this.showInstructionsTab = false;
            this.showNutritionTab = false;
        },
        toggleInstructionsTab() {
            this.showIngredientsTab = false;
            this.showInstructionsTab = true;
            this.showNutritionTab = false;
        },
        toggleNutrutionTab() {
            this.showIngredientsTab = false;
            this.showInstructionsTab = false;
            this.showNutritionTab = true;
        }
    },
    mounted() {
        this.getRecipe();
    }
};
</script>

<style scoped>
/* .form-control:disabled, .form-control[readonly] {
    background-color: #FFFFFF;
} */
</style>

<style lang="scss">
.img-thumbnail {
    height: 75px;
    width: 75px;
}
.recipe-type + .recipe-type:before {
    content: ", ";
}
@media(max-width: 768px) {
    .nav-tabs {
        border-bottom: 0;
    }
    .nav-tabs .nav-item {
        width: 100%;
    }
    .nav-tabs .nav-item {
        border-radius: 4px;
    }
    .nav-tabs .nav-link:focus,
    .nav-tabs .nav-link:hover {
        border-color: transparent;
    }
    .nav-tabs .nav-item.show .nav-link,
    .nav-tabs .nav-link.active {
        border-color: #dee2e6;
        border-radius: 4px;
        background-color: #007bff;
        color: #FFFFFF;
    }
}
</style>
