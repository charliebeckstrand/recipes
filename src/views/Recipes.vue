<template>
    <div class="home">
        <div v-if="loading">
            <div class="container py-3">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        </div>
        <div v-else>
            <!-- <div
                v-sticky="{ zIndex: 10, stickyTop: 0 }"
                class="bg-white p-3 border-bottom"
            >
                <div class="container">
                    <div class="d-flex align-items-center">
                        <div class="input-group">
                            <input type="search" v-model="filters.search" class="form-control" placeholder="Search" />
                            <button type="button" class="btn btn-link filter-button">
                                <font-awesome-icon :icon="['fad', 'filter']" />
                            </button>
                        </div>
                    </div>
                </div>
            </div> -->

            <div class="container pt-3 pb-4">
                <div v-if="currentUser && currentUser.uid" class="d-flex mb-3">
                    <div class="ml-auto">
                        <div>
                            <router-link class="btn btn-success" :to="{name: 'CreateRecipe'}">
                                <font-awesome-icon :icon="['far', 'plus']" /> Create Recipe
                            </router-link>
                        </div>
                    </div>
                </div>
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

                <!-- <Recipe
                    v-for="(recipe, recipeIndex) in filtered_recipes"
                    :key="recipeIndex"
                    :recipe="recipe"
                    :class="{'mt-3': recipeIndex > 0}"
                /> -->

                <div
                    v-for="(recipe, recipeIndex) in filtered_recipes"
                    :key="recipeIndex"
                    :class="{'mt-3': recipeIndex > 0}"
                >
                    <RecipeList
                        :recipe="recipe"
                    />
                </div>

                <div v-if="!filtered_recipes.length">
                    <div class="alert alert-danger">
                        0 results
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

import VueSticky from 'vue-sticky'

import firebase from 'firebase/app'
import 'firebase/firestore'

import meals from '@/common/meals'

import RecipeList from '@/components/RecipeList'

export default {
    name: 'Home',
    components: {
        RecipeList
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
                    // _.forEach(this.filters.meals, meal => {
                    //     if (_.find(recipe.tags, meal.value)) {
                    //         console.log("true")
                    //         meal_match = true
                    //     }
                    // })

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
    directives: {
        'sticky': VueSticky,
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
                resolve: () => {
                    this.loading = false
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
</style>
