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
                    <div class="spinner-grow" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                </template>
            </template>
            <template v-else>
                <div class="mb-5 pb-5">
                    <form @submit.prevent="saveRecipe(recipe)">

                        <div class="form-group">
                            <label for="title">Name</label>
                            <input type="text" class="form-control" :class="{'is-invalid': underValidation && !recipe.name}" v-model="recipe.name">
                        </div>

                        <div class="form-group">
                            <label for="description">Description</label>
                            <textarea class="form-control" rows="3" v-model="recipe.description" />
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
                                    <input type="text" class="form-control col-4" :class="{'is-invalid': underValidation && !ingredient.amount}" placeholder="Amount" v-model="ingredient.amount">
                                    <select class="custom-select col-4" :class="{'is-invalid': underValidation && !ingredient.measurement}" v-model="ingredient.measurement">
                                        <option value="" selected disabled>Measurement</option>
                                        <option :value="measurement.measurement" v-for="measurement in measurements">{{measurement.measurement}}</option>
                                    </select>
                                    <input type="text" class="form-control col-4" :class="{'is-invalid': underValidation && !ingredient.ingredient}" placeholder="Ingredient" v-model="ingredient.ingredient">
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
                                                <input type="text" class="form-control" :class="{'is-invalid': underValidation && !ingredient.amount}" placeholder="Amount" v-model="ingredient.amount">
                                            </div>
                                            <div class="mb-1">
                                                <select class="custom-select" :class="{'is-invalid': underValidation && !ingredient.measurement}" v-model="ingredient.measurement">
                                                    <option value="" selected disabled>Measurement</option>
                                                    <option :value="measurement.measurement" v-for="measurement in measurements">{{measurement.measurement}}</option>
                                                </select>
                                            </div>
                                            <div>
                                                <input type="text" class="form-control" :class="{'is-invalid': underValidation && !ingredient.ingredient}" placeholder="Ingredient" v-model="ingredient.ingredient">
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
                                    <textarea class="form-control" :class="{'is-invalid': underValidation && !instruction.instruction}" rows="1" :placeholder="'Step ' + (instructionIndex + 1)" v-model="instruction.instruction" />
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
                            <label for="time">Time</label>
                            <div class="row">
                                <div class="col-lg-4 mb-lg-0 mb-1">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <div class="input-group-text">
                                                Prep
                                            </div>
                                        </div>
                                        <input type="number" min="1" class="form-control" v-model="recipe.time.prep">
                                    </div>
                                </div>
                                <div class="col-lg-4 mb-lg-0 mb-1">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <div class="input-group-text">
                                                Cook
                                            </div>
                                        </div>
                                        <input type="number" min="1" class="form-control" v-model="recipe.time.cook">
                                    </div>
                                </div>
                                <div class="col-lg-4">
                                    <div class="input-group">
                                        <div class="input-group-prepend">
                                            <div class="input-group-text">
                                                Total
                                            </div>
                                        </div>
                                        <input type="number" min="1" class="form-control" v-model="recipe.time.total">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="form-group mb-2">
                            <label for="nutrition-facts">Nutrition Facts</label>
                            <div :class="{'mt-1': nutritionIndex !== 0}" v-for="(fact, nutritionIndex) in recipe.nutrition">
                                <div class="input-group">
                                    <input type="text" class="form-control" v-model="fact.fact">
                                    <!-- <input type="text" class="form-control" placeholder="Amount" v-model="fact.amount"> -->
                                    <div class="input-group-append">
                                        <button type="button" class="btn btn-outline-danger" @click.prevent="removeNutrition(nutritionIndex)">-</button>
                                    </div>
                                </div>
                            </div>
                            <div class="alert bg-warning text-white mb-2" v-if="!recipe.nutrition || recipe.nutrition && !recipe.nutrition.length">
                                0 nutrition facts added
                            </div>
                        </div>

                        <div class="mb-3">
                            <button type="button" class="btn btn-sm btn-outline-primary" @click.prevent="addNutrition()">
                                Add Nutrition Fact
                            </button>
                        </div>

                        <div class="d-flex">
                            <button type="submit" class="btn" :class="{'btn-success': !snapshot.id, 'btn-primary': snapshot.id}">
                                <template v-if="!snapshot.id">Create Recipe</template>
                                <template v-else>Save Changes</template>
                            </button>

                            <button type="submit" class="btn btn-outline-danger ml-auto" @click.prevent="deleteRecipe()" v-if="snapshot.id && currentUser.uid == recipe.created_by">
                                <font-awesome-icon :icon="['far', 'trash']" />
                            </button>
                        </div>
                    </form>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
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
    props: ["recipe_key"],
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
                    measurement: "tsp"
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
                created: {},
                created_by: {},
                ingredients: [
                    {
                        amount: "",
                        measurement: "",
                        ingredient: ""
                    }
                ],
                instructions: [
                    {}, {}, {}
                ],
                nutrition: [],
                time: {},
            },

            loadingRecipe: false,

            underValidation: false
        }
    },
    computed: {
        currentUser() {
            return firebase.auth().currentUser;
        },
        ingredientsHaveValues() {
            var haveValues = true;
            _.forEach(this.recipe.ingredients, ingredient => {
                if(!ingredient.amount || !ingredient.measurement || !ingredient.ingredient) {
                    haveValues = false;
                    return false;
                }
            });
            return haveValues;
        },
        instructionsHaveValues() {
            var haveValues = true;
            _.forEach(this.recipe.instructions, instruction => {
                if(!instruction.instruction) {
                    haveValues = false;
                    return false;
                }
            });
            return haveValues;
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
                    this.$swal({
                        toast: true,
                        html: 'No such document exists',
                        type: 'error',
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 5000
                    });

                    this.loadingRecipe = false;
                }
            });
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
        saveRecipe(recipe) {
            var types = [];
            var ingredients = [];
            var instructions = [];
            var nutrition = [];
            var favorited_by = [];

            var name = null;
            var description = null;
            var time = {};
            var created = {};
            var created_by = {};

            var updated = this.moment().format("MM-DD-YYYY HH:mm:ss");

            if(recipe.types && recipe.types.length) {
                types = recipe.types;
            }
            if(recipe.ingredients && recipe.ingredients.length) {
                ingredients = recipe.ingredients;
            }
            if(recipe.instructions && recipe.instructions.length) {
                instructions = recipe.instructions;
            }
            if(recipe.nutrition && recipe.nutrition.length) {
                nutrition = recipe.nutrition;
            }
            if(recipe.favorited_by && recipe.favorited_by.length) {
                favorited_by = recipe.favorited_by;
            }

            if(recipe.name) {
                name = recipe.name;
            }
            if(recipe.description) {
                description = recipe.description;
            }
            if(recipe.time) {
                time = recipe.time;
            } else {
                time = {
                    prep: recipe.prep,
                    cook: recipe.cook,
                    total: recipe.total
                }
            }
            if(recipe.created && Object.keys(recipe.created).length) {
                created = recipe.created;
            } else {
                created = {
                    date: this.moment().format("MM-DD-YYYY"),
                    date_time: this.moment().format("MM-DD-YYYY HH:mm:ss")
                };
            }
            if(recipe.created_by && Object.keys(recipe.created).length) {
                created_by = recipe.created_by;
            } else {
                created_by = {
                    displayName: this.currentUser.displayName,
                    email: this.currentUser.email,
                    uid: this.currentUser.uid
                };
            }

            if(!this.validateRecipe()) return;

            if(this.snapshot.id) {
                firebase.firestore().collection("recipes").doc(this.snapshot.id).update({
                    types: types,
                    ingredients: ingredients,
                    instructions: instructions,
                    nutrition: nutrition,
                    name: name,
                    description: description,
                    time: time,
                    created: created,
                    created_by: created_by,
                    updated: updated
                })
                .then(response => {
                    this.$router.push({name: 'home'});
                })
                .catch(error => {
                    this.$swal("Error", error.message, "error");
                });
            } else {
                firebase.firestore().collection("recipes").doc().set({
                    types: types,
                    ingredients: ingredients,
                    instructions: instructions,
                    nutrition: nutrition,
                    favorited_by: favorited_by,
                    name: name,
                    description: description,
                    time: time,
                    created: created,
                    created_by: created_by
                })
                .then(response => {
                    this.$router.push({name: 'home'});
                })
                .catch(error => {
                    this.$swal("Error", error.message, "error");
                });
            }
        },
        validateRecipe() {
            this.underValidation = true;

            var valid = true;

            if(!this.recipe.name) {
                valid = false;
            }

            if(!this.recipe.ingredients || this.recipe.ingredients && !this.recipe.ingredients.length) {
                valid = false;
            }

            if(!this.ingredientsHaveValues) {
                valid = false;
            }

            if(!this.recipe.instructions || this.recipe.instructions && !this.recipe.instructions.length) {
                valid = false;
            }

            if(!this.instructionsHaveValues) {
                valid = false;
            }

            return valid;
        },
        deleteRecipe() {
            if(this.currentUser.uid == this.recipe.created_by) {
                this.$swal({
    				html: 'Are you sure you want to delete this recipe?',
    				showCancelButton: true,
    				confirmButtonText: 'Delete Recipe',
    				confirmButtonClass: 'btn btn-danger',
    				cancelButtonText: 'Cancel',
    				cancelButtonClass: 'btn btn-light',
    				buttonsStyling: false,
    				reverseButtons: true
    			}).then((willDeleteRecipe) => {
    				if (willDeleteRecipe.value) {
                        firebase.firestore().collection('recipes').doc(this.snapshot.id).delete();

                        if(name) {
                            var message = name + ' deleted';
                        } else {
                            var message = 'Recipe deleted';
                        }

                        this.$swal({
                            toast: true,
                            html: message,
                            type: 'success',
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 5000
                        });

                        this.$router.push({name: 'home'});
                    }
                });
            } else {
                this.$swal({
                    type: "Error",
    				html: "You do not have the necessary priviledges to delete this recipe",
    			});
            }
        }
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
