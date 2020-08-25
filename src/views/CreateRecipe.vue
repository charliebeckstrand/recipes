<template>
    <div>
        <div class="container my-3">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                        <router-link :to="{path: '/'}">Recipes</router-link>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                        Create Recipe
                    </li>
                </ol>
            </nav>

            <form class="create-recipe-form" @submit.prevent="createRecipe">
                <div class="mb-3">
                    <input
                        ref="name"
                        type="text"
                        v-model="recipe.name"
                        class="form-control bg-transparent recipe-title border-0 p-0"
                        :class="{
                            'is-invalid': validating && !recipe.name
                        }"
                        placeholder="Recipe Name"
                    >
                    <div
                        v-if="validating && !recipe.name"
                        class="alert alert-danger mt-3 text-danger"
                    >
                        Recipe Name is required
                    </div>
                </div>

                <div class="mb-3">
                    <textarea
                        ref="description"
                        v-model="recipe.description"
                        class="form-control bg-transparent border-0 px-0"
                        rows="1"
                        placeholder="Description"
                    />
                </div>

                <section ref="ingredients" tabindex="-1">
                    <div class="mb-3">
                        <div
                            v-sticky="{ zIndex: 10, stickyTop: 0 }"
                            class="p-3 bg-white sticky"
                        >
                            <h3 class="m-0 text-success font-weight-bold">
                                Ingredients
                            </h3>
                        </div>

                        <div class="pl-3 border-left border-success">
                            <div v-if="recipe.ingredients.length" class="ingredients">
                                <div
                                    v-for="(ingredient, ingredientIndex) in recipe.ingredients"
                                    :key="ingredientIndex"
                                    :class="{'mt-1': ingredientIndex > 0}"
                                >
                                    <div class="input-group">
                                        <input
                                            type="text"
                                            v-model="ingredient.ingredient"
                                            aria-label="Ingredient"
                                            class="form-control"
                                            :class="{'is-invalid': validating && !ingredient.ingredient}"
                                            placeholder="Ingredient"
                                            v-focus
                                        >
                                        <input
                                            type="text"
                                            v-model="ingredient.amount"
                                            aria-label="Amount"
                                            class="form-control"
                                            :class="{'is-invalid': validating && !ingredient.amount}"
                                            placeholder="Amount"
                                        >
                                        <input
                                            type="text"
                                            v-model="ingredient.measurement"
                                            aria-label="Measurement"
                                            class="form-control"
                                            :class="{'is-invalid': validating && !ingredient.measurement}"
                                            placeholder="Measurment"
                                        >
                                        <button type="button" class="btn btn-outline-danger" @click.prevent="removeIngredient(ingredientIndex)">
                                            <font-awesome-icon :icon="['far', 'minus']" fixed-width />
                                        </button>
                                    </div>

                                    <div
                                        v-if="validating && !ingredient.ingredient || validating && !ingredient.amount || validating && !ingredient.measurement"
                                        class="alert alert-danger text-danger mt-3"
                                    >
                                        <ul class="pl-3 mb-0">
                                            <li v-if="validating && !ingredient.ingredient">Ingredient is required</li>
                                            <li v-if="validating && !ingredient.amount">Amount is required</li>
                                            <li v-if="validating && !ingredient.measurement">Measurement is required</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="!validating && !recipe.ingredients.length" class="alert border-success text-success mb-0">
                            0 ingredients added
                        </div>
                        <div
                            v-else-if="validating && !recipe.ingredients.length"
                            class="alert alert-danger text-danger mb-0"
                        >
                            At least 1 ingredient is required
                        </div>
                    </div>

                    <div class="mb-3">
                        <button type="button" class="btn btn-sm btn-success" @click.prevent="addIngredient">
                            <font-awesome-icon :icon="['fad', 'plus-square']" fixed-width /> Add Ingredient
                        </button>
                    </div>
                </section>

                <hr>

                <section ref="instructions" tabindex="-1">
                    <div class="mb-3">
                        <div
                            v-sticky="{ zIndex: 10, stickyTop: 0 }"
                            class="p-3 bg-white sticky"
                        >
                            <h3 class="m-0 text-primary font-weight-bold">
                                Instructions
                            </h3>
                        </div>

                        <div class="pl-3 border-left border-primary">
                            <div v-if="recipe.instructions.length" class="instructions">
                                <div
                                    v-for="(instruction, instructionIndex) in recipe.instructions"
                                    :key="instructionIndex"
                                    :class="{'mt-1': instructionIndex > 0}"
                                >
                                    <div class="input-group">
                                        <textarea
                                            v-model="instruction.instruction"
                                            class="form-control"
                                            :placeholder="'Step ' + (instructionIndex + 1)"
                                            v-focus
                                        />
                                        <button type="button" class="btn btn-outline-danger" @click.prevent="removeInstruction(instructionIndex)">
                                            <font-awesome-icon :icon="['far', 'minus']" fixed-width />
                                        </button>
                                    </div>

                                    <div
                                        v-if="validating && !instruction.instruction"
                                        class="alert alert-danger text-danger mt-3"
                                    >
                                        Instruction is required
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="!validating && !recipe.instructions.length" class="alert border-primary text-primary mb-0">
                            0 instructions added
                        </div>
                        <div
                            v-else-if="validating && !recipe.instructions.length"
                            class="alert alert-danger text-danger mb-0"
                        >
                            At least 1 instruction is required
                        </div>
                    </div>

                    <div class="mb-3">
                        <button type="button" class="btn btn-sm btn-primary" @click.prevent="addInstruction">
                            <font-awesome-icon :icon="['fad', 'plus-square']" fixed-width /> Add Instruction
                        </button>
                    </div>
                </section>

                <hr>

                <section ref="tips" tabindex="-1">
                    <div class="mb-3">
                        <div
                            v-sticky="{ zIndex: 10, stickyTop: 0 }"
                            class="p-3 bg-white sticky"
                        >
                            <h3 class="m-0 text-warning font-weight-bold">
                                Tips
                            </h3>
                        </div>

                        <div class="pl-3 border-left border-warning">
                            <div v-if="recipe.tips.length" class="tips">
                                <div
                                    v-for="(tip, tipIndex) in recipe.tips"
                                    :key="tipIndex"
                                    :class="{'mt-1': tipIndex > 0}"
                                >
                                    <div class="input-group">
                                        <textarea
                                            v-model="tip.tip"
                                            class="form-control"
                                            :placeholder="'Tip ' + (tipIndex + 1)"
                                            v-focus
                                         />
                                        <button type="button" class="btn btn-outline-danger" @click.prevent="removeTip(tipIndex)">
                                            <font-awesome-icon :icon="['far', 'minus']" fixed-width />
                                        </button>
                                    </div>

                                    <div
                                        v-if="validating && !tip.tip"
                                        class="alert alert-danger text-danger mt-3"
                                    >
                                        Tip is required
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="!recipe.tips.length">
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
                            v-sticky="{ zIndex: 10, stickyTop: 0 }"
                            class="p-3 bg-white sticky"
                        >
                            <h3 class="m-0 text-info font-weight-bold">
                                Nutrition
                            </h3>
                        </div>

                        <div class="pl-3 border-left border-info">
                            <div v-if="recipe.nutrition.length" class="nutrition">
                                <div
                                    v-for="(item, nutritionIndex) in recipe.nutrition"
                                    :key="nutritionIndex"
                                    :class="{'mt-1': nutritionIndex > 0}"
                                >
                                    <div class="input-group">
                                        <input
                                            type="text"
                                            v-model="item.item"
                                            aria-label="Fact"
                                            class="form-control"
                                            placeholder="Item"
                                            v-focus
                                        >
                                        <input
                                            type="text"
                                            v-model="item.amount"
                                            aria-label="Amount"
                                            class="form-control"
                                            placeholder="Amount"
                                        >
                                        <input
                                            type="text"
                                            v-model="item.measurement"
                                            aria-label="Measurement"
                                            class="form-control"
                                            placeholder="Measurment"
                                        >
                                        <input
                                            type="text"
                                            v-model="item.daily_value"
                                            aria-label="% of Daily Value"
                                            class="form-control"
                                            placeholder="% of Daily Value"
                                        >
                                        <button type="button" class="btn btn-outline-danger" @click.prevent="removeNutrition(nutritionIndex)">
                                            <font-awesome-icon :icon="['far', 'minus']" fixed-width />
                                        </button>
                                    </div>

                                    <div
                                        v-if="validating && !item.item || validating && !item.amount || validating && !item.measurement || validating && !item.daily_value"
                                        class="alert alert-danger text-danger mt-3"
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
                        <div v-if="!recipe.nutrition.length">
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
                            v-sticky="{ zIndex: 10, stickyTop: 0 }"
                            class="p-3 bg-white sticky"
                        >
                            <h3 class="m-0 text-danger font-weight-bold">
                                Notes
                            </h3>
                        </div>

                        <div class="pl-3 border-left border-danger">
                            <div v-if="recipe.notes.length" class="notes">
                                <div
                                    v-for="(note, noteIndex) in recipe.notes"
                                    :key="noteIndex"
                                    :class="{'mt-1': noteIndex > 0}"
                                >
                                    <div class="input-group">
                                        <textarea
                                            v-model="note.note"
                                            class="form-control"
                                            :placeholder="'Note ' + (noteIndex + 1)"
                                            v-focus
                                        />
                                        <button type="button" class="btn btn-outline-danger" @click.prevent="removeNote(noteIndex)">
                                            <font-awesome-icon :icon="['far', 'minus']" fixed-width />
                                        </button>
                                    </div>

                                    <div
                                        v-if="validating && !note.note"
                                        class="alert alert-danger text-danger mt-3"
                                    >
                                        Note is required
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="!recipe.notes.length">
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

                <div class="mt-5">
                    <div class="row">
                        <div class="col-lg">
                            <input
                                ref="preptime"
                                type="number"
                                v-model="recipe.time.prep"
                                class="form-control"
                                placeholder="Prep Time"
                            >
                        </div>
                        <div class="col-lg">
                            <input
                                ref="cooktime"
                                type="number"
                                v-model="recipe.time.cook"
                                class="form-control"
                                placeholder="Cook Time"
                            >
                        </div>
                        <div class="col-lg">
                            <input
                                ref="totaltime"
                                type="number"
                                v-model="recipe.time.total"
                                class="form-control"
                                placeholder="Total Time"
                            >
                        </div>
                    </div>
                </div>

                <div class="mt-3">
                    <input
                        ref="servings"
                        type="number"
                        v-model="recipe.servings"
                        class="form-control"
                        :class="{'is-invalid': validating && !recipe.services}"
                        placeholder="Servings"
                    >
                    <div
                        v-if="validating && !recipe.services"
                        class="alert alert-danger mt-3 text-danger"
                    >
                        Servings is required
                    </div>
                </div>

                <div class="d-flex align-items-center mt-5">
                    <button
                        type="submit"
                        class="btn btn-success"
                        :disabled="creating"
                    >
                        <div v-if="creating">
                            <div class="spinner-border" role="status">
                                <span class="sr-only">Loading...</span>
                            </div>
                        </div>
                        <div v-else>
                            <font-awesome-icon :icon="['far', 'plus']" fixed-width /> Create Recipe
                        </div>
                    </button>
                    <div class="ml-auto">
                        <a
                            href="#"
                            class="text-danger ml-1"
                            @click.prevent="discardRecipe"
                        >
                            <font-awesome-icon :icon="['far', 'trash-alt']" fixed-width /> Discard Recipe
                        </a>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

