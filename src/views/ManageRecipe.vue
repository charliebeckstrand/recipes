<template>
    <div class="create-recipe">
        <div class="container">
            <Navbar />

            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <router-link :to="{name: 'home'}" class="breadcrumb-item text-capitalize">Recipes</router-link>
                    <li class="breadcrumb-item text-capitalize active" aria-current="page">
                        <template v-if="!snapshot.id">Create Recipe</template>
                        <template v-else>Edit {{snapshot.id}}</template>
                    </li>
                </ol>
            </nav>

            <template v-if="loadingRecipe">
                <template v-if="loadingRecipe">
                    <content-placeholders>
                        <content-placeholders-heading :img="false" />
                        <content-placeholders-text :lines="5" />
                    </content-placeholders>
                </template>
            </template>
            <template v-else>
                <div class="mb-5 pb-5">
                    <form @submit.prevent="saveRecipe()">

                        <div class="form-group">
                            <label for="title">Name</label>
                            <input type="text" class="form-control" v-model="recipe.name">
                        </div>

                        <div class="form-group">
                            <label for="recipeType">Type<span v-if="recipe.types && recipe.types.length > 1">s</span></label>
                            <v-selectize v-model="recipe.types" :options="types" multiple />
                        </div>

                        <div class="form-group mb-2">
                            <label for="ingredients">Ingredients</label>
                            <div :class="{'mt-1': ingredientIndex !== 0}" v-for="(ingredient, ingredientIndex) in recipe.ingredients" v-if="(recipe.ingredients && recipe.ingredients.length)">
                                <!-- desktop -->
                                <div class="input-group d-lg-flex d-none">
                                    <input type="text" class="form-control col-4" placeholder="Amount" v-model="ingredient.amount">
                                    <select class="custom-select col-4" v-model="ingredient.measurement">
                                        <option value="" selected disabled>Measurement</option>
                                        <option :value="measurement.measurement" v-for="measurement in measurements">{{measurement.measurement}}</option>
                                    </select>
                                    <input type="text" class="form-control col-4" placeholder="Ingredient" v-model="ingredient.ingredient">
                                    <div class="input-group-append">
                                        <button type="button" class="btn btn-outline-danger" @click.prevent="removeIngredient(ingredientIndex)">
                                            -
                                        </button>
                                    </div>
                                </div>
                                <!-- mobile -->
                                <div class="d-flex d-lg-none">
                                    <div class="card flex-grow-1 card-mobile">
                                        <div class="card-body p-1 bg-light">
                                            <div class="mb-1">
                                                <input type="text" class="form-control" placeholder="Amount" v-model="ingredient.amount">
                                            </div>
                                            <div class="mb-1">
                                                <select class="custom-select" v-model="ingredient.measurement">
                                                    <option value="" selected disabled>Measurement</option>
                                                    <option :value="measurement.measurement" v-for="measurement in measurements">{{measurement.measurement}}</option>
                                                </select>
                                            </div>
                                            <div>
                                                <input type="text" class="form-control" placeholder="Ingredient" v-model="ingredient.ingredient">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="d-flex">
                                        <button type="button" class="btn btn-outline-danger remove-item-mobile" @click.prevent="removeIngredient(ingredientIndex)">
                                            -
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="alert bg-danger text-white mb-2" v-if="!recipe.ingredients || recipe.ingredients && !recipe.ingredients.length">
                                At least one ingredient is required
                            </div>
                        </div>

                        <div class="mb-3">
                            <button type="button" class="btn btn-sm btn-outline-primary" @click.prevent="addIngredient()">
                                Add Ingredient
                            </button>
                        </div>

                        <div class="form-group mb-2">
                            <label for="instructions">Instructions</label>
                            <div :class="{'mt-1': instructionIndex !== 0}" v-for="(instruction, instructionIndex) in recipe.instructions" v-if="recipe.instructions && recipe.instructions.length">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">Step {{instructionIndex + 1}}</span>
                                    </div>
                                    <textarea class="form-control" placeholder="Instruction" rows="3" v-model="instruction.instruction" />
                                    <div class="input-group-append">
                                        <button type="button" class="btn btn-outline-danger" @click.prevent="removeInstrution(instructionIndex)">-</button>
                                    </div>
                                </div>
                            </div>
                            <div class="alert bg-danger text-white mb-2" v-if="!recipe.instructions || recipe.instructions && !recipe.instructions.length">
                                At least one instruction step is required
                            </div>
                        </div>

                        <div class="mb-3">
                            <button type="button" class="btn btn-sm btn-outline-primary" @click.prevent="addInstruction()">
                                Add Instruction
                            </button>
                        </div>

                        <div class="form-group">
                            <label for="recipePrepTime">Prep Time</label>
                            <input type="number" min="1" class="form-control" v-model="recipe.prep_time">
                        </div>
                        <div class="form-group">
                            <label for="recipeCookTime">Cook Time</label>
                            <input type="number" min="1" class="form-control" v-model="recipe.cook_time">
                        </div>
                        <div class="form-group">
                            <label for="recipeTotalTime">Total Time</label>
                            <input type="number" min="1" class="form-control" v-model="recipe.total_time">
                        </div>

                        <div class="form-group mb-2">
                            <div :class="{'mt-1': nutritionIndex !== 0}" v-for="(fact, nutritionIndex) in recipe.nutrition">
                                <!-- desktop -->
                                <div class="d-lg-block d-none">
                                    <label for="nutrition-facts">Nutrition Facts</label>
                                    <div :class="{'mt-1': nutritionIndex !== 0}" v-for="(fact, nutritionIndex) in recipe.nutrition" v-if="recipe.nutrition && recipe.nutrition.length">
                                        <div class="input-group">
                                            <input type="text" class="form-control" placeholder="Fact" v-model="fact.fact">
                                            <input type="text" class="form-control" placeholder="Amount" v-model="fact.amount">
                                            <div class="input-group-append">
                                                <button type="button" class="btn btn-outline-danger" @click.prevent="removeNutrition(nutritionIndex)">-</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="alert bg-warning text-white mb-2" v-if="!recipe.nutrition || recipe.nutrition && !recipe.nutrition.length">
                                        0 nutrition facts added
                                    </div>
                                </div>
                                <!-- mobile -->
                                <div class="d-lg-none d-flex">
                                    <div class="card flex-grow-1 card-mobile">
                                        <div class="card-body p-1 bg-light">
                                            <div class="mb-1">
                                                <input type="text" class="form-control" placeholder="Fact" v-model="fact.fact">
                                            </div>
                                            <div>
                                                <input type="text" class="form-control" placeholder="Amount" v-model="fact.amount">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="d-flex">
                                        <button type="button" class="btn btn-outline-danger remove-item-mobile" @click.prevent="removeNutrition(nutritionIndex)">
                                            -
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <button type="button" class="btn btn-sm btn-outline-primary" @click.prevent="addNutrition()">
                                Add Nutrition Fact
                            </button>
                        </div>

                        <button type="submit" class="btn" :class="{'btn-success': !snapshot.id, 'btn-primary': snapshot.id}">
                            <template v-if="!snapshot.id">Create</template>
                            <template v-else>Edit</template> Recipe
                        </button>
                    </form>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase/app';
