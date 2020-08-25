<template>
    <div>
        <b-modal
            :visible="value"
            centered
            no-fade
            :no-close-on-backdrop="has_ingredient"
            :no-close-on-esc="has_ingredient"
            @shown="shown"
            @hidden="hidden"
            @hide="hide"
            @cancel="hide"
            @close="hide"
        >
            <template #modal-header>
                <h5 class="modal-title">Add Ingredient</h5>
                <!-- <button type="button" class="modal-close" data-dismiss="modal" aria-label="Close">
                    <font-awesome-icon :icon="['far', 'times']" />
                </button> -->
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
            </template>

            <div class="mb-3">
                <label for="ingredient" class="form-label">Ingredient</label>
                <input
                    id="ingredient"
                    ref="ingredient"
                    type="text"
                    v-model="ingredient.ingredient"
                    aria-label="Ingredient"
                    class="form-control"
                    :class="{'is-invalid': validating && !ingredient.ingredient}"
                    v-focus
                >
                <div class="invalid-feedback">
                    &bull; Ingredient is required
                </div>
            </div>
            <div class="mb-3">
                <label for="ingredient" class="form-label">Amount</label>
                <input
                    ref="amount"
                    type="text"
                    v-model="ingredient.amount"
                    aria-label="Amount"
                    class="form-control"
                    :class="{'is-invalid': validating && !ingredient.amount}"
                >
                <div class="invalid-feedback">
                    &bull; Amount is required
                </div>
            </div>
            <div>
                <label for="measurement" class="form-label">Measurement</label>
                <input
                    ref="measurement"
                    type="text"
                    v-model="ingredient.measurement"
                    aria-label="Measurement"
                    class="form-control"
                    :class="{'is-invalid': validating && !ingredient.measurement}"
                >
                <div class="invalid-feedback">
                    &bull; Measurement is required
                </div>
            </div>

            <template #modal-footer>
                <button type="button" class="btn btn-success" @click="addIngredient">
                    <font-awesome-icon :icon="['fad', 'plus-square']" fixed-width /> Add Ingredient
                </button>
            </template>
        </b-modal>
    </div>
</template>

<script>
export default {
    name: 'AddIngredientModal',
    components: {

    },
    props: {
        value: Boolean
    },
    computed: {
        has_ingredient () {
            let has_ingredient = false
            if (_.some(this.ingredient)) {
                has_ingredient = true
            }
            return has_ingredient
        }
    },
    methods: {
        addIngredient () {
            this.validating = true

            if (!this.validated()) {
                return false
            }

            this.$emit('add', this.ingredient)
        },
        validated () {
            let valid = true

            if (!this.ingredient.ingredient) {
                valid = false
                if (this.$refs.ingredient) {
                    this.$refs.ingredient.focus()
                }
            } else if (!this.ingredient.amount) {
                valid = false
                if (this.$refs.amount) {
                    this.$refs.amount.focus()
                }
            } else if (!this.ingredient.measurement) {
                valid = false
                if (this.$refs.measurement) {
                    this.$refs.measurement.focus()
                }
            }

            return valid
        },
        // modal event methods
        shown () {
            if (this.$refs.ingredient) {
                this.$refs.ingredient.focus()
            }
        },
        hide () {
            this.$emit('hide')
        },
        hidden () {
            this.ingredient = {}

            this.validating = false

            this.$emit('hide')
        }
    },
    data: () => ({
        ingredient: {},

        validating: false
    }),
    mounted () {

    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/_colors';
</style>
