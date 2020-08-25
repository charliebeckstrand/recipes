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
                    <!-- <div v-if="recipe.thumbnail" class="d-lg-flex d-none mr-3">
                        <img :src="recipe.thumbnail" class="border p-1 rounded" width="100" />
                    </div> -->
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
                                        class="badge bg-secondary text-white text-nowrap"
                                        :class="{'ml-1': recipe.time && recipe.time.total}"
                                    >
                                        <font-awesome-icon
                                            :icon="['fad', 'users']"
                                            fixed-width
                                        /> {{recipe.servings}} servings
                                    </div>
                                    <div v-if="recipe.tags && recipe.tags.length">
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
                                            <!-- <Tag
                                                v-for="(tag, tagIndex) in recipe.tags"
                                                :key="tagIndex"
                                                :tag="tag"
                                                class="mr-1"
                                            /> -->
                                        </tippy>
                                    </div>
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
                                :class="{'ml-auto': recipe.time || recipe.servings || recipe.tags && recipe.tags.length}"
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

                <div v-if="recipe.images && recipe.images.length" class="images">
                    <hr>

                    <div class="d-flex align-items-center">
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
                </div>

                <hr>

                <!-- <hr :class="{
                    'd-block': recipe.images && recipe.images.length || recipe.thumbnail,
                    'd-lg-none': !recipe.images || recipe.images && !recipe.images.length,
                    'd-none': (!recipe.images || recipe.images && !recipe.images.length) && !recipe.thumbnail
                }"> -->

                <div>
                    <div class="row">
                        <div class="col-lg-6 mt-1">
                            <div>
                                <h3
                                    class="mb-3 font-weight-bold text-success"
                                >
                                    <!-- <font-awesome-icon :icon="['fad', 'salad']" fixed-width /> -->
                                    <!-- <font-awesome-icon :icon="['fad', 'utensil-spoon']" fixed-width /> -->
                                    <font-awesome-icon :icon="['fad', 'utensils']" fixed-width />
                                    Ingredients
                                </h3>

                                <!-- <hr> -->

                                <div class="ingredients">
                                    <div class="list-group">
                                        <div
                                            v-for="(ingredient, ingredientIndex) in recipe.ingredients"
                                            :key="ingredientIndex"
                                            class="list-group-item h6 mb-0 p-0 ingredient"
                                            :class="{'checked': ingredient.checked}"
                                        >
                                            <div class="d-flex align-items-center">
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
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6 mt-lg-1 mt-4">
                            <div>
                                <h3 class="mb-3 font-weight-bold text-primary">
                                    <font-awesome-icon :icon="['fad', 'list-alt']" fixed-width /> Instructions
                                </h3>

                                <!-- <hr> -->

                                <div class="instructions">
                                    <div
                                        v-for="(instruction, instructionIndex) in recipe.instructions"
                                        :key="instructionIndex"
                                        class="instruction rounded"
                                        :class="{
                                            'checked': instruction.checked,
                                            'checkable': instructionCheckable(instruction, instructionIndex),
                                            'mt-2': instructionIndex > 0
                                        }"
                                    >
                                        <div v-if="instruction.instruction" class="d-flex align-items-center">
                                            <div class="ml-3">
                                                <span class="font-weight-bolder">{{instructionIndex + 1}}.</span>
                                            </div>
                                            <div class="d-flex align-items-center flex-grow-1">
                                                <div
                                                    class="font-weight-light instruction-text py-2 px-3 flex-grow-1"
                                                    @click.prevent="toggleItemCheck(instruction, instructionIndex)"
                                                >
                                                    {{instruction.instruction}}
                                                </div>
                                                <div class="ml-auto px-3">
                                                    <div class="form-check m-0">
                                                        <input
                                                            v-if="instructionCheckable(instruction, instructionIndex)"
                                                            type="checkbox"
                                                            v-model="instruction.checked"
                                                            class="form-check-input"
                                                            @change="uncheckPreviousInstructions(instruction, instructionIndex)"
                                                        >
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="recipe.tips && recipe.tips.length" class="col-lg-6 mt-4">
                            <div class="tips">
                                <h3 class="mb-3 font-weight-bold text-warning">
                                    <font-awesome-icon :icon="['fad', 'lightbulb']" fixed-width /> Tips
                                </h3>

                                <div class="pl-3 border-left border-warning">
                                    <div
                                        v-for="(tip, tipIndex) in recipe.tips"
                                        :key="tipIndex"
                                        class="h5 m-0"
                                        :class="{'mt-2': tipIndex > 0}"
                                    >
                                        <div class="d-flex align-items-center">
                                            <div class="mr-2">
                                                <span v-if="tip.tip" class="font-weight-bolder text-muted">{{tipIndex + 1}}.</span>
                                            </div>
                                            <div class="font-weight-light p-1">
                                                {{tip.tip}}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="recipe.nutrition && recipe.nutrition.length" class="col-lg-6 mt-4">
                            <div class="tips">
                                <h3 class="mb-3 font-weight-bold text-info">
                                    <font-awesome-icon :icon="['fad', 'salad']" fixed-width /> Nutrition
                                </h3>

                                <div class="pl-3 border-left border-info">
                                    <div
                                        v-for="(item, nutritionIndex) in recipe.nutrition"
                                        :key="nutritionIndex"
                                        class="h5"
                                        :class="{'mt-2': nutritionIndex > 0}"
                                    >
                                        <!-- <div class="d-flex align-items-center">
                                            <div class="mr-2">
                                                <span v-if="item.tip" class="font-weight-bolder text-muted">{{tipIndex + 1}}.</span>
                                            </div>
                                            <div class="font-weight-light p-1">
                                                {{tip.tip}}
                                            </div>
                                        </div> -->
                                        <span class="font-weight-bold">{{item.fact}}</span> <span class="text-info">&bull;</span> {{item.amount}} {{item.measurement}}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="recipe.notes && recipe.notes.length" class="col-lg-6 mt-4">
                            <div class="tips">
                                <h3 class="mb-3 font-weight-bold text-danger">
                                    <font-awesome-icon :icon="['fad', 'pencil']" fixed-width /> Notes
                                </h3>

                                <div class="pl-3 border-left border-danger">
                                    <div
                                        v-for="(note, noteIndex) in recipe.notes"
                                        :key="noteIndex"
                                        class="h5"
                                        :class="{'mt-2': noteIndex > 0}"
                                    >
                                        <!-- <div class="d-flex align-items-center">
                                            <div class="mr-2">
                                                <span v-if="item.tip" class="font-weight-bolder text-muted">{{tipIndex + 1}}.</span>
                                            </div>
                                            <div class="font-weight-light p-1">
                                                {{tip.tip}}
                                            </div>
                                        </div> -->
                                        {{note}}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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

