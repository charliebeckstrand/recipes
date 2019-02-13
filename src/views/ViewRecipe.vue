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
                        <h5 slot="header" class="d-flex mb-0">
                            <div class="align-self-center mr-3">
                                {{recipe.name}}
                            </div>
                            <div class="align-self-center ml-auto">
                                <div class="d-flex">
                                    <!-- <div v-if="currentUser && currentUser.uid && (recipe.created_by && recipe.created_by.uid == currentUser.uid)">
                                        <a href="#" class="text-secondary" @click.prevent="editRecipe(recipe)">
                                            <font-awesome-icon :icon="['far', 'pen']" fixed-width />
                                        </a>
                                    </div>
                                    <div v-if="currentUser && currentUser.uid && (recipe.created_by && recipe.created_by.uid == currentUser.uid)" class="ml-2">
                                        <a href="#" class="text-secondary" @click.prevent="deleteRecipe(recipe)">
                                            <font-awesome-icon :icon="['far', 'trash-alt']" fixed-width />
                                        </a>
                                    </div> -->
                                </div>
                            </div>
                        </h5>
                        <b-card-body>
                            <p class="card-text" v-if="recipe.description">{{recipe.description}}</p>
                        </b-card-body>
                        <b-card-footer>
                            <b-nav pills>
                              <b-nav-item v-if="recipe.ingredients && recipe.ingredients.length" :active="showIngredientsTab" @click="toggleIngredientsTab()">Ingredients</b-nav-item>
                              <b-nav-item v-if="recipe.instructions && recipe.instructions.length" :active="showInstructionsTab" @click="toggleInstructionsTab()">Instructions</b-nav-item>
                              <b-nav-item v-if="recipe.nutrition && recipe.nutrition.length" :active="showNutritionTab" @click="toggleNutrutionTab()">Nutrition</b-nav-item>
                            </b-nav>
                        </b-card-footer>
                        <b-list-group v-if="showIngredientsTab" flush>
                            <b-list-group-item v-for="ingredient in recipe.ingredients">
                                <em>{{ingredient.amount}} {{ingredient.measurement}} </em> <u>{{ingredient.ingredient}}</u>
                            </b-list-group-item>
                        </b-list-group>

                        <b-list-group v-if="showInstructionsTab" flush>
                            <b-list-group-item v-for="(instruction, instructionIndex) in recipe.instructions">
                                {{instructionIndex + 1}}. {{instruction.instruction}}
                            </b-list-group-item>
                        </b-list-group>

                        <b-list-group v-if="showNutritionTab" flush>
                            <b-list-group-item v-for="fact in recipe.nutrition">
                                <strong>{{fact.amount}}</strong> {{fact.fact}}
                            </b-list-group-item>
                        </b-list-group>

                        <b-card-footer>
                            <small class="text-muted">created by <template v-if="recipe.created_by && recipe.created_by.displayName">{{recipe.created_by.displayName}}</template><template v-if="recipe.created_by && recipe.created_by.email && !recipe.created_by.displayName">{{recipe.created_by.email}}</template></small>
                        </b-card-footer>
                    </b-card>

                    <!-- <div class="d-flex">
                        <div v-if="recipe.types && recipe.types.length">
                            <span v-if="recipe.types.length < 3" class="badge badge-secondary" :class="{'ml-1': recipe.created_by_display_name}" v-for="type in recipe.types">
                                {{type}}
                            </span>
                            <span v-if="recipe.types.length >= 3" class="badge badge-secondary cursor-pointer" :class="{'ml-1': currentUser && currentUser.displayName}" v-tippy="{placement: 'bottom', html: '#types', arrow: true, theme: 'light', hideOnClick: false, delay: [100, 0]}">
                                {{recipe.types.length}} types
                                <div id="types" class="d-none">
                                    <span v-for="(type, typeIndex) in recipe.types">{{type}}<span v-if="typeIndex + 1 < recipe.types.length">, </span></span>
                                </div>
                            </span>
                        </div>
                        <div :class="{'ml-1': recipe.types && recipe.types.length || recipe.created_by_display_name}">
                            <template v-if="recipe.total_time">
                                <span class="badge" :class="{'badge-success': recipe.total_time < 10, 'badge-warning': recipe.total_time >= 10 && recipe.total_time < 30, 'badge-danger': recipe.total_time >= 30}">{{recipe.total_time}} minutes</span>
                            </template>
                            <template v-else>
                                <span class="badge badge-danger">time not specified</span>
                            </template>
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
