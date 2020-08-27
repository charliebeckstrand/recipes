<template>
    <div class="share-recipe-icon">
        <a
            href="#"
            class="text-info"
            title="Share"
            @click.prevent="shareRecipe"
        >
            <font-awesome-icon :icon="['fad', 'share']" fixed-width />
        </a>

        <share-recipe-modal
            v-model="share_recipe_modal"
            :permalink="permalink"
            @hide="share_recipe_modal = false"
        />
    </div>
</template>

<script>
import ShareRecipeModal from '@/components/modals/ShareRecipeModal'

export default {
    name: 'ShareRecipeIcon',
    components: {
        ShareRecipeModal
    },
    computed: {
        permalink () {
            let permalink = null

            if (
                this.recipe_id &&
                this.recipe_name &&
                process.env.VUE_APP_API_URL
            ) {
                permalink = process.env.VUE_APP_API_URL + '/recipes/' + this.recipe_id + '/' + this.recipe_name
            }

            return permalink
        }
    },
    props: {
        recipe_name: String,
        recipe_id: String
    },
    methods: {
        shareRecipe () {
            this.share_recipe_modal = true
        }
    },
    data: () => ({
        share_recipe_modal: false
    })
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/_colors';
</style>
