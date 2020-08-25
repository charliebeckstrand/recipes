<template>
    <div>
        <div class="card">
            <div class="d-flex">
                <div class="flex-grow-1">
                    <div class="card-body">
                        <h5 class="card-title">
                            <router-link
                                :to="{
                                    name: 'Recipe',
                                    params: {
                                        recipe_key: recipe['.key'],
                                        url: permalink
                                    }
                                }"
                                class="font-weight-bold"
                            >
                                {{recipe.name}}
                            </router-link>
                        </h5>
                        <p class="card-text text-muted my-3">{{recipe.description}}</p>
                        <div class="d-flex align-items-center">
                            <div class="d-flex align-items-center">
                                <div>
                                    <a href="#" @click.prevent class="text-danger" content="Favorite" v-tippy>
                                        <font-awesome-icon :icon="['far', 'heart']" fixed-width />
                                    </a>
                                </div>
                                <div class="ml-2">
                                    <a
                                        href="#"
                                        class="text-info"
                                        content="Share"
                                        v-tippy
                                        @click.prevent
                                    >
                                        <font-awesome-icon :icon="['fad', 'share-alt']" fixed-width />
                                    </a>
                                </div>
                            </div>
                            <div class="ml-auto">

                            </div>
                        </div>
                    </div>
                    <!-- <div class="card-footer">
                        test
                    </div> -->
                </div>
                <a
                    v-if="recipe.images"
                    href="#"
                    style="min-width: 150px; background-size: cover;"
                    :style="{
                        backgroundColor: '#f9f9f9',
                        backgroundPosition: 'center',
                        backgroundImage: recipe.images ? 'url(' + recipe.images[0].image + ')' : ''
                    }"
                    class="rounded-right border-left"
                    @click.prevent="showImageModal(recipe.images[0].image)"
                />
            </div>
        </div>

        <image-modal
            v-model="image_modal"
            :image="image"
            :recipe="recipe"
            @hide="image_modal = false"
        />
    </div>
</template>

<script>
import { mapState } from 'vuex'

import firebase from 'firebase/app'

// import Tag from '@/components/Tag'

import ImageModal from '@/components/modals/ImageModal'

export default {
    name: 'Recipe',
    components: {
        // Tag
        ImageModal
    },
    computed: {
        ...mapState({
            currentUser: state => state.user.user
        }),
        permalink () {
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
        showImageModal (image) {
            this.image = image
            this.image_modal = true
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

        image_modal: false
    }),
    mounted () {

    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/colors';
.icons {
    > div {
        margin-left: 1rem;
    }
}
</style>
