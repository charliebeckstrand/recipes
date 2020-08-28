<template>
    <div class="ingredients">
        <h3
            v-sticky="{
                zIndex: 10,
                stickyTop: recipe_name_height
            }"
            class="py-3 bg-white font-weight-bold text-success user-select-none section-title"
            v-b-toggle.ingredientsCollapse
            tabindex="-1"
        >
            <font-awesome-icon :icon="['fas', 'caret-right']" class="closed" fixed-width />
            <font-awesome-icon :icon="['fas', 'caret-down']" class="open" fixed-width />
            Ingredients
        </h3>

        <b-collapse id="ingredientsCollapse" visible>
            <div class="items ingredients">
                <div
                    v-for="(ingredient, ingredientIndex) in recipe.ingredients"
                    :key="ingredientIndex"
                    class="ingredient rounded"
                    :class="{
                        'checked': ingredient.checked
                    }"
                >
                    <div v-if="ingredient.ingredient" class="d-flex align-items-center">
                        <!-- <div class="ml-3">
                            <span class="font-weight-bolder">{{ingredientIndex + 1}}.</span>
                        </div> -->
                        <div class="d-flex align-items-center flex-grow-1">
                            <div
                                class="d-flex align-items-center font-weight-light py-2 px-3 flex-grow-1 text ingredient-text"
                                @click.prevent="toggleItemCheck(ingredient)"
                            >
                                <div class="text-nowrap">
                                    <span>{{ingredient.amount}} {{ingredient.measurement}}</span>
                                </div>
                                <!-- <div class="mx-2 text-info">&bullet;</div> -->
                                <div class="font-weight-bold ml-2">
                                    {{ingredient.ingredient}}
                                </div>
                            </div>
                            <div class="ml-auto px-3">
                                <div class="form-check m-0">
                                    <input
                                        type="checkbox"
                                        v-model="ingredient.checked"
                                        class="form-check-input"
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- <div class="d-flex align-items-center">
                        <div
                            class="d-flex align-items-center flex-grow-1 p-3 ingredient-text"
                            @click.prevent="toggleItemCheck(ingredient)"
                        >
                            <div class="text-nowrap">
                                <span>{{ingredient.amount}} {{ingredient.measurement}}</span>
                            </div>
                            <div class="mx-2 text-info">&bullet;</div>
                            <div class="font-weight-bold">
                                {{ingredient.ingredient}}
                            </div>
                        </div>

                        <div class="ml-auto">
                            <div class="form-check m-0 pr-3">
                                <input class="form-check-input" type="checkbox" v-model="ingredient.checked">
                            </div>
                        </div>
                    </div> -->
                </div>
            </div>
        </b-collapse>
    </div>
</template>

<script>
export default {
    name: 'Ingredients',
    data: () => ({

    }),
    components: {

    },
    computed: {

    },
    props: {
        recipe: Object,
        recipe_name_height: Number
    },
    methods: {

    },
    created () {

    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/_colors';
.ingredient {
    &.ingredient {
        margin-top: .5rem;
    }
}
</style>
