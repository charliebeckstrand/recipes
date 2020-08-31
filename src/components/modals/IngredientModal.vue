<template>
    <div>
        <b-modal
            :visible="value"
            centered
            no-fade
            hide-header
            :no-close-on-backdrop="has_ingredient"
            :no-close-on-esc="has_ingredient"
            @show="show"
            @shown="shown"
            @hidden="hidden"
            @hide="hide"
            @cancel="hide"
            @close="hide"
        >
            <!-- <template #modal-header>
                <h5 class="modal-title">
                    <div v-if="ingredient">Edit Ingredient</div>
                    <div v-else>Add Ingredient</div>
                </h5>
            </template> -->

            <a
                href="#"
                class="modal-close"
                aria-label="Close"
                @click.prevent="hide"
            >
                <font-awesome-layers>
                    <font-awesome-icon icon="circle" class="background" transform="shrink-1" />
                    <font-awesome-icon :icon="['fas', 'times-circle']" class="foreground" />
                </font-awesome-layers>
            </a>

            <div class="mb-3">
                <label for="ingredient" class="form-label">Amount</label>
                <input
                    ref="amount"
                    type="text"
                    v-model="editable_ingredient.amount"
                    aria-label="Amount"
                    class="form-control"
                    :class="{'is-invalid': validating && !editable_ingredient.amount}"
                >
                <div class="invalid-feedback">
                    &bull; Amount is required
                </div>
            </div>

            <!-- <div class="mb-3">
                <label for="measurement" class="form-label">Measurement</label>
                <input
                    ref="measurement"
                    type="text"
                    v-model="editable_ingredient.measurement"
                    aria-label="Measurement"
                    class="form-control"
                >
            </div> -->

            <div class="">
                <label for="ingredient" class="form-label">Ingredient</label>
                <input
                    id="ingredient"
                    ref="ingredient"
                    type="text"
                    v-model="editable_ingredient.ingredient"
                    aria-label="Ingredient"
                    class="form-control font-weight-bold"
                    :class="{'is-invalid': validating && !editable_ingredient.ingredient}"
                    v-focus
                >
                <div class="invalid-feedback">
                    &bull; Ingredient is required
                </div>
            </div>

            <template #modal-footer>
                <button type="button" class="btn btn-light" @click="hide">
                    Cancel
                </button>
                <button
                    type="button"
                    class="btn"
                    :class="{
                        'btn-primary': ingredient,
                        'btn-success': !ingredient
                    }"
                    @click="saveIngredient"
                >
                    <div v-if="ingredient">
                        <font-awesome-icon :icon="['fad', 'check-square']" fixed-width /> Save Changes
                    </div>
                    <div v-else>
                        <font-awesome-icon :icon="['fad', 'plus-square']" fixed-width /> Add Ingredient
                    </div>
                </button>
            </template>
        </b-modal>
    </div>
</template>

<script>
export default {
    name: 'IngredientModal',
    data: () => ({
        editable_ingredient: {},

        validating: false
    }),
    components: {

    },
    props: {
        value: Boolean,
        ingredient: Object
    },
    computed: {
        has_ingredient () {
            let has_ingredient = false
            if (_.some(this.editable_ingredient)) {
                has_ingredient = true
            }
            return has_ingredient
        }
    },
    methods: {
        saveIngredient () {
            this.validating = true

            if (!this.validated()) {
                return false
            }

            this.$emit('add', this.editable_ingredient)
        },
        validated () {
            let valid = true

            if (!this.editable_ingredient.amount) {
                valid = false
                if (this.$refs.amount) {
                    this.$refs.amount.focus()
                }
            } else if (!this.editable_ingredient.ingredient) {
                valid = false
                if (this.$refs.ingredient) {
                    this.$refs.ingredient.focus()
                }
            }

            return valid
        },
        show () {
            if (this.ingredient) {
                this.editable_ingredient = _.cloneDeep(this.ingredient)
            }
        },
        shown () {
            if (
                !this.ingredient &&
                this.$refs.amount
            ) {
                this.$refs.amount.focus()
            }
        },
        hide () {
            this.$emit('hide')
        },
        hidden () {
            this.editable_ingredient = {}

            this.validating = false

            this.$emit('hide')
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/_colors';
</style>
