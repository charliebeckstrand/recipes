<template>
    <div class="recipes page">
        <div
            v-sticky="{
                zIndex: 11,
                stickyTop: 0
            }"
            class="bg-white py-3 sticky-title"
        >
            <div class="d-flex align-items-center">
                <div>
                    <h1
                        class="font-weight-bold mb-0"
                    >
                        Recipes
                    </h1>
                </div>
                <div class="ml-auto">

                </div>
            </div>
        </div>

        <div v-if="loading" class="page-loading pb-3">
            <font-awesome-icon
                :icon="['fal', 'spinner-third']"
                size="2x"
                spin
                fixed-width
            />
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
                :class="{'mt-2': recipeIndex > 0}"
            >
                <Recipe :recipe="recipe" />
            </div>

            <div v-if="!recipes.length">
                <div class="alert alert-danger text-danger">
                    0 results
                </div>
            </div>

            <!-- <nav class="mt-3" aria-label="Page navigation example">
                <ul class="pagination">
                    <li class="page-item"><a class="page-link" href="#">Prev</a></li>
                    <li class="page-item"><a class="page-link" href="#">1</a></li>
                    <li class="page-item"><a class="page-link" href="#">2</a></li>
                    <li class="page-item"><a class="page-link" href="#">Next</a></li>
                </ul>
            </nav> -->
        </div>
    </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'

import { mapState } from 'vuex'

import meals from '@/common/meals'

import Recipe from '@/components/recipe/Card'

export default {
    name: 'Recipes',
    data: () => ({
        meals: meals,

        filters: {},

        loading: false
    }),
    components: {
        Recipe
    },
    computed: {
        ...mapState({
            currentUser: state => state.user.user,
            // recipes: state => state.recipes.recipes
        }),
        // filtered_recipes () {
        //     let recipes = []
        //
        //     recipes = _.filter(this.recipes, recipe => {
        //         let search_match = false
        //
        //         if (!_.some(this.filters.search)) {
        //             search_match = true
        //         } else if (
        //             this.filters.search &&
        //             recipe.name &&
        //             recipe.name.toLowerCase().indexOf(this.filters.search) > -1
        //         ) {
        //             search_match = true
        //         }
        //
        //         let meal_match = false
        //
        //         if (!_.some(this.filters.meals)) {
        //             meal_match = true
        //         } else if (
        //             this.filters.meals &&
        //             this.filters.meals.length
        //         ) {
        //             _.forEach(this.filters.meals, meal => {
        //                 _.forEach(recipe.tags, tag => {
        //                     if (tag.tag == meal.value) {
        //                         meal_match = true
        //                     }
        //                 })
        //             })
        //         }
        //
        //         return search_match && meal_match
        //     })
        //
        //     recipes = recipes.sort((a, b) => {
        //         return new Date(b.created.date_time) - new Date(a.created)
        //     })
        //
        //     return recipes
        // }
    },
    methods: {
        getRecipes () {
            this.$binding(
                'recipes', firebase
                .firestore()
                .collection('recipes')
                .orderBy('created', 'desc')
            )
            .then((recipes) => {
                this.recipes = recipes

                this.loading = false
            })

            // this.$store.dispatch('getRecipes')
            // .then(() => {
            //      this.loading = false
            // })
        }
    },
    created () {
        this.loading = true

        this.getRecipes()
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
