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

            <form class="create-recipe-form" @submit.prevent>
                <div class="mb-3">
                    <input type="text" v-model="recipe.name" class="form-control bg-transparent recipe-title border-0 p-0" placeholder="Recipe Title">
                </div>

                <div class="card mb-3">
                    <div class="card-header">
                        Description
                    </div>
                    <textarea
                        v-model="recipe.description"
                        class="form-control bg-transparent border-0"
                        rows="3"
                    />
                </div>

                <div class="card mb-3">
                    <div class="card-header">
                        Ingredients
                    </div>
                    <div class="card-body">
                        <div v-if="recipe.ingredients.length" class="ingredients">
                            <div
                                v-for="(ingredient, ingredientIndex) in recipe.ingredients"
                                :key="ingredientIndex"
                                :class="{'mt-1': ingredientIndex > 0}"
                            >
                                <div class="input-group">
                                    <input type="text" aria-label="Ingredient" class="form-control" placeholder="Ingredient">
                                    <input type="text" aria-label="Amount" class="form-control" placeholder="Amount">
                                    <input type="text" aria-label="Measurement" class="form-control" placeholder="Measurment">
                                    <button type="button" class="btn btn-outline-danger" @click.prevent="removeIngredient(ingredientIndex)">
                                        <font-awesome-icon :icon="['far', 'minus']" fixed-width />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <div class="alert alert-info mb-0">
                                0 ingredients added
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <button type="button" class="btn btn-sm btn-primary" @click.prevent="addIngredient">
                            <font-awesome-icon :icon="['fad', 'plus-square']" fixed-width /> Add Ingredient
                        </button>
                    </div>
                </div>

                <div class="card mb-3">
                    <div class="card-header">
                        Instructions
                    </div>
                    <div class="card-body">
                        <div v-if="recipe.instructions.length" class="instructions">
                            <div
                                v-for="(instructions, instructionIndex) in recipe.instructions"
                                :key="instructionIndex"
                                :class="{'mt-1': instructionIndex > 0}"
                            >
                                <div class="input-group">
                                    <textarea class="form-control" :placeholder="'Step ' + (instructionIndex + 1)" />
                                    <button type="button" class="btn btn-outline-danger" @click.prevent="removeInstruction(instructionIndex)">
                                        <font-awesome-icon :icon="['far', 'minus']" fixed-width />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            <div class="alert alert-info mb-0">
                                0 instructions added
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <button type="button" class="btn btn-sm btn-primary" @click.prevent="addInstruction">
                            <font-awesome-icon :icon="['fad', 'plus-square']" fixed-width /> Add Instruction
                        </button>
                    </div>
                </div>

                <div class="d-flex mt-4">
                    <button type="button" class="btn btn-success">
                        <font-awesome-icon :icon="['far', 'plus']" fixed-width /> Create Recipe
                    </button>
                    <div class="ml-auto">
                        <button type="button" class="btn btn-outline-danger ml-1" @click.prevent="discardRecipe">
                            <font-awesome-icon :icon="['far', 'trash-alt']" fixed-width /> Discard Recipe
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

import _ from 'lodash'

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
        discardRecipe () {
            this.$swal({
                html: 'Are you sure you want to discard this recipe?',
                showCancelButton: true,
                confirmButtonText: 'Discard Recipe',
                cancelButtonText: 'Cancel',
                reverseButtons: true
            }).then((result) => {
                if (result.value) {
                    this.$router.push({
                        name: 'Home'
                    })
                }
            })
        }
    },
    data: () => ({
        recipe: {
            ingredients: [],
            instructions: []
        },
        recipe_cache: {
            ingredients: [],
            instructions: []
        }
    }),
    beforeRouteLeave (to, from, next) {
        if (!_.isEqual(this.recipe, this.recipe_cache)) {
            this.$swal({
                icon: 'warning',
                title: 'Uh Oh!',
                html: 'If you leave this page before creating your recipe, all changes will be lost.',
                showCancelButton: true,
                confirmButtonText: 'Discard Recipe',
                cancelButtonText: 'Keep Editing',
                reverseButtons: true
            }).then((result) => {
                if (result.value) {
                    next()
                }
            })
        } else {
            next()
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/colors';

.create-recipe-form {
    .badge {
        font-size: 1rem;
    }
}
.recipe-title {
    font-size: 2.5rem;
    font-weight: bold;
    line-height: 1;
    min-height: auto;
}
</style>