import VSelectize from '@isneezy/vue-selectize';
import 'selectize/dist/css/selectize.css';

// @ is an alias to /src
import Navbar from "@/components/Navbar.vue";

export default {
    name: "create-recipe",
    components: {
        VSelectize,

        Navbar
    },
    props: ['recipe_key'],
    data() {
        return {
            types: ['breakfast', 'lunch', 'dinner', 'desert', 'snack', 'drink'],

            measurements: [
                {
                    measurement: "cup"
                },
                {
                    measurement: "tbsp"
                },
                {
                    measurement: "ssp"
                },
                {
                    measurement: "oz"
                },
                {
                    measurement: "whole"
                },
                {
                    measurement: "half"
                },
                {
                    measurement: "quarter"
                },
                {
                    measurement: "pinch"
                },
                {
                    measurement: "dash"
                }
            ],

            snapshot: {},

            recipe: {
                ingredients: [
                    {
                        amount: "",
                        measurement: "",
                        ingredient: ""
                    }
                ],
                instructions: [
                    {}
                ],
                nutrition: [
                    {}
                ]
            },

            loadingRecipe: false
        }
    },
    methods: {
        getRecipe() {
            this.loadingRecipe = true;

            let ref = firebase.firestore().collection('recipes').doc(this.recipe_key);

            ref.get().then(snapshot => {
                if (snapshot.exists) {
                    this.snapshot = snapshot;
                    this.recipe = snapshot.data();

                    this.loadingRecipe = false;
                } else {
                    console.log("No such document exists!");

                    this.loadingRecipe = false;
                }
            })
        },
        addType() {
            this.recipe.types.push({
                type: ""
            });
        },
        addIngredient() {
            this.recipe.ingredients.push(
                {
                    amount: "",
                    measurement: "",
                    ingredient: ""
                }
            );
        },
        removeIngredient(ingredientIndex) {
            this.recipe.ingredients.splice(ingredientIndex, 1);
        },
        addInstruction() {
            this.recipe.instructions.push({});
        },
        removeInstrution(instructionIndex) {
            this.recipe.instructions.splice(instructionIndex, 1);
        },
        addNutrition() {
            this.recipe.nutrition.push({});
        },
        removeNutrition(nutritionIndex) {
            this.recipe.nutrition.splice(nutritionIndex, 1);
        },
        saveRecipe() {

        },
    },
    mounted() {
        if(this.recipe_key) {
            this.getRecipe();
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
