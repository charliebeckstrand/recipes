<template>
    <div class="recipe page">
        <div v-if="loading" class="py-3">
            <Spinner size="2x" />
        </div>
        <div v-else>
            <div
                id="name"
                ref="recipename"
                v-sticky="{
                    zIndex: 11,
                    stickyTop: 0
                }"
                class="bg-white py-3 sticky-title"
            >
                <div class="d-flex align-items-center">
                    <div class="flex-grow-1 mr-3">
                        <h1 class="font-weight-bold mb-0">
                            {{recipe.name}}
                        </h1>
                    </div>
                    <div class="ml-auto">
                        <!-- THIS IS ONLY FOR PRINTING -->
                        <img
                            v-if="recipe.thumbnail"
                            :src="recipe.thumbnail"
                            class="d-none img-thumbnail print-thumbnail"
                        />
                    </div>
                </div>
            </div>

            <div
                v-if="recipe.description"
                id="description"
                class="d-flex align-items-center"
            >
                <div class="flex-grow-1">
                    <div class="text-muted">
                        <div
                            v-html="recipe.description"
                            class="v-html"
                        />
                    </div>
                    <div
                        class="d-flex align-items-center"
                        :class="{'mt-3': recipe.description}"
                    >
                        <div class="d-flex align-items-center icons">
                            <div>
                                <favorite-recipe-icon :recipe_id="recipe.id" />
                            </div>
                            <div class="ml-2">
                                <share-recipe-icon
                                    :recipe_id="recipe.id"
                                    :recipe_name="recipe_name"
                                />
                            </div>
                            <div class="ml-2">
                                <print-recipe-icon :recipe="recipe" />
                            </div>
                        </div>
                        <div class="ml-auto gravatar">

                        </div>
                    </div>
                </div>
            </div>

            <div
                v-if="recipe.thumbnail || recipe.images && recipe.images.length"
                id="images"
                class="mt-3 pt-3 border-top"
            >
                <div class="d-flex align-items-center recipe-images">
                    <div v-if="recipe.thumbnail">
                        <a
                            href="#"
                            class="d-block img-thumbnail image"
                            style="width: 100px; height: 100px; background-size: cover; background-position: center;"
                            :style="{
                                backgroundImage: recipe.thumbnail ? 'url(' + recipe.thumbnail + ')' : ''
                            }"
                            @click.prevent="showImageModal(recipe.thumbnail)"
                        />
                    </div>
                    <div v-if="recipe.images && recipe.images.length" class="ml-1">
                        <div class="d-flex align-items-center">
                            <div
                                v-for="(image, imageIndex) in recipe.images"
                                :key="imageIndex"
                                class="recipe-image"
                            >
                                <a
                                    href="#"
                                    class="d-block img-thumbnail image"
                                    style="width: 100px; height: 100px; background-size: cover; background-position: center;"
                                    :style="{
                                        backgroundImage: image.image ? 'url(' + image.image + ')' : ''
                                    }"
                                    @click.prevent="showImageModal(image.image)"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                id="content"
                class="mt-3 border-top"
            >
                <div v-if="recipe.content" class="my-3">
                    <div v-html="recipe.content"></div>
                </div>
                <div v-else>
                    <section
                        id="ingredients"
                        ref="ingredients"
                    >
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
                                    class="rounded ingredient"
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
                    </section>

                    <section
                        id="instructions"
                        ref="instructions"
                    >
                        <h3
                            v-sticky="{
                                zIndex: 10,
                                stickyTop: recipe_name_height
                            }"
                            class="py-3 bg-white font-weight-bold text-primary user-select-none section-title"
                            v-b-toggle.instructionsCollapse
                        >
                            <font-awesome-icon :icon="['fas', 'caret-right']" class="closed" fixed-width />
                            <font-awesome-icon :icon="['fas', 'caret-down']" class="open" fixed-width />
                            Instructions
                        </h3>

                        <b-collapse id="instructionsCollapse" visible>
                            <div v-if="recipe.instructions && recipe.instructions.length" class="items instructions">
                                <div
                                    v-for="(instruction, instructionIndex) in recipe.instructions"
                                    :key="instructionIndex"
                                    class="rounded instruction"
                                    :class="{
                                        'checked': instruction.checked
                                    }"
                                >
                                    <div v-if="instruction.instruction" class="d-flex align-items-center">
                                        <div class="ml-3 number instruction-number">
                                            <span class="font-weight-bolder">{{instructionIndex + 1}}.</span>
                                        </div>
                                        <div class="d-flex align-items-center flex-grow-1">
                                            <div
                                                v-html="instruction.instruction"
                                                class="font-weight-light py-2 px-3 flex-grow-1 text instruction-text v-html"
                                                @click.prevent="toggleItemCheck(instruction)"
                                            />
                                            <div class="ml-auto px-3">
                                                <div class="form-check m-0">
                                                    <input
                                                        type="checkbox"
                                                        v-model="instruction.checked"
                                                        class="form-check-input"
                                                    >
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                v-if="(!recipe.instructions || recipe.instructions && !recipe.instructions.length) && recipe.instructions_html"
                                v-html="recipe.instructions_html"
                                class="v-html"
                            />
                        </b-collapse>
                    </section>

                    <section
                        v-if="recipe.tips"
                        id="tips"
                        ref="tips"
                    >
                        <h3
                            v-sticky="{
                                zIndex: 10,
                                stickyTop: recipe_name_height
                            }"
                            class="py-3 bg-white font-weight-bold text-warning user-select-none section-title"
                            v-b-toggle.tipsCollapse
                        >
                            <font-awesome-icon :icon="['fas', 'caret-right']" class="closed" fixed-width />
                            <font-awesome-icon :icon="['fas', 'caret-down']" class="open" fixed-width />
                            Tips
                        </h3>

                        <b-collapse id="tipsCollapse" visible>
                            <div class="tips">
                                <div v-html="recipe.tips" class="v-html" />
                            </div>
                        </b-collapse>
                    </section>

                    <section
                        v-if="recipe.nutrition"
                        id="nutrition"
                        ref="nutrition"
                    >
                        <h3
                            v-sticky="{
                                zIndex: 10,
                                stickyTop: recipe_name_height
                            }"
                            class="py-3 bg-white font-weight-bold text-info user-select-none section-title"
                            v-b-toggle.nutritionCollapse
                        >
                            <font-awesome-icon :icon="['fas', 'caret-right']" class="closed" fixed-width />
                            <font-awesome-icon :icon="['fas', 'caret-down']" class="open" fixed-width />
                            Nutrition
                        </h3>

                        <b-collapse id="nutritionCollapse" visible>
                            <div class="nutrition">
                                <div v-html="recipe.nutrition" class="v-html" />
                            </div>
                        </b-collapse>
                    </section>

                    <section
                        v-if="recipe.notes"
                        id="notes"
                        ref="notes"
                    >
                        <h3
                            v-sticky="{
                                zIndex: 10,
                                stickyTop: recipe_name_height
                            }"
                            class="py-3 bg-white font-weight-bold text-danger user-select-none section-title"
                            v-b-toggle.notesCollapse
                        >
                            <font-awesome-icon :icon="['fas', 'caret-right']" class="closed" fixed-width />
                            <font-awesome-icon :icon="['fas', 'caret-down']" class="open" fixed-width />
                            Notes
                        </h3>

                        <b-collapse id="notesCollapse" visible>
                            <div class="notes">
                                <div v-html="recipe.notes" class="v-html" />
                            </div>
                        </b-collapse>
                    </section>
                </div>
            </div>
        </div>

        <image-modal
            v-model="image_modal"
            :image="image"
            :thumbnail="recipe.thumbnail"
            :images="recipe.images"
            @hide="image_modal = false"
        />
    </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'

