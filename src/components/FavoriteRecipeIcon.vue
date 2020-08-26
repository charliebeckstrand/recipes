<template>
    <div class="favorite-recipe-icon">
        <a
            href="#"
            class="text-pink"
            :title="favorited ? 'Unfavorite' : 'Favorite'"
            @click.prevent="favoriteRecipe"
        >
            <font-awesome-icon
                :icon="favorited ? ['fas', 'heart'] : ['far', 'heart']"
                fixed-width
            />
        </a>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'FavoriteRecipeIcon',
    components: {

    },
    computed: {
        ...mapState({
            favorite_recipes: state => state.user.favorite_recipes
        }),
        favorited () {
            return this.favorite_recipes.includes(this.recipe_key)
        }
    },
    props: {
        recipe_key: String
    },
    methods: {
        favoriteRecipe () {
            if (_.includes(this.favorite_recipes, this.recipe_key)) {
                this.$store.commit('removeFavoriteRecipe', this.recipe_key)                
            } else {
                this.$store.commit('addFavoriteRecipe', this.recipe_key)
            }
        },
    },
    data: () => ({
        share_recipe_modal: false
    })
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/_colors';
</style>