import _ from 'lodash'
import VueSticky from 'vue-sticky'

import firebase from 'firebase/app'
import moment from 'moment'

export default {
    name: 'Login',
    components: {

    },
    computed: {
        ...mapState({
            currentUser: state => state.user.user
        }),
    },
    directives: {
        'sticky': VueSticky,
    },
    methods: {
        addIngredient () {
            this.recipe.ingredients.push({})
        },
        removeIngredient (index) {
            this.recipe.ingredients.splice(index, 1)
        },
        addInstruction () {
            this.recipe.instructions.push({})
        },
        removeInstruction (index) {
            this.recipe.instructions.splice(index, 1)
        },
        addTip () {
            this.recipe.tips.push({})
        },
        removeTip (index) {
            this.recipe.tips.splice(index, 1)
        },
        addNutrition () {
            this.recipe.nutrition.push({})
        },
        removeNutrition (index) {
            this.recipe.nutrition.splice(index, 1)
        },
        addNote () {
            this.recipe.notes.push({})
        },
        removeNote (index) {
            this.recipe.notes.splice(index, 1)
        },
        validate () {
            let valid = true

            if (!this.recipe.name) {
                valid = false
                if (this.$refs.name) {
                    this.$refs.name.focus()
                }
            } else if (!this.recipe.ingredients.length) {
                valid = false
                if (this.$refs.ingredients) {
                    this.$refs.ingredients.focus()
                }
            } else if (!this.recipe.instructions.length) {
                valid = false

                if (this.$refs.instructions) {
                    this.$refs.instructions.focus()
                }
            } else if (!this.recipe.servings) {
                valid = false
                this.$refs.servings.focus()
            }

            if (this.recipe.ingredients.length) {
                _.forEach(this.recipe.ingredients, ingredient => {
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

            if (this.recipe.instructions.length) {
                _.forEach(this.recipe.instructions, instruction => {
                    if (!instruction.instruction) {
                        valid = false
                        this.$refs.instruction.focus()
                    }
                })
            }

            if (this.recipe.tips.length) {
                _.forEach(this.recipe.tips, tip => {
                    if (!tip.tip) {
                        valid = false
                        this.$refs.tips.focus()
                    }
                })
            }

            if (this.recipe.nutrition.length) {
                _.forEach(this.recipe.nutrition, item => {
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

            if (this.recipe.notes.length) {
                _.forEach(this.recipe.notes, note => {
                    if (!note.note) {
                        valid = false
                        this.$refs.notes.focus()
                    }
                })
            }

            return valid
        },
        createRecipe () {
            let created = {
                date: this.moment().format('ddd, DD MMM YYYY'),
                date_time: this.moment().format('ddd, DD MMM YYYY HH:mm:ss ZZ')
            }

            let created_by = {
                displayName: this.currentUser.displayName,
                email: this.currentUser.email,
                uid: this.currentUser.uid
            }

            this.validating = true

            if (!this.validate()) {
                return false
            }

            this.creating = true

            Object.assign(this.recipe, {created})
            Object.assign(this.recipe, {created_by})

            firebase.firestore().collection('recipes').doc().set(this.recipe)
            .then(() => {
                this.$router.push({
                    name: 'Home'
                })

                this.validating = false
                this.creating = false
            })
            .catch(error => {
                if (error) {
                    this.creating = false

                    this.$swal("Error", error.message, "error")
                }
            })
        },
        discardRecipe () {
            this.$router.push({
                name: 'Home'
            })
        }
    },
    data: () => ({
        recipe: {
            ingredients: [],
            instructions: [],
            tips: [],
            nutrition: [],
            notes: [],
            time: {}
        },

        recipe_cache: {},

        moment: moment,

        validating: false,
        creating: false
    }),
    // beforeRouteLeave (to, from, next) {
    //     if (!_.isEqual(this.recipe, this.recipe_cache)) {
    //         this.$swal({
    //             icon: 'warning',
    //             // title: 'Uh Oh!',
    //             html: 'If you leave this page before creating your recipe, all changes will be lost.',
    //             showCancelButton: true,
    //             confirmButtonText: 'Discard Recipe',
    //             cancelButtonText: 'Keep Editing',
    //             reverseButtons: true
    //         }).then((result) => {
    //             if (result.value) {
    //                 next()
    //             }
    //         })
    //     } else {
    //         next()
    //     }
    // },
    mounted () {
        this.recipe_cache = _.cloneDeep(this.recipe)
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/colors';

.create-recipe-form {
    .invalid-feedback {
        margin-top: 1rem;
    }
    :focus {
        outline: none;
    }
}

.recipe-title {
    font-size: 2.5rem;
    font-weight: bold;
    line-height: 1;
    min-height: auto;
}

.sticky {
    margin-left: -1rem;
    margin-right: -1rem;
}

@media (max-width: 991px) {
    .recipe-title {
        font-size: 2rem;
    }
}
</style>
