<template>
    <div class="recipe">
        <div v-if="loading">
            <font-awesome-icon :icon="['fal', 'spinner-third']" size="2x" spin fixed-width />
        </div>

        <div :class="{'invisible': loading}">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb mb-1">
                    <li class="breadcrumb-item">
                        <router-link :to="{name: 'Recipes'}">Recipes</router-link>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                        {{recipe.name}}
                    </li>
                </ol>
            </nav>

            <div
                ref="recipename"
                v-sticky="{
                    zIndex: 11,
                    stickyTop: 0
                }"
                class="p-3 bg-white d-flex align-items-center recipe-name"
            >
                <div class="mr-3">
                    <h1 class="mb-0 font-weight-bold">
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
                                <a href="#" @click.prevent class="text-pink" content="Favorite" v-tippy>
                                    <font-awesome-icon :icon="['far', 'heart']" fixed-width />
                                </a>
                            </div>
                            <div class="ml-2">
                                <a
                                    href="#"
                                    content="Share"
                                    v-tippy
                                    class="text-info"
                                    @click.prevent
                                >
                                    <font-awesome-icon :icon="['fad', 'share-alt']" fixed-width />
                                </a>
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
                            @click.prevent="showImageModal(recipe.thumbnail)"
                            class="d-inline-block image border rounded p-1"
                            style="width: 100px; height: 100px; background-size: cover; background-position: center;"
                            :style="{
                                backgroundImage: recipe.thumbnail ? 'url(' + recipe.thumbnail + ')' : ''
                            }"
                        />
                    </div>
                    <div v-if="recipe.images && recipe.images.length" class="flex-grow-1 images">
                        <div
                            v-for="(image, imageIndex) in recipe.images"
                            :key="imageIndex"
                            class="d-inline-block"
                            :class="{'ml-1': imageIndex > 0}"
                        >
                            <!-- <a
                                href="#"
                                @click.prevent="showImageModal(image.image)"
                            >
                                <img :src="image.image" class="border p-1 rounded" width="100" height="100" />
                            </a> -->
                            <a
                                href="#"
                                @click.prevent="showImageModal(image.image)"
                                class="d-inline-block image border rounded p-1"
                                style="width: 100px; height: 100px; background-size: cover; background-position: center;"
                                :style="{
                                    backgroundImage: image.image ? 'url(' + image.image + ')' : ''
                                }"
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
                    class="p-3 bg-white font-weight-bold text-success user-select-none section-title"
                >
                    <span
                        data-toggle="collapse"
                        href="#ingredientsCollapse"
                        class="toggle-icon"
                    >
                        <span class="closed">
                            <font-awesome-icon :icon="['fas', 'caret-right']" fixed-width />
                        </span>
                        <span class="open">
                            <font-awesome-icon :icon="['fas', 'caret-down']" fixed-width />
                        </span>
                    </span>
                    Ingredients
                    <!-- <a
                        href="#"
                        v-scroll-to="{
                            el: '#ingredients',
                            offset: - recipe_name_height
                        }"
                        class="text-success"
                    >
                        Ingredients
                    </a> -->
                </h3>

                <div class="collapse show" id="ingredientsCollapse">
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
                </div>
            </section>

            <section id="instructions" ref="instructions">
                <h3
                    v-sticky="{
                        zIndex: 10,
                        stickyTop: recipe_name_height
                    }"
                    class="p-3 bg-white font-weight-bold text-primary user-select-none section-title"
                >
                    <span
                        data-toggle="collapse"
                        href="#instructionsCollapse"
                        class="toggle-icon"
                    >
                        <span class="closed">
                            <font-awesome-icon :icon="['fas', 'caret-right']" fixed-width />
                        </span>
                        <span class="open">
                            <font-awesome-icon :icon="['fas', 'caret-down']" fixed-width />
                        </span>
                    </span>
                    <!-- <a
                        href="#"
                        v-scroll-to="{
                            el: '#instructions',
                            offset: - recipe_name_height
                        }"
                        class="text-primary"
                    >
                        Instructions
                    </a> -->
                    Instructions
                </h3>

                <div class="collapse show" id="instructionsCollapse">
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
                </div>
            </section>

            <section v-if="recipe.tips && recipe.tips.length" id="tips" ref="tips">
                <h3
                    v-sticky="{
                        zIndex: 10,
                        stickyTop: recipe_name_height
                    }"
                    class="p-3 bg-white font-weight-bold text-warning user-select-none section-title"
                >
                    <span
                        data-toggle="collapse"
                        href="#tipsCollapse"
                        class="toggle-icon"
                    >
                        <span class="closed">
                            <font-awesome-icon :icon="['fas', 'caret-right']" fixed-width />
                        </span>
                        <span class="open">
                            <font-awesome-icon :icon="['fas', 'caret-down']" fixed-width />
                        </span>
                    </span>
                    <!-- <a
                        href="#"
                        v-scroll-to="{
                            el: '#tips',
                            offset: - recipe_name_height
                        }"
                        class="text-warning"
                    >
                        Tips
                    </a> -->
                    Tips
                </h3>

                <div class="collapse show" id="tipsCollapse">
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
                </div>
            </section>

            <section v-if="recipe.nutrition && recipe.nutrition.length" id="nutrition" ref="nutrition">
                <h3
                    v-sticky="{
                        zIndex: 10,
                        stickyTop: recipe_name_height
                    }"
                    class="p-3 bg-white font-weight-bold text-info user-select-none section-title"
                >
                    <span
                        data-toggle="collapse"
                        href="#nutritionCollapse"
                        class="toggle-icon"
                    >
                        <span class="closed">
                            <font-awesome-icon :icon="['fas', 'caret-right']" fixed-width />
                        </span>
                        <span class="open">
                            <font-awesome-icon :icon="['fas', 'caret-down']" fixed-width />
                        </span>
                    </span>
                    <!-- <a
                        href="#"
                        v-scroll-to="{
                            el: '#nutrition',
                            offset: - recipe_name_height
                        }"
                        class="text-info"
                    >
                        Nutrition
                    </a> -->
                    Nutrition
                </h3>

                <div class="collapse show" id="nutritionCollapse">
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
                </div>
            </section>

            <section v-if="recipe.notes && recipe.notes.length" id="notes" ref="notes">
                <h3
                    v-sticky="{
                        zIndex: 10,
                        stickyTop: recipe_name_height
                    }"
                    class="p-3 bg-white font-weight-bold text-danger user-select-none section-title"
                >
                    <span
                        data-toggle="collapse"
                        href="#notesCollapse"
                        class="toggle-icon"
                    >
                        <span class="closed">
                            <font-awesome-icon :icon="['fas', 'caret-right']" fixed-width />
                        </span>
                        <span class="open">
                            <font-awesome-icon :icon="['fas', 'caret-down']" fixed-width />
                        </span>
                    </span>
                    <!-- <a
                        href="#"
                        v-scroll-to="{
                            el: '#notes',
                            offset: - recipe_name_height
                        }"
                        class="text-danger"
                    >
                        Notes
                    </a> -->
                    Notes
                </h3>

                <div class="collapse show" id="notesCollapse">
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
                </div>
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
/* eslint-disable no-unused-vars */
import { Tooltip, Dropdown, Modal } from 'bootstrap'
/* eslint-enable no-unused-vars */

