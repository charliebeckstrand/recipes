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
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">Step {{instructionIndex + 1}}</span>
                                    </div>
                                    <textarea class="form-control" :class="{'is-invalid': underValidation && !instruction.instruction}" placeholder="Instruction" rows="1" v-model="instruction.instruction" />
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
                            <label for="nutrition-facts">Nutrition Facts</label>
                            <div :class="{'mt-1': nutritionIndex !== 0}" v-for="(fact, nutritionIndex) in recipe.nutrition">
                                <!-- desktop -->
                                <div class="d-lg-block d-none">
                                    <div :class="{'mt-1': nutritionIndex !== 0}" v-if="recipe.nutrition && recipe.nutrition.length">
                                        <div class="input-group">
                                            <input type="text" class="form-control" placeholder="Fact" v-model="fact.fact">
                                            <input type="text" class="form-control" placeholder="Amount" v-model="fact.amount">
                                            <div class="input-group-append">
                                                <button type="button" class="btn btn-outline-danger" @click.prevent="removeNutrition(nutritionIndex)">-</button>
                                            </div>
                                        </div>
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

                            <button type="submit" class="btn btn-outline-danger ml-auto" @click.prevent="deleteRecipe()" v-if="snapshot.id && recipe.created_by == user.uid">
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

// Vue.directive('focus', {
//     inserted(el, binding, vnode) {
//         Vue.nextTick(function() {
//             el.focus();
//         });
//     }
// });

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
                nutrition: []
            },

            loadingRecipe: false,

            underValidation: false
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
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
        saveRecipe(recipe) {
            var types = [];
            var ingredients = [];
            var instructions = [];
            var nutrition = [];

            var name = null;
            var description = null;
            var prep_time = null;
            var cook_time = null;
            var total_time = null;
            var created_date = null;
            var created_date_time = null;
            var created_by = null;
            var created_by_display_name = null;

            var updated = this.moment().format("MM-DD-YYYY HH:mm:ss");

            if(recipe.name) {
                name = recipe.name;
            }
            if(recipe.description) {
                description = recipe.description;
            }
            if(recipe.types && recipe.types.length) {
                types = recipe.types;
            }
            if(recipe.ingredients && recipe.ingredients.length) {
                ingredients = recipe.ingredients;
            }
            if(recipe.instructions && recipe.instructions.length) {
                instructions = recipe.instructions;
            }
            if(recipe.prep_time) {
                prep_time = recipe.prep_time;
            }
            if(recipe.cook_time) {
                cook_time = recipe.cook_time;
            }
            if(recipe.total_time) {
                total_time = recipe.total_time;
            }
            if(recipe.nutrition && recipe.nutrition.length) {
                nutrition = recipe.nutrition;
            }
            if(recipe.created_date) {
                created_date = recipe.created_date;
            } else {
                created_date = this.moment().format("MM-DD-YYYY");
            }
            if(recipe.created_date_time) {
                created_date_time = recipe.created_date_time;
            } else {
                created_date_time = this.moment().format("MM-DD-YYYY HH:mm:ss");
            }
            if(recipe.created_by) {
                created_by = recipe.created_by;
            } else {
                created_by = this.user.uid;
            }
            if(recipe.created_by_display_name) {
                created_by_display_name = recipe.created_by_display_name;
            } else {
                created_by_display_name = this.user.displayName;
            }

            if(!this.validateRecipe()) return;

            if(this.snapshot.id) {
                firebase.firestore().collection("recipes").doc(this.snapshot.id).set({
                    name: name,
                    description: description,
                    types: types,
                    ingredients: ingredients,
                    instructions: instructions,
                    prep_time: prep_time,
                    cook_time: cook_time,
                    total_time: total_time,
                    nutrition: nutrition,
                    created_date: created_date,
                    created_date_time: created_date_time,
                    created_by: created_by,
                    created_by_display_name: created_by_display_name,
                    updated: updated
                })
                .then(response => {
                    if(name) {
                        var message = name + ' updated';
                    } else {
                        var message = 'Recipe updated';
                    }
                    this.$swal({
                        toast: true,
                        html: message,
                        type: 'success',
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 5000
                    });
                    this.$router.replace('/');
                })
                .catch(error => {
                    this.$swal("Error", error.message, "error");
                });
            } else {
                firebase.firestore().collection("recipes").doc().set({
                    name: name,
                    description: description,
                    types: types,
                    ingredients: ingredients,
                    instructions: instructions,
                    prep_time: prep_time,
                    cook_time: cook_time,
                    total_time: total_time,
                    nutrition: nutrition,
                    created_date: created_date,
                    created_date_time: created_date_time,
                    created_by: created_by,
                    created_by_display_name: created_by_display_name
                })
                .then(response => {
                    if(name) {
                        var message = name + ' created';
                    } else {
                        var message = 'Recipe created';
                    }
                    this.$swal({
                        toast: true,
                        html: message,
                        type: 'success',
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 5000
                    });
                    this.$router.replace('/');
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
            if(this.recipe.created_by == this.user.uid) {
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

                        this.$router.replace('/');
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
