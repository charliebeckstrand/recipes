<template>
    <div class="recipe">
        <div v-if="loading">
            <div class="container my-3">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="container mt-3 mb-4">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item">
                            <router-link :to="{path: '/'}">Recipes</router-link>
                        </li>
                        <li class="breadcrumb-item active" aria-current="page">
                            {{recipe.name}}
                        </li>
                    </ol>
                </nav>

                <div class="d-flex align-items-center">
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center">
                            <div class="mr-3">
                                <h1 class="mb-0 font-weight-bold">
                                    {{recipe.name}}
                                </h1>
                            </div>
                        </div>
                        <div v-if="recipe.description" class="d-flex align-items-center mt-2">
                            <div class="text-muted mr-5">
                                <div class="font-weight-light">{{recipe.description}}</div>
                            </div>
                        </div>
                        <div class="d-flex align-items-center mt-3">
                            <div v-if="recipe.time || recipe.servings || recipe.tags && recipe.tags.length">
                                <div class="d-flex align-items-center">
                                    <!-- <div v-if="recipe.tags && recipe.tags.length">
                                        <tippy arrow="false">
                                            <template v-slot:trigger>
                                                <div
                                                    class="d-flex badge border border-secondary text-secondary ml-1"
                                                >
                                                    Tags ({{recipe.tags.length}})
                                                </div>
                                            </template>
                                            <div
                                                v-for="(tag, tagIndex) in recipe.tags"
                                                :key="tagIndex"
                                                class="d-block badge border text-white"
                                                :class="{'mt-1': tagIndex > 0}"
                                            >
                                                {{tag.tag}}
                                            </div>
                                        </tippy>
                                    </div> -->
                                </div>
                                <!-- <div v-if="recipe.tags && recipe.tags.length > 3">
                                    <tippy arrow>
                                        <template v-slot:trigger>
                                            <div
                                                class="badge border border-secondary text-secondary"
                                            >
                                                Tags ({{recipe.tags.length}})
                                            </div>
                                        </template>
                                        <div
                                            v-for="(tag, tagIndex) in recipe.tags"
                                            :key="tagIndex"
                                            class="d-block badge border text-white"
                                            :class="{'mt-1': tagIndex > 0}"
                                        >
                                            {{tag.tag}}
                                        </div>
                                    </tippy>
                                </div>
                                <div
                                    v-if="recipe.tags && recipe.tags.length <= 3"
                                    class="d-flex flex-nowrap mt-1"
                                >
                                    <Tag
                                        v-for="(tag, tagIndex) in recipe.tags"
                                        :key="tagIndex"
                                        :tag="tag"
                                        class="mr-1"
                                    />
                                </div> -->
                            </div>
                            <div
                                class="d-flex align-items-center"
                            >
                                <div>
                                    <a href="#" @click.prevent class="text-danger" content="Favorite" v-tippy>
                                        <font-awesome-icon :icon="['far', 'heart']" fixed-width />
                                    </a>
                                </div>
                                <div class="ml-3">
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
                        </div>
                    </div>
                </div>

                <div>
                    <hr>

                    <div class="d-flex align-items-center">
                        <div v-if="recipe.images && recipe.images.length" class="flex-grow-1 images mr-3">
                            <div
                                v-for="(image, imageIndex) in recipe.images"
                                :key="imageIndex"
                                class="d-inline-block"
                                :class="{'ml-1': imageIndex > 0}"
                            >
                                <a href="#" data-toggle="modal" data-target="#imageModal" @click.prevent="setActiveImage(image.image)">
                                    <img :src="image.image" class="border p-1 rounded" width="75" />
                                </a>
                            </div>
                        </div>
                        <div class="d-flex flex-column ml-auto">
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
                                    :icon="['fad', 'users']"
                                    fixed-width
                                /> {{recipe.servings}} servings
                            </div>
                        </div>
                    </div>
                </div>

                <hr class="mb-0">

                <section ref="ingredients">
                    <h3
                        v-sticky="{ zIndex: 10, stickyTop: 0 }"
                        data-toggle="collapse"
                        href="#ingredientsCollapse"
                        class="p-3 bg-white font-weight-bold text-success user-select-none section-title"
                    >
                        <span class="closed">
                            <font-awesome-icon :icon="['fad', 'plus']" fixed-width />
                        </span>
                        <span class="open">
                            <font-awesome-icon :icon="['fad', 'minus']" fixed-width />
                        </span>
                        Ingredients
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
                                    <div class="ml-3">
                                        <span class="font-weight-bolder">{{ingredientIndex + 1}}.</span>
                                    </div>
                                    <div class="d-flex align-items-center flex-grow-1">
                                        <div
                                            class="d-flex align-items-center font-weight-light py-2 px-3 flex-grow-1 ingredient-text"
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

                <section ref="instructions">
                    <h3
                        v-sticky="{ zIndex: 10, stickyTop: 0 }"
                        data-toggle="collapse"
                        href="#instructionsCollapse"
                        class="p-3 bg-white font-weight-bold text-primary user-select-none section-title"
                    >
                        <span class="closed">
                            <font-awesome-icon :icon="['fad', 'plus']" fixed-width />
                        </span>
                        <span class="open">
                            <font-awesome-icon :icon="['fad', 'minus']" fixed-width />
                        </span>
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

                <section v-if="recipe.tips && recipe.tips.length" ref="tips">
                    <h3
                        v-sticky="{ zIndex: 10, stickyTop: 0 }"
                        data-toggle="collapse"
                        href="#tipsCollapse"
                        class="p-3 bg-white font-weight-bold text-warning user-select-none section-title"
                    >
                        <span class="closed">
                            <font-awesome-icon :icon="['fad', 'plus']" fixed-width />
                        </span>
                        <span class="open">
                            <font-awesome-icon :icon="['fad', 'minus']" fixed-width />
                        </span>
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

                <section v-if="recipe.nutrition && recipe.nutrition.length" ref="nutrition">
                    <h3
                        v-sticky="{ zIndex: 10, stickyTop: 0 }"
                        data-toggle="collapse"
                        href="#nutritionCollapse"
                        class="p-3 bg-white font-weight-bold text-info user-select-none section-title"
                    >
                        <span class="closed">
                            <font-awesome-icon :icon="['fad', 'plus']" fixed-width />
                        </span>
                        <span class="open">
                            <font-awesome-icon :icon="['fad', 'minus']" fixed-width />
                        </span>
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
                                            class="font-weight-light py-2 px-3 flex-grow-1 nutrition-text"
                                        >
                                            {{item.fact}} {{item.item}} <span class="text-info">&bull;</span> {{item.amount}} {{item.measurement}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section v-if="recipe.notes && recipe.notes.length" ref="notes">
                    <h3
                        v-sticky="{ zIndex: 10, stickyTop: 0 }"
                        data-toggle="collapse"
                        href="#notesCollapse"
                        class="p-3 bg-white font-weight-bold text-danger user-select-none section-title"
                    >
                        <span class="closed">
                            <font-awesome-icon :icon="['fad', 'plus']" fixed-width />
                        </span>
                        <span class="open">
                            <font-awesome-icon :icon="['fad', 'minus']" fixed-width />
                        </span>
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
        </div>

        <!-- Image Modal -->
        <div class="modal fade" id="imageModal" tabindex="-1" aria-labelledby="imageModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-body">
                        <a href="#" class="modal-close" data-dismiss="modal" aria-label="Close">
                            <!-- <font-awesome-icon :icon="['fas', 'times-circle']" /> -->
                            <font-awesome-layers>
                                <font-awesome-icon icon="circle" class="background" />
                                <font-awesome-icon :icon="['fas', 'times-circle']" class="foreground" transform="shrink-1" />
                            </font-awesome-layers>
                        </a>
                        <div class="mb-3">
                            <img :src="active_image" class="border rounded p-1" width="100%">
                        </div>

                        <a
                            href="#"
                            v-for="(image, imageIndex) in recipe.images"
                            :key="imageIndex"
                            :class="{
                                'ml-1': imageIndex > 0
                            }"
                            @click.prevent="setActiveImage(image.image)"
                        >
                            <img
                                :src="image.image"
                                class="border rounded p-1"
                                :class="{
                                    'border-primary': imageActive(image)
                                }"
                                width="100"
                            >
                        </a>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { Tooltip, Dropdown, Modal } from 'bootstrap'
