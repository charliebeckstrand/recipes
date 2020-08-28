<template>
    <div>
        <b-modal
            :visible="value"
            centered
            no-fade
            hide-header
            :no-close-on-backdrop="recipe_changes"
            :no-close-on-esc="recipe_changes"
            size="lg"
            @show="show"
            @shown="shown"
            @hidden="hidden"
            @hide="hide"
            @cancel="hide"
            @close="hide"
        >
            <a
                href="#"
                class="modal-close"
                aria-label="Close"
                @click.prevent="cancelRecipe"
            >
                <font-awesome-layers>
                    <font-awesome-icon icon="circle" class="background" transform="shrink-1" />
                    <font-awesome-icon :icon="['fas', 'times-circle']" class="foreground" />
                </font-awesome-layers>
            </a>

            <div class="recipe-title">
                <input
                    ref="name"
                    type="text"
                    v-model="editable_recipe.name"
                    class="form-control bg-transparent border-0 p-0"
                    :class="{
                        'is-invalid': validating && !editable_recipe.name
                    }"
                    placeholder="Recipe Name"
                >

                <div
                    v-if="validating && !editable_recipe.name"
                    class="text-danger my-3"
                >
                    &bull; Recipe Name is required
                </div>
            </div>

            <div class="my-3">
                <label class="form-label">Description</label>
                <TipTap
                    v-model="editable_recipe.description"
                    editor_menu="bubble"
                    :autoFocus="false"
                    @input="setContent(editable_recipe, 'description', $event)"
                />
            </div>

            <section ref="ingredients" tabindex="-1">
                <div class="mb-3">
                    <div
                        v-sticky="{
                            zIndex: 10,
                            stickyTop: 0
                        }"
                        class="py-3 bg-white sticky"
                    >
                        <h3 class="m-0 text-success font-weight-bold">
                            Ingredients
                        </h3>
                    </div>

                    <div class="pl-3 border-left border-success">
                        <div v-if="editable_recipe.ingredients && editable_recipe.ingredients.length" class="ingredients">
                            <draggable v-model="editable_recipe.ingredients" handle=".drag-handle">
                                <div
                                    v-for="(ingredient, ingredientIndex) in editable_recipe.ingredients"
                                    :key="ingredientIndex"
                                    class="ingredient"
                                    :class="{
                                        'mt-3': !ingredient.ingredient && validating
                                    }"
                                >
                                    <div class="d-flex align-items-center">
                                        <div v-if="editable_recipe.ingredients.length > 1" class="drag-handle mr-3">
                                            <font-awesome-icon :icon="['fad', 'sort']" />
                                        </div>
                                        <div class="card ingredient flex-grow-1">
                                            <div class="card-body">
                                                <div class="d-flex align-items-center">
                                                    <div class="flex-grow-1">
                                                        {{ingredient.amount}} {{ingredient.measurement}} <strong>{{ingredient.ingredient}}</strong>
                                                    </div>
                                                    <div class="d-flex align-items-center flex-nowrap ml-3">
                                                        <a
                                                            href="#"
                                                            @click.prevent="editIngredient(ingredient)"
                                                        >
                                                            <font-awesome-icon :icon="['fad', 'edit']" fixed-width />
                                                        </a>
                                                        <a
                                                            href="#"
                                                            class="text-danger ml-2"
                                                            @click.prevent="removeIngredient(ingredient, ingredientIndex)"
                                                        >
                                                            <font-awesome-icon :icon="['fad', 'trash']" fixed-width />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <ingredient-modal
                                        v-model="ingredient.ingredient_modal"
                                        :ingredient="ingredient"
                                        @add="updateIngredient($event, ingredientIndex)"
                                        @hide="ingredient.ingredient_modal = false"
                                    />
                                </div>
                            </draggable>
                        </div>
                    </div>
                    <div v-if="!editable_recipe.ingredients || (editable_recipe.ingredients && !editable_recipe.ingredients.length)" class="alert border-success text-success mb-0">
                        0 ingredients added
                    </div>
                    <div
                        v-if="validating && (!editable_recipe.ingredients || (editable_recipe.ingredients && !editable_recipe.ingredients.length))"
                        class="text-danger mt-3"
                    >
                        &bull; At least 1 ingredient is required
                    </div>
                </div>

                <div class="mb-3">
                    <!-- <button type="button" class="btn btn-sm btn-success" @click.prevent="addIngredient">
                        <font-awesome-icon :icon="['fad', 'plus-square']" fixed-width /> Add Ingredient
                    </button> -->
                    <button type="button" class="btn btn-success" @click="newIngredient">
                        <font-awesome-icon :icon="['fad', 'plus-square']" fixed-width /> Add Ingredient
                    </button>
                </div>
            </section>

            <section ref="instructions" tabindex="-1">
                <div class="mb-3">
                    <div
                        v-sticky="{
                            zIndex: 10,
                            stickyTop: 0
                        }"
                        class="py-3 bg-white sticky"
                    >
                        <h3 class="m-0 text-primary font-weight-bold">
                            Instructions
                        </h3>
                    </div>

                    <div class="pl-3 border-left border-primary">

                        <div v-if="editable_recipe.instructions && editable_recipe.instructions.length" class="instructions">
                            <draggable v-model="editable_recipe.instructions" handle=".drag-handle">
                                <div
                                    v-for="(instruction, instructionIndex) in editable_recipe.instructions"
                                    :key="instructionIndex"
                                    class="instruction"
                                    :class="{
                                        'mt-3': validating && !editable_recipe.instructions
                                    }"
                                >
                                    <div class="d-flex align-items-center">
                                        <div class="flex-grow-1">
                                            <TipTap
                                                v-model="instruction.instruction"
                                                editor_menu="bubble"
                                                :autoFocus="instruction.instruction ? false : true"
                                                :placeholder="'Step ' + (instructionIndex + 1)"
                                                :class="{
                                                    'is-invalid': validating && (!instruction.instruction || instruction.instruction && instruction.instruction == '<p></p>')
                                                }"
                                                @input="setContent(instruction, 'instruction', $event)"
                                            />
                                        </div>
                                        <div>
                                            <button type="button" class="btn btn-link text-danger" @click.prevent="removeInstruction(instructionIndex)">
                                                <font-awesome-icon :icon="['far', 'minus']" fixed-width />
                                            </button>
                                        </div>
                                    </div>

                                    <div
                                        v-if="validating && (!instruction.instruction || instruction.instruction && instruction.instruction == '<p></p>')"
                                        class="text-danger mt-3"
                                    >
                                        &bull; Instruction is required
                                    </div>
                                </div>
                            </draggable>
                        </div>
                    </div>
                    <div v-if="!editable_recipe.instructions || (editable_recipe.instructions && !editable_recipe.instructions.length)" class="alert border-primary text-primary mb-0">
                        0 instructions added
                    </div>
                    <div
                        v-if="validating && !editable_recipe.instructions_html && (!editable_recipe.instructions || editable_recipe.instructions && !editable_recipe.instructions.length)"
                        class="text-danger mt-3"
                    >
                        &bull; At least 1 instruction is required
                    </div>

                    <div class="mt-3">
                        <button type="button" class="btn btn btn-primary" @click.prevent="addInstruction">
                            <font-awesome-icon :icon="['fad', 'plus-square']" fixed-width /> Add Instruction
                        </button>
                    </div>
                </div>
            </section>

            <section ref="tips" tabindex="-1">
                <div class="mb-3">
                    <div
                        v-sticky="{
                            zIndex: 10,
                            stickyTop: 0
                        }"
                        class="py-3 bg-white sticky"
                    >
                        <h3 class="m-0 text-warning font-weight-bold">
                            Tips
                        </h3>
                    </div>

                    <TipTap
                        v-model="editable_recipe.tips"
                        editor_menu="bubble"
                        @input="setContent(tip, 'tips', $event)"
                    />
                </div>
            </section>

            <section ref="nutrition" tabindex="-1">
                <div class="mb-3">
                    <div
                        v-sticky="{
                            zIndex: 10,
                            stickyTop: 0
                        }"
                        class="py-3 bg-white sticky"
                    >
                        <h3 class="m-0 text-info font-weight-bold">
                            Nutrition
                        </h3>
                    </div>

                    <TipTap
                        v-model="editable_recipe.nutrition"
                        @input="setContent(editable_recipe, 'nutrition', $event)"
                    />
                </div>
            </section>

            <section ref="notes" tabindex="-1">
                <div class="mb-3">
                    <div
                        v-sticky="{
                            zIndex: 10,
                            stickyTop: 0
                        }"
                        class="py-3 bg-white sticky"
                    >
                        <h3 class="m-0 text-danger font-weight-bold">
                            Notes
                        </h3>
                    </div>

                    <TipTap
                        v-model="editable_recipe.notes_html"
                        @input="setContent(editable_recipe, 'notes_html', $event)"
                    />
                </div>

                <!-- <div class="mb-3">
                    <button type="button" class="btn btn btn-danger" @click.prevent="addNote">
                        <font-awesome-icon :icon="['fad', 'plus-square']" fixed-width /> Add note
                    </button>
                </div> -->
            </section>

            <div class="mt-4">
                <label class="form-label">Servings</label>
                <input
                    ref="servings"
                    type="number"
                    v-model="editable_recipe.servings"
                    class="form-control"
                    :class="{'is-invalid': validating && !editable_recipe.servings}"
                >
                <div
                    v-if="validating && !editable_recipe.servings"
                    class="text-danger mt-3"
                >
                    Servings is required
                </div>
            </div>

            <div class="mt-4">
                <label class="form-label">Bake Time</label>
                <input
                    ref="totaltime"
                    type="number"
                    v-model="editable_recipe.total_time"
                    class="form-control"
                >
            </div>

            <template #modal-footer>
                <button
                    type="button"
                    class="btn btn-light"
                    @click="cancelRecipe"
                >
                    <div v-if="!editable_recipe.id || editable_recipe.id && recipe_changes">
                        Cancel
                    </div>
                    <div v-else>
                        Close
                    </div>
                </button>
                <button
                    v-if="!editable_recipe.id || editable_recipe.id && recipe_changes"
                    type="button"
                    class="btn"
                    :class="{
                        'btn-primary': editable_recipe.id,
                        'btn-success': !editable_recipe.id
                    }"
                    :disabled="editable_recipe.creating || editable_recipe.updating"
                    @click="saveRecipe"
                >
                    <div v-if="editable_recipe.id">
                        <div v-if="editable_recipe.updating">
                            <Spinner />
                        </div>
                        <div v-else>
                            <font-awesome-icon :icon="['fad', 'check-square']" fixed-width /> Save Changes
                        </div>
                    </div>
                    <div v-else>
                        <div v-if="editable_recipe.creating">
                            <Spinner />
                        </div>
                        <div v-else>
                            <font-awesome-icon :icon="['far', 'plus']" fixed-width /> Create Recipe
                        </div>
                    </div>
                </button>
            </template>
        </b-modal>

        <ingredient-modal
            v-model="ingredient_modal"
            @add="addIngredient"
            @hide="ingredient_modal = false"
        />

    </div>