import VueSticky from 'vue-sticky'

import firebase from 'firebase/app'
import 'firebase/firestore'

import ImageModal from '@/components/modals/ImageModal'

// import Tag from '@/components/Tag'

export default {
    name: 'Recipe',
    components: {
        // Tag
        ImageModal
    },
    computed: {

    },
    directives: {
        'sticky': VueSticky,
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
        recipe_name_height: null,
        image: null,

        loading: false,
        image_modal: false
    }),
    firestore () {
        return {
            recipe: {
                ref: firebase.firestore().collection('recipes').doc(this.recipe_key),
                resolve: (response) => {
                    if (response) {
                        this.loading = false

                        this.setRecipeNameHeight()
                    }
                },
                reject: (error) => {
                    this.loading = false

                    if (error) {
                        console.log(error)
                    }
                }
            }
        }
    },
    mounted () {
        this.loading = true

        window.addEventListener('resize', this.setRecipeNameHeight)
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/_colors';
@import '@/assets/css/_variables';

.recipe-name {
    margin-left: -1rem;
    margin-right: -1rem;
}

.section-title {
    margin-left: -1rem;
    margin-right: -1rem;

    .toggle-icon {
        cursor: pointer;

        .closed {
            display: none;
        }
        .open {
            display: inline-block;
        }
        &.collapsed {
            .closed {
                display: inline-block;
            }
            .open {
                display: none;
            }
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
