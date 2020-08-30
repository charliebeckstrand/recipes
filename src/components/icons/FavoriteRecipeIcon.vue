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
    data: () => ({
        share_recipe_modal: false
    }),
    components: {

    },
    computed: {
        ...mapState({
            favorite_recipes: state => state.user.favorite_recipes
        }),
        favorited () {
            return this.favorite_recipes.includes(this.recipe_id)
        }
    },
    props: {
        recipe_id: String
    },
    methods: {
        favoriteRecipe () {
            if (_.includes(this.favorite_recipes, this.recipe_id)) {
                this.$swal({
                    // icon: 'warning',
                    imageUrl: 'https://image.flaticon.com/icons/svg/2731/2731705.svg',
                    imageHeight: 100,
                    icon: 'broken-heart',
                    html: 'Are you sure you want to unfavorite this recipe?',
                    showCancelButton: true,
                    confirmButtonText: 'Unfavorite',
                    confirmButtonColor: '#F06292',
                    cancelButtonText: 'Cancel',
                    cancelButtonColor: '#f8f9fa',
                    reverseButtons: true
                }).then((result) => {
                    if (result.value) {
                        this.$store.commit('removeFavoriteRecipe', this.recipe_id)
                    }
                })
            } else {
                this.$store.commit('addFavoriteRecipe', this.recipe_id)
            }
        },
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/_colors';
</style>