/* eslint-enable no-unused-vars */

import VueSticky from 'vue-sticky'

import firebase from 'firebase/app'
import 'firebase/firestore'

// import Tag from '@/components/Tag'

export default {
    name: 'Recipe',
    components: {
        // Tag
    },
    computed: {

    },
    directives: {
        'sticky': VueSticky,
    },
    props: ['recipe_key', 'url'],
    methods: {
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
        setActiveImage (image) {
            this.active_image = image
        },
        imageActive (image) {
            if (image.image == this.active_image) {
                return true
            }
        }
    },
    data: () => ({
        active_image: null,
        loading: true
    }),
    firestore () {
        return {
            recipe: {
                ref: firebase.firestore().collection('recipes').doc(this.recipe_key),
                resolve: () => {
                    this.loading = false
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

    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/colors';
@import '@/assets/css/variables';

.section-title {
    cursor: pointer;

    margin-left: -1rem;
    margin-right: -1rem;

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

.modal {
    .modal-close {
        position: absolute;
        right: -1.125rem;
        top: -1.125rem;
        font-size: 2.25rem;
        line-height: 1;
        border-radius: 100%;
        border: 0;
        .background {
            color: $white;
        }
        .foreground {
            transition: $transition;
            color: $danger;
        }
        &:focus,
        &:hover {
            .foreground {
                color: darken($danger, 10%);
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