import _ from 'lodash'
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
        toggleItemCheck (item, index) {
            this.uncheckPreviousInstructions(item, index)

            if (
                index &&
                !this.instructionCheckable(item, index)
            ) {
                return false
            }

            if (item.checked) {
                this.$set(item, 'checked', false)
            } else {
                this.$set(item, 'checked', true)
            }
        },
        uncheckPreviousInstructions (instruction, index) {
            _.forEach(this.recipe.instructions, (instruction, instructionIndex) => {
                if (instructionIndex > index) {
                    this.$set(instruction, 'checked', false)
                }
            })
        },
        instructionCheckable (instruction, index) {
            let checkable = false

            if (
                index == 0 ||
                !index == 0 && this.recipe.instructions[index - 1].checked
            ) {
                checkable = true
            }

            return checkable
        },
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

.filter-button {
    border: 1px solid #ced4da;
}
.images {
    max-width: 100%;
    overflow-x: scroll;
    white-space: nowrap;
}
.ingredients {
    padding-left: 1rem;
    border-left: 1px solid $success;

    .ingredient {
        .form-check-input {
            &:checked {
                background-color: $success;
                border-color: darken($success, 5%);
            }
        }
        .ingredient-text {
            cursor: pointer;
            user-select: none;
        }
        &:nth-child(even) {
            // background-color: rgba(0, 0, 0, .05);
            // background-color: lighten($warning, 45%);
            background-color: lighten($success, 48%);
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
    border-left: 1px solid $primary;

    .instruction {
        &.checkable {
            .instruction-text {
                cursor: pointer;
                user-select: none;
            }
        }
        &:nth-child(odd) {
            // background-color: rgba(0, 0, 0, .05);
            background-color: lighten($primary, 48%);
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
</style>
