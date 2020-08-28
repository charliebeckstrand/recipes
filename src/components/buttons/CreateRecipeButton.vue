<template>
    <div class="create-recipe-button">
        <button
            type="button"
            class="btn btn-success"
            @click.prevent="createRecipe"
        >
            <font-awesome-icon :icon="['far', 'plus']" /> Create Recipe
        </button>

        <recipe-modal
            v-model="recipe_modal"
            @create="setRecipe"
            @hide="recipe_modal = false"
        />
    </div>
</template>

<script>
import { mapState } from 'vuex'

import firebase from 'firebase/app'
import 'firebase/firestore'

import moment from 'moment'

import RecipeModal from '@/components/modals/RecipeModal'

export default {
    name: 'CreateRecipeButton',
    data: () => ({
        moment: moment,

        recipe_modal: false
    }),
    components: {
        RecipeModal
    },
    computed: {
        ...mapState({
            currentUser: state => state.user.user
        }),
    },
    props: {

    },
    methods: {
        createRecipe () {
            this.recipe_modal = true
        },
        setRecipe (recipe) {
            const created = this.moment().format()

            const created_by = {
                displayName: this.currentUser.displayName,
                email: this.currentUser.email,
                uid: this.currentUser.uid
            }

            Object.assign(recipe, {created})
            Object.assign(recipe, {created_by})

            firebase
            .firestore()
            .collection("recipes")
            .doc()
            .set(recipe)
            .then(() => {
                this.recipe_modal = false

                this.$set(recipe, 'creating', false)
            })
            .catch(error => {
                if (error) {
                    console.log(error)
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/_colors';
</style>
