<template>
    <div>
        <b-modal
            :visible="value"
            centered
            no-fade
            hide-header
            :no-close-on-backdrop="recipe_changes"
            :no-close-on-esc="recipe_changes"
            size="lg"
            @show="show"
            @shown="shown"
            @hidden="hidden"
            @hide="hide"
            @cancel="hide"
            @close="hide"
        >
            <a
                href="#"
                class="modal-close"
                aria-label="Close"
                @click.prevent="cancelRecipe"
            >
                <font-awesome-layers>
                    <font-awesome-icon icon="circle" class="background" transform="shrink-1" />
                    <font-awesome-icon :icon="['fas', 'times-circle']" class="foreground" />
                </font-awesome-layers>
            </a>

            <div class="recipe-title">
                <input
                    ref="name"
                    type="text"
                    v-model="editable_recipe.name"
                    class="form-control bg-transparent border-0 p-0"
                    :class="{
                        'is-invalid': validating && !editable_recipe.name
                    }"
                    placeholder="Recipe Name"
                >

                <div
                    v-if="validating && !editable_recipe.name"
                    class="text-danger my-3"
                >
                    &bull; Recipe Name is required
                </div>
            </div>

            <div class="my-3">
                <label class="form-label">Description</label>
                <TipTap
                    v-model="editable_recipe.description"
                    editor_menu="bubble"
                    :autoFocus="false"
                    @input="setContent(editable_recipe, 'description', $event)"
                />
            </div>

            <div>
                <label class="form-label">Content</label>
                <TipTap
                    v-model="editable_recipe.content"
                    :class="{
                        'is-invalid': validating && (!editable_recipe.content || editable_recipe.content && editable_recipe.content == '<p></p>')
                    }"
                    :autoFocus="false"
                    @input="setContent(editable_recipe, 'content', $event)"
                />

                <div
                    v-if="validating && (!editable_recipe.content || editable_recipe.content && editable_recipe.content == '<p></p>')"
                    class="text-danger mt-3"
                >
                    &bull; Content is required
                </div>
            </div>

            <template #modal-footer>
                <button
                    type="button"
                    class="btn btn-light"
                    @click="cancelRecipe"
                >
                    Cancel
                </button>
                <button
                    v-if="!editable_recipe.id || editable_recipe.id && recipe_changes"
                    type="button"
                    class="btn"
                    :class="{
                        'btn-primary': editable_recipe.id,
                        'btn-success': !editable_recipe.id
                    }"
                    :disabled="editable_recipe.creating || editable_recipe.updating"
                    @click="saveRecipe"
                >
                    <div v-if="editable_recipe.id">
                        <div v-if="editable_recipe.updating">
                            <Spinner />
                        </div>
                        <div v-else>
                            <font-awesome-icon :icon="['fad', 'check-square']" fixed-width /> Update
                        </div>
                    </div>
                    <div v-else>
                        <div v-if="editable_recipe.creating">
                            <Spinner />
                        </div>
                        <div v-else>
                            <font-awesome-icon :icon="['far', 'plus']" fixed-width /> Create Recipe
                        </div>
                    </div>
                </button>
            </template>
        </b-modal>
    </div>
</template>

<script>
// import SimpleRecipeForm from '@/components/recipe/SimpleRecipeForm'

import moment from 'moment'

import Spinner from '@/components/Spinner'

import TipTap from '@/components/TipTap'

export default {
    name: 'RecipeModal',
    data: () => ({
        editable_recipe: {},
        editable_recipe_cache: {},

        moment: moment,

        validating: false,
        creating: false
    }),
    components: {
        // SimpleRecipeForm,
        Spinner,
        
        TipTap
    },
    props: {
        value: Boolean,
        recipe: Object
    },
    computed: {
        recipe_changes () {
            return !_.isEqual(this.editable_recipe, this.editable_recipe_cache)
        }
    },
    methods: {
        saveRecipe () {
            this.validating = true

            if (!this.validated()) {
                return false
            }

            if (this.recipe_changes) {
                if (this.editable_recipe.id) {
                    this.$emit('update', this.editable_recipe)

                    this.$set(this.editable_recipe, 'updating', true)
                } else {
                    this.$set(this.editable_recipe, 'type', 'simple')

                    this.$emit('create', this.editable_recipe)

                    this.$set(this.editable_recipe, 'creating', true)
                }
            } else {
                this.hide()
            }
        },
        cancelRecipe () {
            if (this.recipe_changes) {
                let message = null
                let confirmButtonText = null

                if (this.editable_recipe.id) {
                    message = 'Changes have been made to this recipe. If you proceed, changes will be lost.'
                    confirmButtonText = 'Discard Changes'
                } else {
                    message = 'Are you sure you want to discard this recipe?'
                    confirmButtonText = 'Discard Recipe'
                }

                this.$swal({
                    html: message,
                    showCancelButton: true,
                    confirmButtonText: confirmButtonText,
                    confirmButtonColor: '#E74C3C',
                    cancelButtonText: 'Keep Editing',
                    cancelButtonColor: '#f8f9fa',
                    reverseButtons: true
                }).then((result) => {
                    if (result.value) {
                        this.hide()
                    }
                })
            } else {
                this.hide()
            }
        },
        validated () {
            let valid = true

            if (!this.editable_recipe.name) {
                valid = false
                if (this.$refs.name) {
                    this.$refs.name.focus()
                }
            }

            else if (
                !this.editable_recipe.content ||
                !this.editable_recipe.content == '<p></p>'
            ) {
                valid = false
            }

            return valid
        },
        setContent (item, field, value) {
            if (value) {
                this.$set(item, field, value)
            }
        },
        show () {
            if (this.recipe) {
                this.editable_recipe = _.cloneDeep(this.recipe)
                this.editable_recipe_cache = _.cloneDeep(this.recipe)
            }
        },
        shown () {
            if (
                !this.editable_recipe.id &&
                this.$refs.name
            ) {
                this.$refs.name.focus()
            }
        },
        hide () {
            this.$emit('hide')
        },
        hidden () {
            this.editable_recipe = {}
            this.editable_recipe_cache = {}

            this.validating = false

            this.$emit('hide')
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/_colors';

.recipe-form {
    .invalid-feedback {
        margin-top: 1rem;
    }
    :focus {
        outline: none;
    }
}

.recipe-title {
    .form-control {
        // font-size: 2.5rem;
        font-size: 2rem;
        font-weight: bold;
        line-height: 1.2;
        min-height: auto;
    }
}
</style>
