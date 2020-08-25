<template>
    <div>
        <b-modal
            :visible="value"
            centered
            no-fade
            hide-header
            hide-footer
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
                @click.prevent="hide"
            >
                <font-awesome-layers>
                    <font-awesome-icon icon="circle" class="background" transform="shrink-1" />
                    <font-awesome-icon :icon="['fas', 'times-circle']" class="foreground" />
                </font-awesome-layers>
            </a>

            <div>
                <img :src="active_image" class="border rounded p-1" width="100%">
            </div>

            <div v-if="recipe.images && recipe.images.length > 1" class="mt-3">
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
        </b-modal>
    </div>
</template>

<script>
export default {
    name: 'ImageModal',
    components: {

    },
    props: {
        value: Boolean,
        recipe: Object,
        image: String
    },
    computed: {

    },
    methods: {
        setActiveImage (image) {
            this.active_image = image
        },
        imageActive (image) {
            if (image.image == this.active_image) {
                return true
            }
        },
        // modal event methods
        show () {
            if (this.image) {
                this.active_image = this.image
            }
        },
        shown () {

        },
        hide () {
            this.$emit('hide')
        },
        hidden () {
            this.$emit('hide')
        }
    },
    data: () => ({
        active_image: null
    })
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/colors';
</style>
