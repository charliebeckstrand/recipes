<template>
    <div class="recipes">
        <div
            v-sticky="{
                zIndex: 11,
                stickyTop: 0
            }"
            class="bg-white py-3 sticky-title"
        >
            <h1
                class="font-weight-bold"
            >
                Recipes
            </h1>
        </div>

        <div v-if="loading">
            <div
                v-for="(item, itemIndex) in 3"
                :key="itemIndex"
                class="card recipe-placeholder"
                :class="{'mt-3': itemIndex > 0}"
            >
                <div class="d-flex">
                    <div class="flex-grow-1">
                        <div class="card-body">
                            <div class="card-title mb-3">
                                <content-placeholders :rounded="true">
                                    <content-placeholders-heading :img="false" :lines="1" />
                                </content-placeholders>
                            </div>
                            <div class="card-text m-0">
                                <content-placeholders :rounded="true">
                                    <content-placeholders-text :lines="2" />
                                </content-placeholders>
                            </div>
                        </div>
                    </div>
                    <div class="recipe-image">
                        <content-placeholders class="h-100" :rounded="false">
                            <content-placeholders-img class="h-100" />
                        </content-placeholders>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <!-- <div class="mb-3">
                <div class="d-flex align-items-center">
                    <div class="input-group">
                        <input type="search" v-model="filters.search" class="form-control" placeholder="Search" />
                        <button type="button" class="btn btn-link filter-button">
                            <font-awesome-icon :icon="['fad', 'filter']" />
                        </button>
                    </div>
                </div>
            </div> -->

            <div class="d-flex align-items-center">
                <!-- <multiselect
                    v-model="filters.meals"
                    :options="meals"
                    :multiple="true"
                    :clear-on-select="false"
                    :preserve-search="true"
                    placeholder="Meals"
                    label="name"
                    track-by="name"
                /> -->
            </div>

            <div
                v-for="(recipe, recipeIndex) in recipes"
                :key="recipeIndex"
                :class="{'mt-3': recipeIndex > 0}"
            >
                <Recipe :recipe="recipe" />
            </div>

            <div v-if="!recipes.length">
                <div class="alert alert-danger text-danger">
                    0 results
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

import firebase from 'firebase/app'
import 'firebase/firestore'

import meals from '@/common/meals'

import Recipe from '@/components/Recipe'

export default {
    name: 'Home',
    components: {
        Recipe
    },
    computed: {
        ...mapState({
            currentUser: state => state.user.user
        }),
        filtered_recipes () {
            let recipes = []

            recipes = _.filter(this.recipes, recipe => {
                let search_match = false

                if (!_.some(this.filters.search)) {
                    search_match = true
                } else if (
                    this.filters.search &&
                    recipe.name &&
                    recipe.name.toLowerCase().indexOf(this.filters.search) > -1
                ) {
                    search_match = true
                }

                let meal_match = false

                if (!_.some(this.filters.meals)) {
                    meal_match = true
                } else if (
                    this.filters.meals &&
                    this.filters.meals.length
                ) {
                    _.forEach(this.filters.meals, meal => {
                        _.forEach(recipe.tags, tag => {
                            if (tag.tag == meal.value) {
                                meal_match = true
                            }
                        })
                    })
                }

                return search_match && meal_match
            })

            recipes = recipes.sort((a, b) => {
                return new Date(b.created.date_time) - new Date(a.created.date_time)
            })

            return recipes
        }
    },
    data: () => ({
        meals: meals,

        filters: {},

        loading: true
    }),
    firestore () {
        return {
            recipes: {
                ref: firebase.firestore().collection('recipes'),
                resolve: (response) => {
                    if (response) {
                        this.loading = false
                    }
                },
                reject: (error) => {
                    this.loading = false

                    if (error) {
                        console.log(error)
                    }
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.filter-button {
    border: 1px solid #ced4da;
}
.recipe-placeholder {
    .recipe-image {
        width: 150px;
    }

    @media (max-width: 991px) {
        .recipe-image {
            width: 125px;
        }
    }
}
</style>
