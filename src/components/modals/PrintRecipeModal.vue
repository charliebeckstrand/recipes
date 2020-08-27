<template>
    <div>
        <b-modal
            :visible="value"
            no-fade
            hide-header
            hide-footer
            content-class="border-0"
            dialog-class="modal-lg"
            @shown="shown"
            @hidden="hidden"
            @hide="hide"
            @cancel="hide"
            @close="hide"
        >
            <div class="container">
                <a
                    href="#"
                    class="modal-close"
                    aria-label="Close"
                    @click.prevent="hide"
                >
                    <font-awesome-layers>
                        <font-awesome-icon icon="circle" class="background" transform="shrink-1" />
                        <font-awesome-icon :icon="['fas', 'times-circle']" class="foreground" />
                    </font-awesome-layers>
                </a>

                <img
                    v-if="recipe.thumbnail"
                    :src="recipe.thumbnail"
                    class="img-thumbnail"
                    width="150"
                    height="150"
                >

                <h1 class="my-3 font-weight-bold">{{recipe.name}}</h1>

                <p class="lead">{{recipe.description}}</p>

                <div class="row my-3">
                    <div class="col">
                        <h3 class="font-weight-bold">Ingredients</h3>
                        <ul class="pl-3 m-0">
                            <li
                                v-for="(ingredient, ingredientIndex) in recipe.ingredients"
                                :key="ingredientIndex"
                                :class="{'mt-1': ingredientIndex > 0}"
                            >
                                <span class="font-weight-light">{{ingredient.amount}} {{ingredient.measurement}}</span> <span class="font-weight-bold">{{ingredient.ingredient}}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="col">
                        <h3 class="font-weight-bold">Instructions</h3>
                        <ol class="pl-3 m-0">
                            <li
                                v-for="(instruction, instructionIndex) in recipe.instructions"
                                :key="instructionIndex"
                                :class="{'mt-1': instructionIndex > 0}"
                            >
                                <span class="font-weight-light">{{instruction.instruction}}</span>
                            </li>
                        </ol>
                    </div>
                </div>
            </div>
        </b-modal>
    </div>
</template>

<script>
export default {
    name: 'PrintRecipeModal',
    components: {

    },
    props: {
        value: Boolean,
        recipe: Object
    },
    computed: {

    },
    methods: {
        // modal event methods
        shown () {
            // window.print()
        },
        hide () {
            this.$emit('hide')
        },
        hidden () {
            this.ingredient = {}

            this.validating = false

            this.$emit('hide')
        }
    },
    data: () => ({

    }),
    mounted () {

    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/_colors';
</style>
