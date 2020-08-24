<template>
    <div>
        <div
            class="card"
        >
            <div
                class="card-header"
                :class="{
                    'bg-white border-bottom-0': !recipe.description && !recipe.images,
                }"
            >
                <div class="d-flex align-items-center">
                    <div class="flex-grow-1 mr-3">
                        <router-link :to="{name: 'Recipe', params: {recipe_key: recipe['.key'], url: permalink}}" class="font-weight-bold">
                            {{recipe.name}}
                        </router-link>
                    </div>
                    <div class="d-flex aling-items-center">
                        <div
                            v-if="recipe.time.total"
                            content="Cook Time"
                            v-tippy
                            class="ml-3"
                            :class="{
                                'text-success': recipe.time.total <= 15,
                                'text-warning': recipe.time.total > 15 && recipe.time.total < 45,
                                'text-danger': recipe.time.total >= 45
                            }"
                        >
                            <font-awesome-icon
                                :icon="['fad', 'clock']"
                                fixed-width
                            />
                            {{recipe.time.total}}
                        </div>
                        <div
                            v-if="recipe.servings"
                            class="text-secondary ml-3"
                            content="Servings"
                            v-tippy
                        >
                        <font-awesome-icon
                            :icon="['fad', 'users']"
                            fixed-width
                        />
                        {{recipe.servings}}
                        </div>
                    </div>
                </div>
            </div>
            <div
                class="card-body"
            >
                <div class="d-flex align-items-center">
                    <div v-if="recipe.images && recipe.images.length" class="d-md-flex d-none">
                        <img :src="recipe.images[0].image" class="border p-1 rounded mr-3" width="75" />
                    </div>
                    <div
                        v-if="recipe.description"
                        class="text-muted font-weight-light"
                        :class="{'mr-3': recipe.created_by && recipe.created_by.uid == currentUser.uid}"
                    >
                        {{recipe.description}}
                    </div>
                    <div
                        class="ml-auto"
                    >
                        <div class="d-flex align-items-center">
                            <div>
                                <a href="#" @click.prevent class="text-danger" content="Favorite" v-tippy>
                                    <font-awesome-icon :icon="['far', 'heart']" fixed-width />
                                </a>
                            </div>
                            <div class="ml-3">
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
                            <div
                                v-if="recipe.created_by && recipe.created_by.uid == currentUser.uid"
                                class="d-flex flex-nowrap ml-auto"
                            >
                                <a
                                    href="#"
                                    class="ml-3"
                                    content="Edit"
                                    v-tippy
                                    @click.prevent
                                >
                                    <font-awesome-icon :icon="['fad', 'edit']" fixed-width />
                                </a>
                                <a
                                    href="#"
                                    class="text-danger ml-3"
                                    content="Delete"
                                    v-tippy
                                    @click.prevent
                                >
                                    <font-awesome-icon :icon="['fad', 'trash']" fixed-width />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                v-if="recipe.images && recipe.images.length"
                class="d-md-none d-block card-body border-top"
            >
                <div
                    class="images"
                    :class="{'mr-3': recipe.description}"
                >
                    <div
                        v-for="(image, imageIndex) in recipe.images"
                        :key="imageIndex"
                        class="d-inline-block"
                        :class="{'ml-1': imageIndex > 0}"
                    >
                        <img :src="image.image" class="border p-1 rounded" width="75" />
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <div class="d-flex align-items-center">
                    <div class="mr-3">
                        <small class="text-muted">
                            <div class="d-md-flex align-items-center">
                                <div>
                                    <a href="#" class="text-secondary" @click.prevent>{{recipe.created_by.displayName}}</a>
                                </div>
                                <div class="d-md-flex d-none mx-1">&middot;</div>
                                <div class="font-weight-light">{{recipe.created.date_time | moment("from", "now")}}</div>
                            </div>
                        </small>
                    </div>
                    <div class="ml-auto text-right">
                        <span
                            v-for="(tag, tagIndex) in recipe.tags"
                            :key="tagIndex"
                        >
                            <Tag
                                :tag="tag"
                                :class="{'ml-1': tagIndex > 0}"
                            />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

import Vue from 'vue'

import Tag from '@/components/Tag'

Vue.use(require('vue-moment'))

export default {
    name: 'Recipe',
    components: {
        Tag
    },
    computed: {
        ...mapState({
            currentUser: state => state.user.user
        }),
        permalink () {
            let string = this.recipe.name.toLowerCase()

            return string.replace(/\s/g, '-');
        }
    },
    props: {
        recipe: Object
    },
    data: () => ({

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
