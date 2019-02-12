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

                    <div class="d-flex">
                        <div class="d-flex flex-md-row flex-column align-items-center mx-lg-0 mx-auto mb-md-3">
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
                            <div class="ml-md-3 ml-0" :class="{'mb-lg-0 mb-3': recipe.description}">
                                <h4 :class="{'mb-1': recipe.description || recipe.total_time || (recipe.types && recipe.types.length), 'mb-0': !recipe.description && (!recipe.types || recipe.types && !recipe.types.length)}">
                                    <span class="text-capitalize">{{recipe.name}}</span>
                                </h4>

                                <p class="text-muted m-0 d-md-block d-none" :class="{'mb-1': recipe.types && recipe.types.length}">
                                    {{recipe.description}}
                                </p>

                                <!-- <div>
                                    <span class="badge badge-secondary" v-for="type in recipe.types">{{type}}</span>
                                </div> -->

                                <div class="d-flex">
                                    <div>
                                        <span class="badge badge-secondary" v-for="type in recipe.types">{{type}}</span>
                                    </div>
                                    <div class="ml-1" v-if="recipe.total_time">
                                        <span class="badge" :class="{'badge-success': recipe.total_time < 10, 'badge-warning': recipe.total_time >= 10 && recipe.total_time < 30, 'badge-danger': recipe.total_time >= 30}">{{recipe.total_time}} minutes</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p class="text-muted text-center mb-3 d-md-none d-block" :class="{'mb-1': recipe.types && recipe.types.length}">
                        {{recipe.description}}
                    </p>

                    <!-- <div class="d-flex mb-3">
                        <div class="d-flex mx-md-0 mx-auto">
                            <div class="form-group">
                                <label class="mb-0" for="prep-time">Prep Time</label>
                                <div>
                                    <span class="badge" :class="{'badge-success': recipe.prep_time < 10, 'badge-warning': recipe.prep_time >= 10 && recipe.prep_time < 30, 'badge-danger': recipe.prep_time >= 30}">
                                        {{recipe.prep_time}} minutes
                                    </span>
                                </div>
                            </div>
                            <div class="form-group ml-2">
                                <label class="mb-0" for="cook-time">Cook Time</label>
                                <div>
                                    <span class="badge" :class="{'badge-success': recipe.cook_time < 10, 'badge-warning': recipe.cook_time >= 10 && recipe.cook_time < 30, 'badge-danger': recipe.cook_time >= 30}">
                                        {{recipe.cook_time}} minutes
                                    </span>
                                </div>
                            </div>
                            <div class="form-group ml-2">
                                <label class="mb-0" for="total-time">Total Time</label>
                                <div>
                                    <span class="badge" :class="{'badge-success': recipe.total_time < 10, 'badge-warning': recipe.total_time >= 10 && recipe.total_time < 30, 'badge-danger': recipe.total_time >= 30}">
                                        {{recipe.total_time}} minutes
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div> -->

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
                                    <em>{{ingredient.amount}} {{ingredient.measurement}} </em> <strong>{{ingredient.ingredient}}</strong>
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane" :class="{'active': showInstructionsTab}" v-if="recipe.instructions && recipe.instructions.length">
                            <div class="list-group">
                                <div class="list-group-item" v-for="(instruction, instructionIndex) in recipe.instructions">
                                    {{instructionIndex + 1}}. {{instruction.instruction}}
                                </div>
                            </div>
                        </div>
                        <div class="tab-pane" :class="{'active': showNutritionTab}" v-if="recipe.nutrition && recipe.nutrition.length">
                            <div class="list-group">
                                <div class="list-group-item" v-for="fact in recipe.nutrition">
                                    <strong>{{fact.amount}}</strong> {{fact.fact}}
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
    props: ['recipe_key'],
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

            let ref = firebase.firestore().collection('recipes').doc(this.recipe_key);

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
    height: 100px;
    width: 100px;
}
.recipe-type + .recipe-type:before {
    content: ", ";
}
@media(max-width: 767px) {
    .img-thumbnail {
        height: 150px;
        width: 150px;
    }
}
@media(max-width: 767px) {
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
