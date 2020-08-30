<template>
    <div>
        <div class="card recipe">
            <div class="d-flex">
                <div class="flex-grow-1">
                    <div class="card-body">
                        <h5 class="card-title">
                            <router-link
                                :to="{
                                    name: 'Recipe',
                                    params: {
                                        recipe_id: recipe.id ? recipe.id : null,
                                        recipe_name: recipe_name
                                    }
                                }"
                                class="font-weight-bold"
                            >
                                {{recipe.name}}
                            </router-link>
                        </h5>

                        <!-- <p v-if="recipe.description" class="card-text text-muted my-3">
                            <v-clamp
                                autoresize
                                :max-lines="3"
                            >
                                {{recipe.description}}
                                <template #after="{ toggle, expanded, clamped }">
                                    <button
                                        v-if="expanded || clamped"
                                        class="btn btn-sm btn-link"
                                        @click="toggle"
                                    >
                                        <span v-if="expanded">hide</span>
                                        <span v-if="clamped">show</span>
                                    </button>
                                </template>
                            </v-clamp>
                        </p> -->

                        <div
                            v-html="recipe.description"
                            v-line-clamp="3"
                            class="card-text text-muted my-3 mr-3 v-html"
                            style="word-break: break-word !important;"
                        />

                        <div
                            class="d-flex align-items-center"
                        >
                            <div class="d-flex align-items-center">
                                <div>
                                    <favorite-recipe-icon :recipe_id="recipe.id" />
                                </div>
                                <div class="ml-2">
                                    <share-recipe-icon
                                        :recipe_id="recipe.id"
                                        :recipe_name="recipe_name"
                                    />
                                </div>
                                <div v-if="currentUser && (recipe.created_by.uid == currentUser.uid)" class="d-flex align-items-center ml-2">
                                    <div v-if="vue_app_environment == 'local'" class="mr-2">
                                        <a
                                            href="#"
                                            class="text-warning"
                                            :class="{'active': recipe.debugging}"
                                            title="Debug"
                                            @click.prevent="debug(recipe)"
                                        >
                                            <font-awesome-icon :icon="recipe.debugging ? ['fas', 'code'] : ['fad', 'code']" fixed-width />
                                        </a>
                                    </div>
                                    <b-dropdown
                                        variant="link"
                                        toggle-tag="a"
                                        toggle-class="text-secondary p-0"
                                    >
                                        <template v-slot:button-content>
                                            <font-awesome-icon :icon="['fad', 'cog']" fixed-width />
                                            <font-awesome-icon :icon="['fas', 'caret-down']" fixed-width />
                                        </template>
                                        <b-dropdown-item @click="editRecipe(recipe)">
                                            <font-awesome-icon :icon="['fad', 'pencil']" class="text-primary" fixed-width /> Edit
                                        </b-dropdown-item>
                                        <b-dropdown-item @click.prevent="deleteRecipe(recipe)">
                                            <font-awesome-icon :icon="['fad', 'trash']" class="text-danger" fixed-width /> Delete
                                        </b-dropdown-item>
                                    </b-dropdown>
                                </div>
                            </div>
                            <div
                                class="ml-auto"
                            >
                                <!-- <div class="d-flex align-items-center">
                                    <div
                                        :content="recipe.created_by.displayName"
                                        v-tippy
                                    >
                                        <v-gravatar :email="recipe.created_by.email" width="16" class="d-block rounded-circle" />
                                    </div>
                                    <div class="small text-muted ml-sm-2">
                                        {{moment(recipe.created).fromNow()}}
                                    </div>
                                </div> -->
                            </div>
                        </div>
                    </div>
                </div>
                <a
                    v-if="recipe.thumbnail"
                    href="#"
                    :style="{
                        backgroundImage: recipe.thumbnail ? 'url(' + recipe.thumbnail + ')' : '',
                        borderBottomRightRadius: recipe.debugging ? '0' : '.25rem'
                    }"
                    class="border-left recipe-thumbnail"
                    @click.prevent="showImage(recipe.thumbnail)"
                />
            </div>
            <div v-if="vue_app_environment == 'local' && recipe.debugging" class="border-top position-relative p-0">
                <a href="#" @click.prevent="recipe.debugging = false" class="small position-absolute" style="right: 1rem; top: 1rem;">
                    close
                </a>
                <prism language="json" class="m-0 p-1">
                    {{recipe}}
                </prism>
            </div>
        </div>

        <simple-recipe-modal
            v-model="simple_recipe_modal"
            :recipe="recipe"
            @update="updateRecipe"
            @hide="simple_recipe_modal = false"
        />

        <recipe-modal
            v-model="recipe_modal"
            :recipe="recipe"
            @update="updateRecipe"
            @hide="recipe_modal = false"
        />

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
import { mapState } from 'vuex'

