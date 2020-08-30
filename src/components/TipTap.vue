<template>
    <div class="tiptap">
        <div v-if="editor_menu == 'bubble'">
            <editor-menu-bubble :editor="editor" :keep-in-bounds="true" v-slot="{ commands, isActive, menu }">
                <div
                    class="menububble"
                    :class="{ 'active': menu.isActive }"
                    :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
                >
                    <b-button-group>
                        <button
                            type="button"
                            class="menububble__button"
                            :class="{ 'active': isActive.bold() }"
                            @click="commands.bold"
                        >
                            <font-awesome-icon :icon="['fas', 'bold']" />
                        </button>
                        <button
                            type="button"
                            class="menububble__button"
                            :class="{ 'active': isActive.italic() }"
                            @click="commands.italic"
                        >
                            <font-awesome-icon :icon="['fas', 'italic']" />
                        </button>
                        <button
                            type="button"
                            class="menububble__button"
                            :class="{ 'active': isActive.underline() }"
                            @click="commands.underline"
                        >
                            <font-awesome-icon :icon="['fas', 'underline']" />
                        </button>
                        <button
                            type="button"
                            class="menububble__button"
                            :class="{ 'active': isActive.heading({ level: 4 }) }"
                            @click="commands.heading({ level: 4 })"
                        >
                            <font-awesome-icon :icon="['fas', 'heading']" />
                        </button>
                        <button
                            type="button"
                            class="menububble__button"
                            :class="{ 'active': isActive.bullet_list() }"
                            @click="commands.bullet_list"
                        >
                            <font-awesome-icon :icon="['fas', 'list-ul']" />
                        </button>
                        <button
                            type="button"
                            class="menububble__button"
                            :class="{ 'active': isActive.ordered_list() }"
                            @click="commands.ordered_list"
                        >
                            <font-awesome-icon :icon="['fas', 'list-ol']" />
                        </button>
                    </b-button-group>
                </div>
            </editor-menu-bubble>
        </div>
        <div v-else>
            <editor-menu-bar
                :editor="editor"
                v-slot="{ commands, isActive }"
                class="mb-1 editor-menu-bar"
            >
                <div>
                    <b-button-group>
                        <b-button
                            :class="{ 'active': isActive.bold() }"
                            variant="light"
                            @click="commands.bold"
                        >
                            <font-awesome-icon :icon="['fas', 'bold']" />
                        </b-button>
                        <b-button
                            :class="{ 'active': isActive.italic() }"
                            variant="light"
                            @click="commands.italic"
                        >
                            <font-awesome-icon :icon="['fas', 'italic']" />
                        </b-button>
                        <b-button
                            :class="{ 'active': isActive.underline() }"
                            variant="light"
                            @click="commands.underline"
                        >
                            <font-awesome-icon :icon="['fas', 'underline']" />
                        </b-button>
                        <b-button
                            :class="{ 'active': isActive.heading({ level: 4 }) }"
                            variant="light"
                            @click="commands.heading({ level: 4 })"
                        >
                            <font-awesome-icon :icon="['fas', 'heading']" />
                        </b-button>
                        <!-- <b-dropdown variant="light">
                            <template v-slot:button-content>
                                <font-awesome-icon :icon="['fas', 'heading']" />
                            </template>
                            <b-dropdown-item
                                :active="isActive.heading({ level: 1 })"
                                @click="commands.heading({ level: 1 })"
                            >
                                <font-awesome-icon :icon="['fas', 'h1']" fixed-width />
                            </b-dropdown-item>
                            <b-dropdown-item
                                :active="isActive.heading({ level: 2 })"
                                @click="commands.heading({ level: 2 })"
                            >
                                <font-awesome-icon :icon="['fas', 'h2']" fixed-width />
                            </b-dropdown-item>
                            <b-dropdown-item
                                :active="isActive.heading({ level: 3 })"
                                @click="commands.heading({ level: 3 })"
                            >
                                <font-awesome-icon :icon="['fas', 'h3']" fixed-width />
                            </b-dropdown-item>
                            <b-dropdown-item
                                :active="isActive.heading({ level: 4 })"
                                @click="commands.heading({ level: 4 })"
                            >
                                <font-awesome-icon :icon="['fas', 'h4']" fixed-width />
                            </b-dropdown-item>
                        </b-dropdown> -->
                        <b-button
                            :class="{ 'active': isActive.bullet_list() }"
                            variant="light"
                            @click="commands.bullet_list"
                        >
                            <font-awesome-icon :icon="['fas', 'list-ul']" />
                        </b-button>
                        <b-button
                            :class="{ 'active': isActive.ordered_list() }"
                            variant="light"
                            @click="commands.ordered_list"
                        >
                            <font-awesome-icon :icon="['fas', 'list-ol']" />
                        </b-button>
                        <b-button
                            variant="light"
                            @click="commands.undo"
                        >
                            <font-awesome-icon :icon="['fas', 'undo']" />
                        </b-button>
                        <b-button
                            variant="light"
                            @click="commands.redo"
                        >
                            <font-awesome-icon :icon="['fas', 'redo']" />
                        </b-button>
                    </b-button-group>
                </div>
            </editor-menu-bar>
        </div>

        <editor-content
            :editor="editor"
            class="editor-content form-control"
            :class="{

            }"
        />
    </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar, EditorMenuBubble } from 'tiptap'
