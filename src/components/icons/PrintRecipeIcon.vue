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
    </div>
</template>

<script>
export default {
    name: 'PrintRecipeIcon',
    data: () => ({

    }),
    components: {

    },
    props: {
        recipe: Object
    },
    computed: {

    },
    methods: {
        printRecipe () {
            window.print()
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/_colors';
</style>
