<template>
    <div>
        <b-form @submit.prevent="saveRecipe(recipe)" class="mb-5">
            <b-form-group id="recipe-name-group" label="Name" label-for="recipe-name">
                <b-form-input id="recipe-name" type="text" :class="{'is-invalid': underValidation && !recipe.name}" v-model="recipe.name"></b-form-input>
            </b-form-group>

            <b-form-group id="recipe-description-group" label="Description" label-for="recipe-description">
                <b-form-textarea id="recipe-description" rows="3" v-model="recipe.description"></b-form-textarea>
            </b-form-group>

            <b-form-group id="recipe-types-group" label="Types" label-for="recipe-types">
                <multiselect id="recipe-types" v-model="recipe.types" :options="types" :multiple="true" :taggable="true" @tag="addType"></multiselect>
            </b-form-group>

            <b-form-group id="recipe-ingredients-group" label="Ingredients" label-for="recipe-ingredients">
                <div id="recipe-ingredients">
                    <div v-for="(ingredient, ingredientIndex) in recipe.ingredients" class="mb-2" v-if="recipe.ingredients && recipe.ingredients.length">
                        <div class="d-lg-block d-none">
                            <b-input-group>
                                <b-form-input :id="'ingredient-' + ingredientIndex + '-ingredient'" type="text" placeholder="Ingredient" v-model="ingredient.ingredient"></b-form-input>
                                <b-form-input :id="'ingredient-' + ingredientIndex + '-amount'" type="text" placeholder="Amount" v-model="ingredient.amount"></b-form-input>
                                <b-form-input :id="'ingredient-' + ingredientIndex + '-measurement'" type="text" placeholder="Measurement" v-model="ingredient.measurement"></b-form-input>
                                <b-input-group-append>
                                    <b-btn variant="outline-danger" @click.prevent="removeIngredient(ingredientIndex)">
                                        -
                                    </b-btn>
                                </b-input-group-append>
                            </b-input-group>
                        </div>
                        <div class="d-lg-none d-flex">
                            <div class="flex-grow-1">
                                <b-form-input :id="'ingredient-' + ingredientIndex + '-ingredient-mobile'" type="text" class="mb-1" placeholder="Ingredient" v-model="ingredient.ingredient"></b-form-input>
                                <b-form-input :id="'ingredient-' + ingredientIndex + '-amount-mobile'" type="text" class="mb-1" placeholder="Amount" v-model="ingredient.amount"></b-form-input>
                                <b-form-input :id="'ingredient-' + ingredientIndex + '-measurement-mobile'" type="text" placeholder="Measurement" v-model="ingredient.measurement"></b-form-input>
                            </div>
                            <div class="ml-1 align-self-center">
                                <b-btn variant="outline-danger" @click.prevent="removeIngredient(ingredientIndex)">
                                    -
                                </b-btn>
                            </div>
                        </div>
                    </div>
                    <div v-if="!recipe.ingredients || recipe.ingredients && !recipe.ingredients.length">
                        <b-alert variant="warning" class="mb-2" show>0 ingredients added</b-alert>
                    </div>
                    <b-btn size="sm" variant="outline-primary" class="mt-1" @click.prevent="addIngredient()">
                        Add Ingredient
                    </b-btn>
                </div>
            </b-form-group>

            <b-form-group id="recipe-instructions-group" label="Instructions" label-for="recipe-instructions">
                <div id="recipe-ingredients">
                    <div v-for="(instruction, instructionIndex) in recipe.instructions" class="mb-2" v-if="recipe.instructions && recipe.instructions.length">
                        <b-input-group>
                            <b-form-textarea :id="'instruction-' + instructionIndex" :placeholder="'Step ' + (instructionIndex + 1)" v-model="instruction.instruction"></b-form-textarea>
                            <b-input-group-append>
                                <b-btn variant="outline-danger" @click.prevent="removeInstrution(instructionIndex)">-</b-btn>
                            </b-input-group-append>
                        </b-input-group>
                    </div>
                    <div v-if="!recipe.instructions || recipe.instructions && !recipe.instructions.length">
                        <b-alert variant="warning" class="mb-2" show>0 instructions added</b-alert>
                    </div>
                    <b-btn size="sm" variant="outline-primary" @click.prevent="addInstruction()">
                        Add Instruction
                    </b-btn>
                </div>
            </b-form-group>

            <b-form-group id="recipe-nutrition-group" label="Nutrition" label-for="recipe-nutrition">
                <div id="recipe-nutrition">
                    <div v-for="(fact, nutritionIndex) in recipe.nutrition" class="mb-2" v-if="recipe.nutrition && recipe.nutrition.length">
                        <b-input-group>
                            <b-form-input :id="'nutrition-' + nutritionIndex" :placeholder="'Fact ' + (nutritionIndex + 1)" v-model="fact.fact"></b-form-input>
                            <b-input-group-append>
                                <b-btn variant="outline-danger" @click.prevent="removeNutrition(nutritionIndex)">-</b-btn>
                            </b-input-group-append>
                        </b-input-group>
                    </div>
                    <div v-if="!recipe.nutrition || recipe.nutrition && !recipe.nutrition.length">
                        <b-alert variant="warning" class="mb-2" show>0 nutrition facts added</b-alert>
                    </div>
                    <b-btn size="sm" variant="outline-primary" @click.prevent="addNutrition()">
                        Add Nutrition
                    </b-btn>
                </div>
            </b-form-group>

            <b-form-group id="recipe-time-group" label="Time" label-for="recipe-time">
                <div class="d-lg-block d-none">
                    <b-input-group id="recipe-time">
                        <b-form-input id="prep-time" type="number" placeholder="Prep Time" v-model="recipe.time.prep"></b-form-input>
                        <b-form-input id="cook-time" type="number" placeholder="Cook Time" v-model="recipe.time.cook"></b-form-input>
                        <b-form-input id="total-time" type="number" placeholder="Total Time" v-model="recipe.time.total"></b-form-input>
                    </b-input-group>
                </div>
                <div class="d-lg-none d-block">
                    <b-form-input id="prep-time-mobile" type="number" placeholder="Prep Time" class="mb-1" v-model="recipe.time.prep"></b-form-input>
                    <b-form-input id="cook-time-mobile" type="number" placeholder="Cook Time" class="mb-1" v-model="recipe.time.cook"></b-form-input>
                    <b-form-input id="total-time-mobile" type="number" placeholder="Total Time" v-model="recipe.time.total"></b-form-input>
                </div>
            </b-form-group>

            <template v-if="recipe_key">
                <b-button type="submit" variant="primary" :disabled="saving">
                    <template v-if="saving">
                        <div class="spinner-border spinner-border-sm" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </template>
                    <template v-else>
                        Save Changes
                    </template>
                </b-button>
            </template>
            <template v-else>
                <b-button type="submit" variant="success" :disabled="saving">
                    <template v-if="saving">
                        <div class="spinner-border spinner-border-sm" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </template>
                    <template v-else>
                        Create Recipe
                    </template>
                </b-button>
            </template>
        </b-form>
    </div>