import moment from 'moment'

import Spinner from '@/components/Spinner'

import FavoriteRecipeIcon from '@/components/icons/FavoriteRecipeIcon'
import ShareRecipeIcon from '@/components/icons/ShareRecipeIcon'
import PrintRecipeIcon from '@/components/icons/PrintRecipeIcon'

import ImageModal from '@/components/modals/ImageModal'

export default {
    name: 'Recipe',
    data: () => ({
        recipe: {},

        moment: moment,

        recipe_name_height: null,
        image: null,

        image_modal: false,

        loading: false
    }),
    components: {
        Spinner,

        FavoriteRecipeIcon,
        ShareRecipeIcon,
        PrintRecipeIcon,

        ImageModal
    },
    computed: {

    },
    props: {
        recipe_id: String,
        recipe_name: String
    },
    methods: {
        getRecipe () {
            this.loading = true

            // this.$binding(
            //     'recipes', firebase.firestore()
            //     .collection('recipes')
            //     .orderBy('created')
            // )
            // .then(recipes => {
            //     this.recipe = _.find(recipes, {id: this.recipe_id})
            //
            //     this.setRecipeNameHeight()
            //
            //      this.loading = false
            // })

            this.$binding(
                'recipes', firebase
                .firestore()
                .collection('recipes')
                .doc(this.recipe_id)
            )
            .then(recipe => {
                this.recipe = recipe

                this.setRecipeNameHeight()

                 this.loading = false
            })
        },
        showImageModal (image) {
            this.image = image
            this.image_modal = true
        },
        toggleItemCheck (item) {
            if (item.checked) {
                this.$set(item, 'checked', false)
            } else {
                this.$set(item, 'checked', true)
            }
        },
        setRecipeNameHeight () {
            if (
                this.$refs &&
                this.$refs.recipename
            ) {
                this.recipe_name_height =  this.$refs.recipename.offsetHeight
            }
        }
    },
    created () {
        this.getRecipe()

        window.addEventListener('resize', this.setRecipeNameHeight)
        window.addEventListener('scroll', this.setRecipeNameHeight)
    }
}
</script>

