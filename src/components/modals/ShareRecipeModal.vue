<template>
    <div>
        <b-modal
            :visible="value"
            centered
            no-fade
            size="lg"
            @shown="shown"
            @hidden="hidden"
            @hide="hide"
            @cancel="hide"
            @close="hide"
            hide-footer
        >
            <template #modal-header>
                <h5 class="modal-title">Share Recipe</h5>
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

            <h6 class="p-3 border rounded">
                <div class="d-flex align-items-center">
                    <div class="copyable-link font-weight-bold text-muted mr-3">
                        {{permalink}}
                    </div>
                    <div class="ml-auto user-select-none">
                        <button
                            type="button"
                            title="Copy to Clipboard"
                            class="btn btn-link p-0"
                            :class="{'text-success disabled': copying_to_clipboard}"
                            @click.prevent="copyToClipboard"
                            :disabled="copying_to_clipboard"
                        >
                            <div v-if="copying_to_clipboard" class="text-nowrap">
                                <font-awesome-icon :icon="['fas', 'check']" fixed-width /> copied
                            </div>
                            <div v-else>
                                <font-awesome-icon :icon="['fad', 'clipboard']" fixed-width />
                            </div>
                        </button>
                    </div>
                </div>
            </h6>

            <!-- <div class="input-group">
                <textarea type="text" class="form-control share-recipe-textarea" :value="uri + permalink" readonly />
                <button
                    type="button"
                    class="btn copy-to-clipboard-button"
                    :class="{
                        'btn-link': !copying_to_clipboard,
                        'btn-outline-success text-success border-success': copying_to_clipboard
                    }"
                    content="Copy to Clipboard"
                    v-tippy
                    @click.prevent="copyToClipboard"
                    :disabled="copying_to_clipboard"
                >
                    <div v-if="copying_to_clipboard">
                        <font-awesome-icon :icon="['fas', 'check']" fixed-width />
                    </div>
                    <div v-else>
                        <font-awesome-icon :icon="['fad', 'clipboard']" fixed-width />
                    </div>
                </button>
            </div> -->
        </b-modal>
    </div>
</template>

<script>
import copy from 'copy-html-to-clipboard'

export default {
    name: 'ShareRecipeModal',
    components: {

    },
    props: {
        value: Boolean,
        permalink: String
    },
    computed: {

    },
    methods: {
        copyToClipboard () {
            copy(this.permalink, {
                asHtml: false
            })

            // this.$swal({
            //     toast: true,
            //     icon: 'success',
            //     html: 'Copied to clipboard',
            //     position: 'top-end',
            //     showConfirmButton: false,
            //     timer: 3000,
            // })

            this.copying_to_clipboard = true

            setTimeout(() => {
                this.copying_to_clipboard = false
            }, 1500)
        },
        // modal event methods
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
        copying_to_clipboard: false
    }),
    mounted () {

    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/_colors';

.copy-to-clipboard-button {
    border: 1px solid #ced4da;
}

.copyable-link {
    word-break: break-all;
}
</style>
