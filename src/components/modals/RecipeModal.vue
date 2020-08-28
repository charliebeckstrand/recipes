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
            <!-- <template #modal-header>
                <h5 class="modal-title font-weight-bold">
                    <div v-if="editable_recipe.id">
                        Edit Recipe
                    </div>
                    <div v-else>
                        Create Recipe
                    </div>
                </h5>
                <a
                    href="#"
                    class="modal-close"
                    aria-label="Close"
                    @click.prevent="hide"
                >
                    <font-awesome-layers>
                        <font-awesome-icon icon="circle" class="background" transform="shrink-1" />
                        <font-awesome-icon :icon="['fas', 'times-circle']" class="foreground" />
                    </font-awesome-layers>
                </a>
            </template> -->

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

            <!--
            <div v-if="editable_recipe.html">
                <simple-recipe-form
                    :recipe="editable_recipe"
                />
            </div>
            -->

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

            <div class="mt-3">
                <!-- <textarea
                    ref="description"
                    v-model="editable_recipe.description"
                    class="form-control bg-transparent border-0 px-0"
                    rows="1"
                    placeholder="Description"
                /> -->
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
                                        'mt-3': ingredientIndex > 0 && validating
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
                                                    <div>
                                                        <a
                                                            href="#"
                                                            class="ml-3"
                                                            @click.prevent="editIngredient(ingredient)"
                                                        >
                                                            <font-awesome-icon :icon="['fad', 'edit']" fixed-width />
                                                        </a>
                                                        <a
                                                            href="#"
                                                            class="text-danger ml-3"
                                                            @click.prevent="removeIngredient(ingredientIndex)"
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
                    <button type="button" class="btn btn-sm btn-success" @click="newIngredient">
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
                            <div
                                v-for="(instruction, instructionIndex) in editable_recipe.instructions"
                                :key="instructionIndex"
                                :class="{
                                    'mt-1': instructionIndex > 0,
                                    'mt-3': instructionIndex > 0 && validating
                                }"
                            >
                                <div class="d-flex align-items-center">
                                    <div class="flex-grow-1">
                                        <TipTap
                                            v-model="instruction.instruction"
                                            editor_menu="bubble"
                                            :autoFocus="instruction.instruction ? false : true"
                                            :placeholder="'Step ' + (instructionIndex + 1)"
                                            @input="setContent(instruction, 'instruction', $event)"
                                        />
                                    </div>
                                    <div class="ml-3">
                                        <button type="button" class="btn btn-link text-danger px-0" @click.prevent="removeInstruction(instructionIndex)">
                                            <font-awesome-icon :icon="['far', 'minus']" fixed-width />
                                        </button>
                                    </div>
                                </div>

                                <div
                                    v-if="validating && !instruction.instruction"
                                    class="text-danger mt-3"
                                >
                                    &bull; Instruction is required
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="!editable_recipe.instructions || (editable_recipe.instructions && !editable_recipe.instructions.length)" class="alert border-primary text-primary mb-0">
                        0 instructions added
                    </div>
                    <div
                        v-if="validating && (!editable_recipe.instructions || (editable_recipe.instructions && !editable_recipe.instructions.length))"
                        class="text-danger mt-3"
                    >
                        &bull; At least 1 instruction is required
                    </div>
                </div>

                <div class="mb-3">
                    <button type="button" class="btn btn-sm btn-primary" @click.prevent="addInstruction">
                        <font-awesome-icon :icon="['fad', 'plus-square']" fixed-width /> Add Instruction
                    </button>
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

                    <div class="pl-3 border-left border-warning">
                        <div v-if="editable_recipe.tips && editable_recipe.tips.length" class="tips">
                            <div
                                v-for="(tip, tipIndex) in editable_recipe.tips"
                                :key="tipIndex"
                                :class="{
                                    'mt-1': tipIndex > 0,
                                    'mt-3': tipIndex > 0 && validating
                                }"
                            >
                                <!-- <div class="input-group">
                                    <textarea
                                        v-model="tip.tip"
                                        class="form-control"
                                        :class="{'is-invalid': validating && !tip.tip}"
                                        :placeholder="'Tip ' + (tipIndex + 1)"
                                        v-focus
                                     />
                                    <button type="button" class="btn btn-outline-danger" @click.prevent="removeTip(tipIndex)">
                                        <font-awesome-icon :icon="['far', 'minus']" fixed-width />
                                    </button>
                                </div> -->

                                <div class="d-flex align-items-center">
                                    <div class="flex-grow-1">
                                        <TipTap
                                            v-model="tip.tip"
                                            editor_menu="bubble"
                                            :autoFocus="true"
                                            :placeholder="'Tip ' + (tipIndex + 1)"
                                            @input="setContent(tip, 'tip', $event)"
                                        />
                                    </div>
                                    <div class="ml-3">
                                        <button type="button" class="btn btn-link text-danger px-0" @click.prevent="removeTip(tipIndex)">
                                            <font-awesome-icon :icon="['far', 'minus']" fixed-width />
                                        </button>
                                    </div>
                                </div>

                                <div
                                    v-if="validating && !tip.tip"
                                    class="text-danger mt-3"
                                >
                                    &bull; Tip is required
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="!editable_recipe.tips || (editable_recipe.tips && !editable_recipe.tips.length)">
                        <div class="alert border-warning text-warning mb-0">
                            0 tips added
                        </div>
                    </div>
                </div>

                <div class="mb-3">
                    <button type="button" class="btn btn-sm btn-warning" @click.prevent="addTip">
                        <font-awesome-icon :icon="['fad', 'plus-square']" fixed-width /> Add Tip
                    </button>
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

                    <div class="pl-3 border-left border-info">
                        <div v-if="editable_recipe.nutrition && editable_recipe.nutrition.length" class="nutrition">
                            <div
                                v-for="(item, nutritionIndex) in editable_recipe.nutrition"
                                :key="nutritionIndex"
                                :class="{
                                    'mt-1': nutritionIndex > 0,
                                    'mt-3': nutritionIndex > 0 && validating
                                }"
                            >
                                <div class="input-group">
                                    <input
                                        type="text"
                                        v-model="item.item"
                                        aria-label="Fact"
                                        class="form-control"
                                        :class="{'is-invalid': validating && !item.item}"
                                        placeholder="Item"
                                        v-focus
                                    >
                                    <input
                                        type="text"
                                        v-model="item.amount"
                                        aria-label="Amount"
                                        class="form-control"
                                        :class="{'is-invalid': validating && !item.amount}"
                                        placeholder="Amount"
                                    >
                                    <input
                                        type="text"
                                        v-model="item.measurement"
                                        aria-label="Measurement"
                                        class="form-control"
                                        :class="{'is-invalid': validating && !item.measurement}"
                                        placeholder="Measurment"
                                    >
                                    <input
                                        type="text"
                                        v-model="item.daily_value"
                                        aria-label="% of Daily Value"
                                        class="form-control"
                                        :class="{'is-invalid': validating && !item.daily_value}"
                                        placeholder="% of Daily Value"
                                    >
                                    <button type="button" class="btn btn-outline-danger" @click.prevent="removeNutrition(nutritionIndex)">
                                        <font-awesome-icon :icon="['far', 'minus']" fixed-width />
                                    </button>
                                </div>

                                <div
                                    v-if="validating && !item.item || validating && !item.amount || validating && !item.measurement || validating && !item.daily_value"
                                    class="text-danger mt-3"
                                >
                                    <ul class="pl-3 mb-0">
                                        <li v-if="validating && !item.item">Item is required</li>
                                        <li v-if="validating && !item.amount">Amount is required</li>
                                        <li v-if="validating && !item.measurement">Measurement is required</li>
                                        <li v-if="validating && !item.daily_value">% of Daily Value</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="!editable_recipe.nutrition || (editable_recipe.nutrition && !editable_recipe.nutrition.length)">
                        <div class="alert border-info text-info mb-0">
                            0 nutrition added
                        </div>
                    </div>
                </div>

                <div class="mb-3">
                    <button type="button" class="btn btn-sm btn-info" @click.prevent="addNutrition">
                        <font-awesome-icon :icon="['fad', 'plus-square']" fixed-width /> Add Nutrition Fact
                    </button>
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

                    <div class="pl-3 border-left border-danger">
                        <div v-if="editable_recipe.notes && editable_recipe.notes.length" class="notes">
                            <div
                                v-for="(note, noteIndex) in editable_recipe.notes"
                                :key="noteIndex"
                                :class="{
                                    'mt-1': noteIndex > 0,
                                    'mt-3': noteIndex > 0 && validating
                                }"
                            >
                                <div class="d-flex align-items-center">
                                    <div class="flex-grow-1">
                                        <TipTap
                                            v-model="note.note"
                                            editor_menu="bubble"
                                            :autoFocus="true"
                                            :placeholder="'Note ' + (noteIndex + 1)"
                                            @input="setContent(note, 'note', $event)"
                                        />
                                    </div>
                                    <div class="ml-3">
                                        <button type="button" class="btn btn-link text-danger px-0" @click.prevent="removeNote(noteIndex)">
                                            <font-awesome-icon :icon="['far', 'minus']" fixed-width />
                                        </button>
                                    </div>
                                </div>

                                <div
                                    v-if="validating && !note.note"
                                    class="text-danger mt-3"
                                >
                                    &bull; Note is required
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="!editable_recipe.notes || (editable_recipe.notes && !editable_recipe.notes.length)">
                        <div class="alert border-danger text-danger mb-0">
                            0 notes added
                        </div>
                    </div>
                </div>

                <div class="mb-3">
                    <button type="button" class="btn btn-sm btn-danger" @click.prevent="addNote">
                        <font-awesome-icon :icon="['fad', 'plus-square']" fixed-width /> Add note
                    </button>
                </div>
            </section>

            <!-- <div class="mt-5">
                <div class="row">
                    <div class="col-lg mb-lg-0 mb-3">
                        <label class="form-label">Prep Time</label>
                        <input
                            ref="preptime"
                            type="number"
                            v-model="editable_recipe.prep_time"
                            class="form-control"
                            placeholder="Prep Time"
                        >
                    </div>
                    <div class="col-lg mb-lg-0 mb-3">
                        <label class="form-label">Cook Time</label>
                        <input
                            ref="cooktime"
                            type="number"
                            v-model="editable_recipe.cook_time"
                            class="form-control"
                            placeholder="Cook Time"
                        >
                    </div>
                    <div class="col-lg">
                        <label class="form-label">Total Time</label>
                        <input
                            ref="totaltime"
                            type="number"
                            v-model="editable_recipe.total_time"
                            class="form-control"
                            placeholder="Total Time"
                        >
                    </div>
                </div>
            </div> -->

            <div class="mt-4">
                <label class="form-label">Bake Time</label>
                <input
                    ref="totaltime"
                    type="number"
                    v-model="editable_recipe.total_time"
                    class="form-control"
                    placeholder="Total Time"
                >
            </div>

            <div class="mt-3">
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

            <template #modal-footer>
                <button
                    type="button"
                    class="btn btn-light"
                    @click="cancelRecipe"
                >
                    Cancel
                </button>
                <button
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
                            <font-awesome-icon
                                :icon="['fal', 'spinner-third']"
                                spin
                                fixed-width
                            />
                        </div>
                        <div v-else>
                            <font-awesome-icon :icon="['fad', 'check-square']" fixed-width /> Save Changes
                        </div>
                    </div>
                    <div v-else>
                        <div v-if="editable_recipe.creating">
                            <font-awesome-icon
                                :icon="['fal', 'spinner-third']"
                                spin
                                fixed-width
                            />
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

            if (this.editable_recipe.id) {
                this.$emit('update', this.editable_recipe)

                this.$set(this.editable_recipe, 'updating', true)
            } else {
                this.$emit('create', this.editable_recipe)

                this.$set(this.editable_recipe, 'creating', true)
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
        removeIngredient (index) {
            this.editable_recipe.ingredients.splice(index, 1)
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
        addTip () {
            if (!this.editable_recipe.tips) {
                this.$set(this.editable_recipe, 'tips', [])
            }

            this.editable_recipe.tips.push({})
        },
        removeTip (index) {
            this.editable_recipe.tips.splice(index, 1)
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
        addNote () {
            if (!this.editable_recipe.notes) {
                this.$set(this.editable_recipe, 'notes', [])
            }

            this.editable_recipe.notes.push({})
        },
        removeNote (index) {
            this.editable_recipe.notes.splice(index, 1)
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
                        !ingredient.ingredient ||
                        !ingredient.amount ||
                        !ingredient.measurement
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
                    if (!instruction.instruction) {
                        valid = false
                        this.$refs.instruction.focus()
                    }
                })
            }

            if (
                this.editable_recipe.tips &&
                this.editable_recipe.tips.length
            ) {
                _.forEach(this.editable_recipe.tips, tip => {
                    if (!tip.tip) {
                        valid = false
                        this.$refs.tips.focus()
                    }
                })
            }

            if (
                this.editable_recipe.nutrition &&
                this.editable_recipe.nutrition.length
            ) {
                _.forEach(this.editable_recipe.nutrition, item => {
                    if (
                        !item.item ||
                        !item.amount ||
                        !item.measurement ||
                        !item.daily_value
                    ) {
                        valid = false
                        this.$refs.nutrition.focus()
                    }
                })
            }

            if (
                this.editable_recipe.notes &&
                this.editable_recipe.notes.length
            ) {
                _.forEach(this.editable_recipe.notes, note => {
                    if (!note.note) {
                        valid = false
                        this.$refs.notes.focus()
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
    .drag-handle {
        cursor: pointer;
        user-select: none;
    }
}
</style>