import {
    Bold,
    Heading,
    OrderedList,
    BulletList,
    ListItem,
    Placeholder,
    Italic,
    Underline,
    History,
} from 'tiptap-extensions'

export default {
    name: 'TipTap',
    data: () => ({
        editor: null
    }),
    components: {
        EditorMenuBar,
        EditorMenuBubble,
        EditorContent
    },
    props: {
        value: String,
        content: String,
        editor_menu: String,
        placeholder: String,
        autoFocus: Boolean
    },
    computed: {
        // autoFocus () {
        //     let autoFocus = null
        //
        //     console.log(this.focus)
        //     if (!this.focus || (this.focus && this.focus == false)) {
        //         autoFocus = false
        //     } else {
        //         autoFocus = true
        //     }
        //
        //     return autoFocus
        // }
    },
    mounted () {
        this.editor = new Editor({
            extensions: [
                new BulletList(),
                new Heading({ levels: [1, 2, 3, 4] }),
                new ListItem(),
                new OrderedList(),
                new Placeholder({
                    emptyEditorClass: 'is-editor-empty',
                    emptyNodeClass: 'is-empty',
                    emptyNodeText: this.placeholder ? this.placeholder : '',
                    showOnlyWhenEditable: true,
                    showOnlyCurrent: true,
                }),
                new Bold(),
                new Italic(),
                new Underline(),
                new History()
            ],
            autoFocus: this.autoFocus,
            onUpdate: ({ getHTML }) => {
                const html = getHTML()
                // const json = getJSON()

                this.$emit('input', html)
            }
        })

        if (this.value) {
            this.editor.setContent(this.value)
            // this.editor.autoFocus = true
        }
    },
    beforeDestroy () {
        this.editor.destroy()
    },
}
</script>

<style lang="scss">
@import '@/assets/css/_colors';

.tiptap {
	// .editor-content {
	// 	// border: 1px solid #dee2e6;
	// }
    p.is-editor-empty:first-child::before {
        content: attr(data-empty-text);
        float: left;
        color: #bbb;
        pointer-events: none;
        height: 0;
    }
	&.is-invalid {
		.editor-content {
			border: 1px solid $danger;
		}
	}
	.menububble {
		position: absolute;
		display: -webkit-box;
		display: flex;
		z-index: 20;
		background: #000;
		border-radius: 5px;
		padding: .3rem;
		margin-bottom: .5rem;
		-webkit-transform: translateX(-50%);
		transform: translateX(-50%);
		visibility: hidden;
		opacity: 0;
		-webkit-transition: opacity .2s,visibility .2s;
		transition: opacity .2s,visibility .2s;
		&.active {
			opacity: 1;
			visibility: visible;
		}
	}
	.menububble__button {
		display: -webkit-inline-box;
		display: inline-flex;
		background: transparent;
		border: 0;
		color: #fff;
		padding: .2rem .5rem;
		margin-right: .2rem;
		border-radius: 3px;
		cursor: pointer;
		&.active {
			background-color: hsla(0, 0, 100%, .2);
		}
	}
}

.editor-content {
    &.form-control {
        padding: 0;
    }
}

.ProseMirror {
    padding: 1rem;
	> * {
		margin: 0;
	}
	> * + * {
		margin-top: 1rem;
	}
    li:last-child {
        p {
            margin: 0;
        }
    }
}

@media (max-width: 767px) {
    .tiptap {
        .editor-menu-bar {
            .btn {
                padding: 0.25rem 0.5rem;
                font-size: 0.875rem;
                border-radius: 0.2rem;
            }
        }
    }
}
</style>
