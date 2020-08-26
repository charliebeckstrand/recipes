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
                                        recipe_key: recipe['.key'],
                                        url: url_name
                                    }
                                }"
                                class="font-weight-bold"
                            >
                                {{recipe.name}}
                            </router-link>
                        </h5>
                        <p class="card-text text-muted my-3">
                            <!-- {{recipe.description}} -->
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
                        </p>
                        <div class="d-flex align-items-center">
                            <div class="d-flex align-items-center">
                                <div>
                                    <a
                                        href="#"
                                        class="text-pink"
                                        title="Favorite"
                                        @click.prevent
                                    >
                                        <font-awesome-icon :icon="['far', 'heart']" fixed-width />
                                    </a>
                                </div>
                                <div class="ml-2">
                                    <a
                                        href="#"
                                        class="text-info"
                                        title="Share"
                                        @click.prevent="shareRecipe"
                                    >
                                        <font-awesome-icon :icon="['fad', 'share-alt']" fixed-width />
                                    </a>
                                </div>
                            </div>
                            <div class="ml-auto">

                            </div>
                        </div>
                        <!-- <router-link
                            :to="{
                                name: 'Recipe',
                                params: {
                                    recipe_key: recipe['.key'],
                                    url: url_name
                                }
                            }"
                            class="d-sm-none d-inline-block btn btn-sm btn-outline-primary mt-3"
                        >
                            <font-awesome-icon :icon="['fad', 'eye']" fixed-width /> View
                        </router-link> -->
                    </div>
                    <!-- <div class="card-footer">
                        test
                    </div> -->
                </div>
                <a
                    v-if="recipe.thumbnail"
                    href="#"
                    :style="{
                        backgroundImage: recipe.thumbnail ? 'url(' + recipe.thumbnail + ')' : ''
                    }"
                    class="rounded-right border-left recipe-thumbnail"
                    @click.prevent="showImageModal(recipe.thumbnail)"
                />
            </div>
        </div>

        <share-recipe-modal
            v-model="share_recipe_modal"
            :permalink="permalink"
            @hide="share_recipe_modal = false"
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

import VClamp from 'vue-clamp'

import firebase from 'firebase/app'

// import Tag from '@/components/Tag'

import ImageModal from '@/components/modals/ImageModal'
import ShareRecipeModal from '@/components/modals/ShareRecipeModal'

export default {
    name: 'Recipe',
    components: {
        VClamp,

        // Tag
        ImageModal,
        ShareRecipeModal
    },
    computed: {
        ...mapState({
            currentUser: state => state.user.user
        }),
        url_name () {
            let string = ''

            if (this.recipe.name) {
                string = this.recipe.name.toLowerCase()
            }

            return string.replace(/\s/g, '-');
        },
        permalink () {
            let permalink = null

            if (
                this.url_name &&
                this.recipe['.key'] &&
                process.env.VUE_APP_API_URL
            ) {
                permalink = process.env.VUE_APP_API_URL + '/recipes/' + this.recipe['.key'] + '/' + this.url_name
            }

            return permalink
        }
    },
    props: {
        recipe: Object
    },
    methods: {
        showImageModal (image) {
            this.image = image
            this.image_modal = true
        },
        shareRecipe () {
            this.share_recipe_modal = true
        },
        deleteRecipe (recipe) {
            let message = null

            if (recipe.name) {
                message = 'Are you sure you want to delete "' + recipe.name + '"?'
            } else {
                message = 'Are you sure you want to delete this recipe?'
            }

            this.$swal({
                html: message,
                showCancelButton: true,
                confirmButtonText: 'Delete',
                confirmButtonColor: '#E74C3C',
                cancelButtonText: 'Cancel',
                cancelButtonColor: '#f8f9fa',
                reverseButtons: true
            }).then((result) => {
                if (result.value) {
                    firebase.firestore().collection('recipes').doc(recipe['.key']).delete()
                }
            })
        }
    },
    data: () => ({
        image: null,

        image_modal: false,
        share_recipe_modal: false
    }),
    mounted () {

    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/_colors';
.recipe {
    .recipe-thumbnail {
        min-width: 150px;
        background-size: cover;
        background-position: center;
    }

    @media (max-width: 991px) {
        .recipe-thumbnail {
            min-width: 125px;
        }
    }
}
</style>
