<template>
    <div class="dashboard page">
        <!-- <div
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
                        My Recipes
                    </h1>
                </div>
                <div class="ml-auto">

                </div>
            </div>
        </div> -->

        <div v-if="loading">
            <font-awesome-icon
                :icon="['fal', 'spinner-third']"
                size="2x"
                spin
                fixed-width
            />
        </div>
        <div v-else>
            <div class="d-flex align-items-center mb-3">
                <div class="ml-auto">
                    <create-recipe-button />
                </div>
            </div>

            <div
                v-for="(recipe, recipeIndex) in recipes"
                :key="recipeIndex"
                :class="{'mt-2': recipeIndex > 0}"
            >
                <Recipe
                    :recipe="recipe"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

import firebase from 'firebase/app'
import 'firebase/firestore'

import CreateRecipeButton from '@/components/buttons/CreateRecipeButton'

import Recipe from '@/components/recipe/Card'

export default {
    name: 'MyRecipes',
    data: () => ({
        recipes: [],

        loading: false
    }),
    components: {
        CreateRecipeButton,

        Recipe
    },
    computed: {
        ...mapState({
            currentUser: state => state.user.user
        })
    },
    methods: {
        getRecipes () {
            this.loading = true

            this.$binding(
                'recipes', firebase
                .firestore()
                .collection('recipes')
                .where('created_by.uid', '==', this.currentUser.uid)
                .orderBy('created', 'desc')
            )
            .then((recipes) => {
                this.recipes = recipes

                this.loading = false
            })
        }
    },
    created () {
        this.getRecipes()
    }
}
</script>

<style lang="scss" scoped>

</style>