</template>

<script>
// import SimpleRecipeForm from '@/components/recipe/SimpleRecipeForm'

import draggable from 'vuedraggable'
import moment from 'moment'

import Spinner from '@/components/Spinner'

import TipTap from '@/components/TipTap'

import IngredientModal from '@/components/modals/IngredientModal'

export default {
    name: 'RecipeModal',
    data: () => ({
        editable_recipe: {},
        editable_recipe_cache: {},

        moment: moment,

        ingredient_modal: false,

        validating: false,
        creating: false
    }),
    components: {
        // SimpleRecipeForm,
        draggable,

        Spinner,
        TipTap,
        IngredientModal
    },
    props: {
        value: Boolean,
        recipe: Object
    },
    computed: {
        recipe_changes () {
            return !_.isEqual(this.editable_recipe, this.editable_recipe_cache)
        }
    },
    methods: {
        saveRecipe () {
            this.validating = true

            if (!this.validated()) {
                return false
            }

            if (this.recipe_changes) {
                if (this.editable_recipe.id) {
                    this.$emit('update', this.editable_recipe)

                    this.$set(this.editable_recipe, 'updating', true)
                } else {
                    this.$emit('create', this.editable_recipe)

                    this.$set(this.editable_recipe, 'creating', true)
                }
            } else {
                this.hide()
            }
        },
        cancelRecipe () {
            if (this.recipe_changes) {
                let message = null
                let confirmButtonText = null

                if (this.editable_recipe.id) {
                    message = 'Changes have been made to this recipe. If you proceed, changes will be lost.'
                    confirmButtonText = 'Discard Changes'
                } else {
                    message = 'Are you sure you want to discard this recipe?'
                    confirmButtonText = 'Discard Recipe'
                }

                this.$swal({
                    html: message,
                    showCancelButton: true,
                    confirmButtonText: confirmButtonText,
                    confirmButtonColor: '#E74C3C',
                    cancelButtonText: 'Keep Editing',
                    cancelButtonColor: '#f8f9fa',
                    reverseButtons: true
                }).then((result) => {
                    if (result.value) {
                        this.hide()
                    }
                })
            } else {
                this.hide()
            }
        },
        newIngredient () {
            this.ingredient_modal = true
            // if (!this.editable_recipe.ingredients) {
            //     this.$set(this.editable_recipe, 'ingredients', [])
            // }
            //
            // this.editable_recipe.ingredients.push({})
        },
        addIngredient (ingredient) {
            if (!this.editable_recipe.ingredients) {
                this.$set(this.editable_recipe, 'ingredients', [])
            }

            if (ingredient) {
                this.editable_recipe.ingredients.push(ingredient)
            }

            this.ingredient_modal = false
        },
        editIngredient (ingredient) {
            this.$set(ingredient, 'ingredient_modal', true)
        },
        updateIngredient (ingredient, index) {
            this.editable_recipe.ingredients.splice(index, 1, ingredient)

            this.$set(ingredient, 'ingredient_modal', false)
        },
        removeIngredient (ingredient, index) {
            let message = null
            let confirmButtonText = null

            if (ingredient.ingredient) {
                message = 'Are you sure you want to remove <strong>' + ingredient.ingredient + '</strong>?'
                confirmButtonText = 'Remove ' + ingredient.ingredient
            } else {
                message = 'Are you sure you want to remove this ingredient?'
                confirmButtonText = 'Remove Ingredient'
            }

            this.$swal({
                html: message,
                showCancelButton: true,
                confirmButtonText: confirmButtonText,
                confirmButtonColor: '#E74C3C',
                cancelButtonText: 'Cancel',
                cancelButtonColor: '#f8f9fa',
                reverseButtons: true
            }).then((result) => {
                if (result.value) {
                    this.editable_recipe.ingredients.splice(index, 1)
                }
            })
        },
        addInstruction () {
            if (!this.editable_recipe.instructions) {
                this.$set(this.editable_recipe, 'instructions', [])
            }

            this.editable_recipe.instructions.push({})
        },
        removeInstruction (index) {
            this.editable_recipe.instructions.splice(index, 1)
        },
        addNutrition () {
            if (!this.editable_recipe.nutrition) {
                this.$set(this.editable_recipe, 'nutrition', [])
            }

            this.editable_recipe.nutrition.push({})
        },
        removeNutrition (index) {
            this.editable_recipe.nutrition.splice(index, 1)
        },
        validated () {
            let valid = true

            if (!this.editable_recipe.name) {
                valid = false

                if (this.$refs.name) {
                    this.$refs.name.focus()
                }
            } else if (
                !this.editable_recipe.ingredients ||
                (this.editable_recipe.ingredients && !this.editable_recipe.ingredients.length)
            ) {
                valid = false

                if (this.$refs.ingredients) {
                    this.$refs.ingredients.focus()
                }
            } else if (
                !this.editable_recipe.instructions ||
                (this.editable_recipe.instructions && !this.editable_recipe.instructions.length)
            ) {
                valid = false

                if (this.$refs.instructions) {
                    this.$refs.instructions.focus()
                }
            } else if (!this.editable_recipe.servings) {
                valid = false
                this.$refs.servings.focus()
            }

            if (
                this.editable_recipe.ingredients &&
                this.editable_recipe.ingredients.length
            ) {
                _.forEach(this.editable_recipe.ingredients, ingredient => {
                    if (
                        !ingredient.amount ||
                        !ingredient.measurement ||
                        !ingredient.ingredient
                    ) {
                        valid = false
                        this.$refs.ingredients.focus()
                    }
                })
            }

            if (
                this.editable_recipe.instructions &&
                this.editable_recipe.instructions.length
            ) {
                _.forEach(this.editable_recipe.instructions, instruction => {
                    if (
                        !instruction.instruction || instruction.instruction && instruction.instruction == '<p></p>'
                    ) {
                        valid = false
                        this.$refs.instruction.focus()
                    }
                })
            }

            return valid
        },
        setContent (item, field, value) {
            if (value) {
                this.$set(item, field, value)
            }
        },
        show () {
            if (this.recipe) {
                this.editable_recipe = _.cloneDeep(this.recipe)
                this.editable_recipe_cache = _.cloneDeep(this.recipe)
            }
        },
        shown () {
            if (
                !this.editable_recipe.id &&
                this.$refs.name
            ) {
                this.$refs.name.focus()
            }
        },
        hide () {
            this.$emit('hide')
        },
        hidden () {
            this.editable_recipe = {}
            this.editable_recipe_cache = {}

            this.validating = false

            this.$emit('hide')
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/_colors';

.recipe-form {
    .invalid-feedback {
        margin-top: 1rem;
    }
    :focus {
        outline: none;
    }
}

.recipe-title {
    .form-control {
        // font-size: 2.5rem;
        font-size: 2rem;
        font-weight: bold;
        line-height: 1.2;
        min-height: auto;
    }
}

.ingredient {
    & + .ingredient {
        margin-top: .25rem;
    }
}

.instruction {
    & + .instruction {
        margin-top: .25rem;
    }
}

.drag-handle {
    cursor: pointer;
    user-select: none;
}
</style>
