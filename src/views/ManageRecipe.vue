<template>
    <div class="create-recipe">
        <div class="container">
            <Navbar />

            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <router-link :to="{name: 'home'}" class="breadcrumb-item text-capitalize">Recipes</router-link>
                    <li class="breadcrumb-item text-capitalize active" aria-current="page">
                        Create Recipe
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
                            <label for="recipeName">Name</label>
                            <input type="text" class="form-control" v-model="recipe.name">
                        </div>

                        <div class="form-group">
                            <label for="recipeType">Type<span v-if="recipe.types && recipe.types.length > 1">s</span></label>
                            <v-selectize v-model="recipe.types" :options="types" multiple />
                        </div>

                        <div class="card mb-3">
                            <h5 class="card-header">Ingredients</h5>
                            <div class="list-group list-group-flush">
                                <div class="list-group-item" v-for="(ingredient, ingredientIndex) in recipe.ingredients" v-if="(recipe.ingredients && recipe.ingredients.length)">
                                    <div class="input-group">
                                        <div class="input-group-prepend" v-if="ingredient.amount">
                                            <span class="input-group-text">Amount</span>
                                        </div>
                                        <input type="text" class="form-control col-4" placeholder="Amount" v-model="ingredient.amount">
                                        <div class="input-group-prepend" v-if="ingredient.measurement">
                                            <span class="input-group-text">Measurement</span>
                                        </div>
                                        <select class="custom-select col-4" v-model="ingredient.measurement">
                                            <option value="" selected disabled>Select Measurement</option>
                                            <option value="1">Cup</option>
                                            <option value="2">Tbsp</option>
                                            <option value="3">Tsp</option>
                                            <option value="4">oz</option>
                                            <option value="5">Whole</option>
                                            <option value="6">Half</option>
                                            <option value="7">Quarter</option>
                                            <option value="8">Pinch</option>
                                            <option value="9">Dash</option>
                                        </select>
                                        <div class="input-group-prepend" v-if="ingredient.ingredient">
                                            <span class="input-group-text">Ingredient</span>
                                        </div>
                                        <input type="text" class="form-control col-4" placeholder="Ingredient" v-model="ingredient.ingredient">
                                        <div class="input-group-append">
                                            <button type="button" class="btn btn-outline-danger" @click.prevent="removeIngredient(ingredientIndex)">
                                                -
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="list-group-item list-group-item-danger" v-if="!recipe.ingredients || recipe.ingredients && !recipe.ingredients.length">
                                    0 ingredients added
                                </div>
                            </div>
                            <div class="card-footer">
                                <button type="button" class="btn btn-outline-primary" @click.prevent="addIngredient()">
                                    Add Ingredient
                                </button>
                            </div>
                        </div>

                        <div class="card mb-3">
                            <h5 class="card-header">Instructions</h5>
                            <div class="list-group list-group-flush">
                                <div class="list-group-item" v-for="(instruction, instructionIndex) in recipe.instructions" v-if="recipe.instructions && recipe.instructions.length">
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
                                <div class="list-group-item list-group-item-danger" v-if="!recipe.instructions || recipe.instructions && !recipe.instructions.length">
                                    0 instructions added
                                </div>
                            </div>
                            <div class="card-footer">
                                <button type="button" class="btn btn-outline-primary" @click.prevent="addInstruction()">
                                    Add Instruction
                                </button>
                            </div>
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

                        <div class="card mb-3">
                            <h5 class="card-header">Nutrition Facts</h5>
                            <div class="list-group list-group-flush">
                                <div class="list-group-item" v-for="(fact, nutritionIndex) in recipe.nutrition" v-if="recipe.nutrition && recipe.nutrition.length">
                                    <div class="input-group">
                                        <div class="input-group-prepend" v-if="fact.fact">
                                            <span class="input-group-text">Fact</span>
                                        </div>
                                        <input type="text" class="form-control" placeholder="Fact" v-model="fact.fact">
                                        <div class="input-group-prepend" v-if="fact.amount">
                                            <span class="input-group-text">Amount</span>
                                        </div>
                                        <input type="text" class="form-control" placeholder="Amount" v-model="fact.amount">
                                        <div class="input-group-append">
                                            <button type="button" class="btn btn-outline-danger" @click.prevent="removeNutrition(nutritionIndex)">-</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="list-group-item list-group-item-danger" v-if="!recipe.nutrition || recipe.nutrition && !recipe.nutrition.length">
                                    0 nutrition facts added
                                </div>
                            </div>
                            <div class="card-footer">
                                <button type="button" class="btn btn-outline-primary" @click.prevent="addNutrition()">
                                    Add Nutrition Fact
                                </button>
                            </div>
                        </div>

                        <button type="submit" class="btn" :class="{'btn-success': !recipe['.key'], 'btn-primary': recipe['.key']}">
                            <template v-if="!recipe['.key']">Create</template>
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