</template>

<script>
export default {
    name: 'recipe-form',
    data() {
        return {
            types: ['breakfast', 'lunch', 'dinner', 'desert', 'snack', 'drink'],

            saving: false,

            underValidation: false
        }
    },
    props: ['recipe', 'recipe_key'],
    computed: {
        ingredientsHaveValues () {
            var haveValues = true;
            _.forEach(this.recipe.ingredients, ingredient => {
                if(!ingredient.amount || !ingredient.measurement || !ingredient.ingredient) {
                    haveValues = false;
                    return false;
                }
            });
            return haveValues;
        },
        instructionsHaveValues () {
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
        addType (newType) {
            this.recipe.types.push(newType);
        },
        addIngredient () {
            this.recipe.ingredients.push({});
        },
        removeIngredient (ingredientIndex) {
            this.recipe.ingredients.splice(ingredientIndex, 1);
        },
        addInstruction () {
            this.recipe.instructions.push({});
        },
        removeInstrution (instructionIndex) {
            this.recipe.instructions.splice(instructionIndex, 1);
        },
        addNutrition () {
            this.recipe.nutrition.push({});
        },
        removeNutrition (nutritionIndex) {
            this.recipe.nutrition.splice(nutritionIndex, 1);
        },
        saveRecipe (recipe) {
            if(!this.validateRecipe()) return;

            this.saving = true;

            if(this.recipe_key) {
                this.$emit("editRecipe", recipe);
            } else {
                this.$emit("createRecipe", recipe);
            }
        },
        validateRecipe () {
            this.underValidation = true;

            var valid = true;

            if(!this.recipe.name) {
                valid = false;
            }

            if(!this.ingredientsHaveValues) {
                valid = false;
            }

            if(!this.instructionsHaveValues) {
                valid = false;
            }

            return valid;
        }
    }
};
</script>

<style scoped>

</style>