// import VClamp from 'vue-clamp'

import Prism from 'vue-prismjs'
import 'prismjs/themes/prism.css'

import moment from 'moment'

import firebase from 'firebase/app'

import FavoriteRecipeIcon from '@/components/icons/FavoriteRecipeIcon'
import ShareRecipeIcon from '@/components/icons/ShareRecipeIcon'

import SimpleRecipeModal from '@/components/modals/SimpleRecipeModal'
import RecipeModal from '@/components/modals/RecipeModal'

import ImageModal from '@/components/modals/ImageModal'

// import Tag from '@/components/Tag'

export default {
    name: 'RecipeCard',
    data: () => ({
        image: null,

        env: process.env,

        moment: moment,

        simple_recipe_modal: false,
        recipe_modal: false,

        image_modal: false
    }),
    components: {
        // VClamp,
        Prism,
        // Tag
        FavoriteRecipeIcon,
        ShareRecipeIcon,

        SimpleRecipeModal,
        RecipeModal,

        ImageModal
    },
    computed: {
        ...mapState({
            currentUser: state => state.user.user,
            vue_app_environment: state => state.vue_app_environment
        }),
        recipe_name () {
            let string = ''

            if (this.recipe.name) {
                string = this.recipe.name.toLowerCase()
            }

            return string.replace(/\s/g, '-');
        }
    },
    props: {
        recipe: Object
    },
    methods: {
        debug (recipe) {
            if (recipe.debugging) {
                this.$set(recipe, 'debugging', false)
            } else {
                this.$set(recipe, 'debugging', true)
            }
        },
        showImage (image) {
            this.image = image
            this.image_modal = true
        },
        editRecipe (recipe) {
            if (
                recipe.type &&
                recipe.type == 'simple'
            ) {
                this.simple_recipe_modal = true
            } else {
                this.recipe_modal = true
            }
        },
        updateRecipe (recipe) {
            const updated = this.moment().format()

            Object.assign(recipe, {updated})

            firebase
            .firestore()
            .collection("recipes")
            .doc(recipe.id)
            .set(recipe)
            .then(() => {
                this.simple_recipe_modal = false
                this.recipe_modal = false

                this.$set(recipe, 'updating', false)
            })
            .catch(error => {
                if (error) {
                    console.log(error)
                }
            })
        },
        deleteRecipe (recipe) {
            let message = null

            if (recipe.name) {
                message = 'Are you sure you want to delete <strong>"' + recipe.name + '"</strong>?'
            } else {
                message = 'Are you sure you want to delete this recipe?'
            }

            this.$swal({
                icon: 'warning',
                html: message,
                showCancelButton: true,
                confirmButtonText: 'Delete',
                confirmButtonColor: '#E74C3C',
                cancelButtonText: 'Cancel',
                cancelButtonColor: '#f8f9fa',
                reverseButtons: true
            }).then((result) => {
                if (result.value) {
                    firebase.firestore().collection('recipes').doc(recipe.id).delete()
                }
            })
        }
    }
}
</script>

<style lang="scss">
@import '@/assets/css/_colors';
.recipe {
    code[class*="language-"],
    pre[class*="language-"] {
        white-space: pre-wrap;
        border-bottom-left-radius: calc(0.25rem - 1px);
        border-bottom-right-radius: calc(0.25rem - 1px);
        .token.boolean {
            color: #EC407A;
        }
        .token.property, .token.tag, .token.number, .token.constant, .token.symbol, .token.deleted {
            color: #607D8B;
        }
        .token.selector, .token.attr-name, .token.string, .token.char, .token.builtin, .token.inserted {
            color: #4CAF50;
        }
        .token.operator, .token.entity, .token.url, .language-css .token.string, .style .token.string {
            color: #8D6E63;
            background-color: transparent;
        }
    }
}
</style>

<style lang="scss" scoped>
@import '@/assets/css/_colors';
.recipe {
    .recipe-thumbnail {
        min-width: 150px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        transition: none;
    }

    @media (max-width: 991px) {
        .recipe-thumbnail {
            min-width: 125px;
        }
    }
}
</style>
