<template>
    <div class="view-recipe">
        <div class="container">
            <Navbar />

            <template v-if="loadingRecipe">
                <div class="spinner-grow" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </template>
            <template v-else>
                <!-- <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <router-link :to="{name: 'home'}" class="breadcrumb-item text-capitalize">Recipes</router-link>
                        <li class="breadcrumb-item text-capitalize active" aria-current="page" v-if="recipe.name">
                            {{recipe.name}}
                        </li>
                    </ol>
                </nav> -->

                <Breadcrumb :breadcrumbItems="breadcrumbItems" />

                <div class="mb-5 pb-5">

                    <b-card no-body>
                        <!-- <h5 class="card-header d-flex mb-0">
                            {{recipe.name}}
                        </h5> -->
                        <b-card-header class="h5">
                            {{recipe.name}}
                        </b-card-header>
                        <b-card-body v-if="recipe.description">
                            <p class="card-text">{{recipe.description}}</p>
                        </b-card-body>
                        <b-card-footer :class="{'border-top-0': !recipe.description}">
                            <div class="d-flex">
                                <b-nav pills>
                                  <b-nav-item v-if="recipe.ingredients && recipe.ingredients.length" :active="showIngredientsTab" @click="toggleIngredientsTab()">Ingredients</b-nav-item>
                                  <b-nav-item v-if="recipe.instructions && recipe.instructions.length" :active="showInstructionsTab" @click="toggleInstructionsTab()">Instructions</b-nav-item>
                                  <b-nav-item v-if="recipe.nutrition && recipe.nutrition.length" :active="showNutritionTab" @click="toggleNutrutionTab()">Nutrition</b-nav-item>
                                </b-nav>
                            </div>
                        </b-card-footer>
                        <b-list-group flush v-if="showIngredientsTab">
                            <b-list-group-item v-for="ingredient in recipe.ingredients">
                                {{ingredient.amount}} {{ingredient.measurement}} <u>{{ingredient.ingredient}}</u>
                            </b-list-group-item>
                        </b-list-group>

                        <b-list-group flush v-if="showInstructionsTab">
                            <b-list-group-item v-for="(instruction, instructionIndex) in recipe.instructions">
                                {{instructionIndex + 1}}. {{instruction.instruction}}
                            </b-list-group-item>
                        </b-list-group>

                        <b-list-group flush v-if="showNutritionTab">
                            <b-list-group-item v-for="fact in recipe.nutrition">
                                <strong>{{fact.amount}}</strong> {{fact.fact}}
                            </b-list-group-item>
                        </b-list-group>

                        <!-- <b-card-footer :class="{'border-top-0': !recipe.description}">
                            <small class="text-muted">created by <template v-if="recipe.created_by && recipe.created_by.displayName">{{recipe.created_by.displayName}}</template><template v-if="recipe.created_by && recipe.created_by.email && !recipe.created_by.displayName">{{recipe.created_by.email}}</template></small>
                        </b-card-footer> -->
                    </b-card>
                </div>
            </template>

        </div>
    </div>
</template>

<script>
import firebase from 'firebase/app';

// @ is an alias to /src
import Navbar from "@/components/Navbar.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";

export default {
    name: "view-recipe",
    components: {
        Navbar,
        Breadcrumb
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
        currentUser() {
            return firebase.auth().currentUser;
        },
        breadcrumbItems() {
            var breadcrumbItems = [];
            breadcrumbItems.push({
                text: 'Recipes',
                to: {
                    name: 'home'
                }
            },
            {
                text: this.recipe.name,
                active: true
            });
            return breadcrumbItems;
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

<style lang="scss">

</style>
