<template>
    <div class="recipe">
        <div v-if="loading">
            <font-awesome-icon
                :icon="['fal', 'spinner-third']"
                size="2x"
                spin
                fixed-width
            />
            <!-- <content-placeholders :rounded="true">
                <content-placeholders-heading :img="false" />
                <content-placeholders-text :lines="3" />
            </content-placeholders> -->
        </div>

        <div :class="{'invisible': loading}">
            <div
                ref="recipename"
                v-sticky="{
                    zIndex: 11,
                    stickyTop: 0
                }"
                class="d-flex align-items-center bg-white py-3 sticky-title"
            >
                <div class="mr-3">
                    <h1 class="font-weight-bold mb-0">
                        <!-- <a
                            v-if=""
                            href="#"
                        >
                            <font-awesome-icon :icon="['fad', 'arrow-left']" />
                        </a> -->
                        {{recipe.name}}
                    </h1>
                </div>
            </div>

            <div class="d-flex align-items-center">
                <div class="flex-grow-1">
                    <div v-if="recipe.description" class="d-flex align-items-center">
                        <div class="text-muted mr-5">
                            <div class="font-weight-light">{{recipe.description}}</div>
                        </div>
                    </div>
                    <div class="d-flex align-items-center mt-3">
                        <div class="d-flex align-items-center">
                            <div>
                                <favorite-recipe-icon :recipe_key="recipe['.key']" />
                            </div>
                            <div class="ml-2">
                                <share-recipe-icon
                                    :recipe_key="recipe['.key']"
                                    :parsed_name="url"
                                />
                            </div>
                        </div>
                        <!-- <div class="d-flex align-items-center ml-auto">
                            <div
                                v-if="recipe.time && recipe.time.total"
                                class="badge text-nowrap"
                                :class="{
                                    'bg-success': recipe.time.total <= 15,
                                    'bg-warning': recipe.time.total > 15 && recipe.time.total < 45,
                                    'bg-danger': recipe.time.total >= 45
                                }"
                                content="Cook Time"
                                v-tippy
                            >
                                <font-awesome-icon
                                    :icon="['fad', 'clock']"
                                    fixed-width
                                />
                                {{recipe.time.total}}
                                <span class="d-lg-inline-block d-none">minutes</span>
                            </div>
                            <div
                                v-if="recipe.servings"
                                class="badge bg-secondary text-white text-nowrap"
                                :class="{'ml-1': recipe.time}"
                                content="Servings"
                                v-tippy
                            >
                                <font-awesome-icon
                                    :icon="['fad', 'utensil-spoon']"
                                    fixed-width
                                />
                                {{recipe.servings}}
                                <span class="d-lg-inline-block d-none">servings</span>
                            </div>
                        </div> -->
                    </div>
                </div>
            </div>

            <div v-if="recipe.thumbnail || recipe.images && recipe.images.length">
                <hr>

                <div class="d-flex align-items-center">
                    <div v-if="recipe.thumbnail" class="mr-1">
                        <a
                            href="#"
                            class="d-inline-block img-thumbnail p-1"
                            style="width: 100px; height: 100px; background-size: cover; background-position: center;"
                            :style="{
                                backgroundImage: recipe.thumbnail ? 'url(' + recipe.thumbnail + ')' : ''
                            }"
                            @click.prevent="showImageModal(recipe.thumbnail)"
                        />
                    </div>
                    <div v-if="recipe.images && recipe.images.length" class="flex-grow-1 images">
                        <div
                            v-for="(image, imageIndex) in recipe.images"
                            :key="imageIndex"
                            class="d-inline-block"
                            :class="{'ml-1': imageIndex > 0}"
                        >
                            <a
                                href="#"
                                class="d-inline-block img-thumbnail"
                                style="width: 100px; height: 100px; background-size: cover; background-position: center;"
                                :style="{
                                    backgroundImage: image.image ? 'url(' + image.image + ')' : ''
                                }"
                                @click.prevent="showImageModal(image.image)"
                            />
                        </div>
                    </div>
                    <!-- <div class="d-flex flex-column ml-auto">
                        <div
                            v-if="recipe.time && recipe.time.total"
                            class="badge text-nowrap"
                            :class="{
                                'bg-success': recipe.time.total <= 15,
                                'bg-warning': recipe.time.total > 15 && recipe.time.total < 45,
                                'bg-danger': recipe.time.total >= 45
                            }"
                        >
                            <font-awesome-icon
                                :icon="['fad', 'clock']"
                                fixed-width
                            />
                            {{recipe.time.total}} minutes
                        </div>
                        <div
                            v-if="recipe.servings"
                            class="badge bg-secondary text-white text-nowrap mt-1"
                            :class="{
                                'ml-1': recipe.time && recipe.time.total
                            }"
                        >
                            <font-awesome-icon
                                :icon="['fad', 'utensil-spoon']"
                                fixed-width
                            /> {{recipe.servings}} servings
                        </div>
                    </div> -->
                </div>
            </div>

            <hr class="mb-0">

            <section id="ingredients" ref="ingredients">
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
                    <div class="ingredients">
                        <div
                            v-for="(ingredient, ingredientIndex) in recipe.ingredients"
                            :key="ingredientIndex"
                            class="ingredient rounded"
                            :class="{
                                'checked': ingredient.checked,
                                'mt-2': ingredientIndex > 0
                            }"
                        >
                            <div v-if="ingredient.ingredient" class="d-flex align-items-center">
                                <!-- <div class="ml-3">
                                    <span class="font-weight-bolder">{{ingredientIndex + 1}}.</span>
                                </div> -->
                                <div class="d-flex align-items-center flex-grow-1">
                                    <div
                                        class="d-flex align-items-center font-weight-light py-2 px-3 flex-grow-1 ingredient-text"
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

            <section id="instructions" ref="instructions">
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
                    <div class="instructions">
                        <div
                            v-for="(instruction, instructionIndex) in recipe.instructions"
                            :key="instructionIndex"
                            class="instruction rounded"
                            :class="{
                                'checked': instruction.checked,
                                'mt-2': instructionIndex > 0
                            }"
                        >
                            <div v-if="instruction.instruction" class="d-flex align-items-center">
                                <div class="ml-3">
                                    <span class="font-weight-bolder">{{instructionIndex + 1}}.</span>
                                </div>
                                <div class="d-flex align-items-center flex-grow-1">
                                    <div
                                        class="font-weight-light py-2 px-3 flex-grow-1 instruction-text"
                                        @click.prevent="toggleItemCheck(instruction)"
                                    >
                                        {{instruction.instruction}}
                                    </div>
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
                </b-collapse>
            </section>

            <section v-if="recipe.tips && recipe.tips.length" id="tips" ref="tips">
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
                        <div
                            v-for="(tip, tipIndex) in recipe.tips"
                            :key="tipIndex"
                            class="tip rounded"
                            :class="{'mt-2': tipIndex > 0}"
                        >
                            <div v-if="tip.tip" class="d-flex align-items-center">
                                <div class="ml-3">
                                    <span class="font-weight-bolder">{{tipIndex + 1}}.</span>
                                </div>
                                <div class="d-flex align-items-center flex-grow-1">
                                    <div
                                        class="font-weight-light py-2 px-3 flex-grow-1 tip-text"
                                    >
                                        {{tip.tip}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </b-collapse>
            </section>

            <section v-if="recipe.nutrition && recipe.nutrition.length" id="nutrition" ref="nutrition">
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
                    <div class="nutritions">
                        <div
                            v-for="(item, nutritionIndex) in recipe.nutrition"
                            :key="nutritionIndex"
                            class="nutrition rounded"
                            :class="{'mt-2': nutritionIndex > 0}"
                        >
                            <div v-if="item.fact || item.item" class="d-flex align-items-center">
                                <div class="ml-3">
                                    <span class="font-weight-bolder">{{nutritionIndex + 1}}.</span>
                                </div>
                                <div class="d-flex align-items-center flex-grow-1">
                                    <div
                                        class="d-flex align-items-center py-2 px-3 flex-grow-1 nutrition-text"
                                    >
                                        <div class="font-weight-light">{{item.fact}} {{item.item}}</div>
                                        <!-- <span class="text-info">&bull;</span>  -->
                                        <div class="font-weight-bold ml-2">{{item.amount}} {{item.measurement}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </b-collapse>
            </section>

            <section v-if="recipe.notes && recipe.notes.length" id="notes" ref="notes">
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
                        <div
                            v-for="(note, noteIndex) in recipe.notes"
                            :key="noteIndex"
                            class="note rounded"
                            :class="{'mt-2': noteIndex > 0}"
                        >
                            <!-- <div class="d-flex align-items-center">
                                <div class="mr-2">
                                    <span v-if="note.note" class="font-weight-bolder text-muted">{{noteIndex + 1}}.</span>
                                </div>
                                <div class="font-weight-light p-1">
                                    {{note.note}}
                                </div>
                            </div> -->
                            <div v-if="note.note" class="d-flex align-items-center">
                                <div class="ml-3">
                                    <span class="font-weight-bolder">{{noteIndex + 1}}.</span>
                                </div>
                                <div class="d-flex align-items-center flex-grow-1">
                                    <div
                                        class="font-weight-light py-2 px-3 flex-grow-1 note-text"
                                    >
                                        {{note.note}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </b-collapse>
            </section>
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

import FavoriteRecipeIcon from '@/components/FavoriteRecipeIcon'
import ShareRecipeIcon from '@/components/ShareRecipeIcon'
import ImageModal from '@/components/modals/ImageModal'

// import Tag from '@/components/Tag'

export default {
    name: 'Recipe',
    components: {
        // Tag
        FavoriteRecipeIcon,
        ShareRecipeIcon,
        ImageModal
    },
    computed: {

    },
    props: ['recipe_key', 'url'],
    methods: {
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
        // uncheckPreviousInstructions (instruction, index) {
        //     _.forEach(this.recipe.instructions, (instruction, instructionIndex) => {
        //         if (instructionIndex > index) {
        //             this.$set(instruction, 'checked', false)
        //         }
        //     })
        // },
        // instructionCheckable (instruction, index) {
        //     let checkable = false
        //
        //     if (
        //         index == 0 ||
        //         !index == 0 && this.recipe.instructions[index - 1].checked
        //     ) {
        //         checkable = true
        //     }
        //
        //     return checkable
        // },
        setRecipeNameHeight () {
            if (
                this.$refs &&
                this.$refs.recipename
            ) {
                this.recipe_name_height =  this.$refs.recipename.offsetHeight
            }
        }
    },
    data: () => ({
        recipe: {},

        recipe_name_height: null,
        image: null,

        image_modal: false,

        loading: false
    }),
    firestore () {
        return {
            // recipe: {
            //     ref: firebase.firestore().collection('recipes').doc(this.recipe_key),
            //     resolve: (response) => {
            //         if (response) {
            //             this.loading = false
            //
            //             this.setRecipeNameHeight()
            //         }
            //     },
            //     reject: (error) => {
            //         this.loading = false
            //
            //         if (error) {
            //             console.log(error)
            //         }
            //     }
            // }
        }
    },
    created () {
        this.loading = true

        this.$binding(
            'recipes', firebase.firestore()
            .collection('recipes')
            .doc(this.recipe_key)
        )
        .then(recipe => {
            if (recipe) {
                this.recipe = recipe
                this.setRecipeNameHeight()
            }

            this.loading = false

            this.$binding(
                'recipes', firebase.firestore()
                .collection('recipes')
                .orderBy('created.date')
            )
        })

        window.addEventListener('resize', this.setRecipeNameHeight)
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/_colors';
@import '@/assets/css/_variables';

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

.images {
    max-width: 100%;
    overflow-x: scroll;
    white-space: nowrap;
}

.ingredients {
    padding-left: 1rem;
    border-left: 2px solid $success;

    .ingredient {
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
    }
}

.instructions {
    padding-left: 1rem;
    border-left: 2px solid $primary;

    .instruction {
        .instruction-text {
            cursor: pointer;
            user-select: none;
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
    }
}

.tips {
    padding-left: 1rem;
    border-left: 2px solid $warning;

    .tip {
        &:nth-child(even) {
            background-color: lighten(#fcf3cf, 7%);
        }
    }
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

    .note {
        &:nth-child(even) {
            background-color: lighten(#fadbd8, 7%);
        }
    }
}
</style>