<style lang="scss">
@import '@/assets/css/_colors';

@media print {
    .navbar {
        display: none !important;
    }

    #images,
    #content {
        border-top: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
    }

    .print-thumbnail {
        display: block !important;
        max-width: 100px;
    }

    .gravatar {
        display: none !important;
    }

    .recipe-images {
        display: none !important;
    }

    .text-success,
    .text-primary,
    .text-warning,
    .text-info,
    .text-danger {
        color: #000000 !important;
    }

    .ingredients {
        .ingredient {
            &.checked {
                .ingredient-text {
                    color: #000000 !important;
                    opacity: 1 !important;
                    text-decoration: none !important;
                }
            }
        }
    }

    .instructions {
        .instruction {
            &.checked {
                .instruction-text {
                    color: #000000 !important;
                    opacity: 1 !important;
                    text-decoration: none !important;    
                }
            }
        }
    }

    section {
        padding-bottom: 1rem !important;

        .section-title {
            padding: 0 !important;
        }
        .collapse > div {
            border-left: 0 !important;
            padding-left: 0 !important;
        }
        .items {
            margin-top: 1rem !important;
            .number {
                margin-left: 0 !important;
                margin-right: 1rem !important;
            }
            .text {
                padding: 0 !important;
                margin: 0 !important;
            }
        }
    }

    .icons,
    .checkbox,
    .form-check,
    .open,
    .closed {
        display: none !important;
    }
}
</style>

<style lang="scss" scoped>
@import '@/assets/css/_colors';
@import '@/assets/css/_variables';

.section {
    & + .section {
        border-top: 1px solid #dee2e6;
    }
    .recipe-images {
        max-width: 100%;
        overflow-x: scroll;
        white-space: nowrap;
        .recipe-image {
            & + .recipe-image {
                margin-left: .25rem;
            }
        }
    }
}

.section-title {
    cursor: pointer;
    &.collapsed {
        .closed {
            display: inline-block;
        }
        .open {
            display: none;
        }
    }
    &.not-collapsed {
        .closed {
            display: none;
        }
        .open {
            display: inline-block;
        }
    }
}

.ingredients {
    padding-left: 1rem;
    border-left: 2px solid $success;

    .ingredient {
        & + .ingredient {
            margin-top: .5rem;
        }
        &:nth-child(even) {
            background-color: lighten(#e5f0d9, 7%);
        }
        &.checked {
            .ingredient-text {
                color: $muted;
                opacity: .25;
                text-decoration: line-through;
            }
        }
        .ingredient-text {
            cursor: pointer;
            user-select: none;
        }
        .form-check-input {
            &:checked {
                background-color: $success;
                border-color: darken($success, 5%);
            }
        }
    }
}

.instructions {
    padding-left: 1rem;
    border-left: 2px solid $primary;

    .instruction {
        & + .instruction {
            margin-top: .5rem;
        }
        &:nth-child(odd) {
            background-color: lighten(#cdeefd, 7%);
        }
        &.checked {
            .instruction-text {
                color: $muted;
                opacity: .25;
                text-decoration: line-through;
            }
        }
        .instruction-text {
            cursor: pointer;
            user-select: none;
        }
    }
}

.tips {
    padding-left: 1rem;
    border-left: 2px solid $warning;
}

.nutritions {
    padding-left: 1rem;
    border-left: 2px solid $info;

    .nutrition {
        &:nth-child(odd) {
            background-color: lighten(#d1f2eb, 7%);
        }
    }
}

.notes {
    padding-left: 1rem;
    border-left: 2px solid $danger;
}
</style>
