<template>
    <div class="print-recipe-icon">
        <a
            href="#"
            class="text-dark"
            title="Print"
            @click.prevent="printRecipe"
        >
            <font-awesome-icon :icon="['fad', 'print']" fixed-width />
        </a>

        <print-recipe-modal
            v-model="print_recipe_modal"
            :recipe="recipe"
            @hide="print_recipe_modal = false"
        />
    </div>
</template>

<script>
import PrintRecipeModal from '@/components/modals/PrintRecipeModal'

export default {
    name: 'PrintRecipeIcon',
    components: {
        PrintRecipeModal
    },
    computed: {

    },
    props: {
        recipe: Object
    },
    methods: {
        printRecipe () {
            // this.print_recipe_modal = true
            window.print()
        }
    },
    data: () => ({
        print_recipe_modal: false
    })
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/_colors';
</style>
