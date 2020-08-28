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
                <img :src="active_image" class="border rounded user-select-none" width="100%">
            </div>

            <div v-if="thumbnail && images && images.length || !thumbnail && images && images.length > 1" class="d-flex align-items-center mt-3">
                <div v-if="thumbnail">
                    <a
                        href="#"
                        class="d-inline-block img-thumbnail"
                        :class="{
                            'border-dark': imageActive(thumbnail),
                            'mr-1': images && images.length
                        }"
                        style="min-width: 75px; width: 75px; height: 75px; background-size: cover; background-position: center;"
                        :style="{
                            backgroundImage: thumbnail ? 'url(' + thumbnail + ')' : ''
                        }"
                        @click.prevent="setActiveImage(thumbnail)"
                    />
                </div>
                <div v-if="images && images.length">
                    <a
                        href="#"
                        v-for="(image, imageIndex) in images"
                        :key="imageIndex"
                        class="d-inline-block img-thumbnail"
                        :class="{
                            'border-dark': imageActive(image.image),
                            'mr-1': images && images.length
                        }"
                        style="min-width: 75px; width: 75px; height: 75px; background-size: cover; background-position: center;"
                        :style="{
                            backgroundImage: image.image ? 'url(' + image.image + ')' : ''
                        }"
                        @click.prevent="setActiveImage(image.image)"
                    />
                </div>
            </div>
        </b-modal>
    </div>
</template>

<script>
export default {
    name: 'ImageModal',
    data: () => ({
        active_image: null
    }),
    components: {

    },
    props: {
        value: Boolean,
        image: String,
        thumbnail: String,
        images: Array
    },
    computed: {

    },
    methods: {
        setActiveImage (image) {
            this.active_image = image
        },
        imageActive (image) {
            if (image == this.active_image) {
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
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/_colors';
</style>
