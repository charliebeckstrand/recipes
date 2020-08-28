<template>
    <div class="simple-recipe-form">
        <form
            class="create-recipe-form"
            @submit.prevent="createRecipe"
        >
            <div class="recipe-title mb-3">
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

            <div class="mb-3">
                <!-- <textarea
                    ref="description"
                    v-model="editable_recipe.description"
                    class="form-control bg-transparent border-0 px-0"
                    rows="1"
                    placeholder="Description"
                /> -->
                <label class="form-label">Description</label>
                <TipTap
                    v-model="editable_recipe.description"
                    :menu="'bubble'"
                    @input="setContent('description', $event)"
                />
            </div>

            <div>
                <TipTap
                    v-model="editable_recipe.html"
                    :class="{
                        'is-invalid': (validating && !editable_recipe.html) || validating && htmlEmpty(editable_recipe.html)
                    }"
                    @input="setContent('html', $event)"
                />
                <div
                    v-if="(validating && !editable_recipe.html) || validating && htmlEmpty(editable_recipe.html)"
                    class="text-danger my-3"
                >
                    &bull; HTML is required
                </div>
            </div>

            <!-- <div class="d-flex align-items-center mt-5">
                <button
                    type="submit"
                    class="btn btn-success"
                    :disabled="creating"
                >
                    <div v-if="creating">
                        <font-awesome-icon
                            :icon="['fal', 'spinner-third']"
                            spin
                            fixed-width
                        />
                    </div>
                    <div v-else>
                        <font-awesome-icon :icon="['far', 'plus']" fixed-width /> Create Recipe
                    </div>
                </button>
                <div class="ml-auto">
                    <a
                        href="#"
                        class="btn btn-outline-danger"
                        @click.prevent="discardRecipe"
                    >
                        <font-awesome-icon :icon="['far', 'trash-alt']" fixed-width /> Discard
                    </a>
                </div>
            </div> -->
        </form>
    </div>
</template>

<script>
import TipTap from '@/components/TipTap'

export default {
    name: 'SimpleRecipeForm',
    data: () => ({
        editable_recipe: {},

        creating: false,
        validating: false
    }),
    components: {
        TipTap
    },
    props: {
        recipe: Object
    },
    methods: {
        createRecipe () {
            this.validating = true

            if (!this.validated()) {
                return false
            }

            this.creating = true

            this.$emit('submit', this.editable_recipe)
        },
        discardRecipe () {
            this.$router.push({
                name: 'Home'
            })
        },
        validated () {
            let valid = true

            if (!this.editable_recipe.name) {
                valid = false
                if (this.$refs.name) {
                    this.$refs.name.focus()
                }
            } else if (
                !this.editable_recipe.html ||
                this.editable_recipe.html && this.htmlEmpty(this.editable_recipe.html)
            ) {
                valid = false
            }

            return valid
        },
        setContent (field, value) {
            console.log(field, value)
            if (field) {
                this.$set(this.editable_recipe, field, value)
                console.log(this.editable_recipe)
            }
        },
        htmlEmpty (html) {
            let empty = false

            if (html == '<p></p>') {
                empty = true
            }

            return empty
        }
    },
    created () {
        if (
            this.recipe
        ) {
            this.editable_recipe = Object.assign(this.editable_recipe, this.recipe)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/_colors';

.create-recipe-form {
    .invalid-feedback {
        margin-top: 1rem;
    }
    :focus {
        outline: none;
    }
}

.recipe-title {
    .form-control {
        font-size: 2.5rem;
        font-weight: bold;
        line-height: 1.2;
        min-height: auto;
    }
}
</style>
