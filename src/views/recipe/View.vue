<template>
    <div class="view-recipe">
        <div class="container">
            <Navbar />

            <template v-if="!resolved">
                <div class="spinner-grow" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </template>
            <template v-else>

                <Breadcrumb :breadcrumbItems="breadcrumbItems" />

                <div class="mb-5 pb-5">
                    <b-card no-body>
                        <b-card-header class="h5">
                            {{recipe.name}}
                        </b-card-header>
                        <b-card-body v-if="recipe.description">
                            <p class="card-text">{{recipe.description}}</p>
                        </b-card-body>
                        <b-card-footer :class="{'border-top-0': !recipe.description}" v-if="recipe.ingredients && recipe.ingredients.length || recipe.instructions && recipe.instructions.length || recipe.nutrition && recipe.nutrition.length">
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

                        <b-card-footer :class="{'border-top-0': !recipe.description}">
                            <small class="text-muted">
                                <template v-if="recipe.created_by && recipe.created_by.displayName">{{recipe.created_by.displayName}}</template><template v-if="recipe.created_by && recipe.created_by.email && !recipe.created_by.displayName">{{recipe.created_by.email}}</template> <template v-if="recipe.created && recipe.created.date_time"> &middot; {{moment(recipe.created.date_time).fromNow()}}</template>
                            </small>
                        </b-card-footer>
                    </b-card>

                    <template v-if="user && user.uid">
                            <Comments :recipe_key="recipe_key" :recipe="recipe" class="mt-3" />
                    </template>
                </div>
            </template>

        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

import firebase from 'firebase/app'

// @ is an alias to /src
import Navbar from '@/components/Navbar.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import Comments from '@/components/Comments.vue'

export default {
    name: 'view-recipe',
    components: {
        Navbar,
        Breadcrumb,
        Comments
    },
    props: ['recipe_key'],
    data () {
        return {
            showIngredientsTab: true,
            showInstructionsTab: false,
            showNutritionTab: false,

            resolved: false
        }
    },
    firestore () {
        return {
            recipe: {
                ref: firebase.firestore().collection('recipes').doc(this.recipe_key),
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
                }
            }
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
                    text: this.recipe.name,
                    active: true
                }
            );
            return breadcrumbItems;
        }
    },
    methods: {
        toggleIngredientsTab () {
            this.showIngredientsTab = true;
            this.showInstructionsTab = false;
            this.showNutritionTab = false;
        },
        toggleInstructionsTab () {
            this.showIngredientsTab = false;
            this.showInstructionsTab = true;
            this.showNutritionTab = false;
        },
        toggleNutrutionTab () {
            this.showIngredientsTab = false;
            this.showInstructionsTab = false;
            this.showNutritionTab = true;
        }
    }
};
</script>

<style scoped>
.img-thumbnail {
    height: 100px;
    width: 100px;
}
@media(max-width: 767px) {
    .img-thumbnail {
        height: 150px;
        width: 150px;
    }
}
</style>

<style lang="scss">

</style>
