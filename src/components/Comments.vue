<template>
    <div>
        <template v-if="!resolved">
            <div class="spinner-grow" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </template>
        <template v-else>
            <b-card class="rounded" no-body>
                <b-card-body class="p-0 border-0">
                    <form @submit.prevent="addComment(recipe, comment)">
                        <b-input-group>
                            <b-form-input type="text" placeholder="Comment" class="border-0" v-model="comment" />
                            <b-input-group-append v-if="comment">
                                <b-button id="send-button" type="submit" class="send-button" variant="outline-primary" :disabled="commenting">
                                    <template v-if="commenting">
                                        <div class="spinner-border spinner-border-sm" role="status"><span class="sr-only">Loading...</span></div>
                                    </template>
                                    <template v-else>
                                        Add Comment
                                    </template>
                                </b-button>
                            </b-input-group-append>
                        </b-input-group>
                    </form>
                </b-card-body>
                <b-list-group v-if="comments && comments.length" flush>
                    <b-list-group-item v-for="comment in orderedComments">
                        <div class="d-flex">
                            <div class="flex-grow-1 align-self-center mr-3">
                                <template v-if="!comment.editable">
                                    <div>{{comment.comment}}</div>
                                </template>
                                <template v-else>
                                    <form @submit.prevent="saveEditedComment(comment)">
                                        <b-input-group>
                                            <b-form-textarea type="text" size="sm" placeholder="Comment" v-model="comment.comment" />
                                            <b-input-group-append>
                                                <b-button type="button" size="sm" variant="danger" @click.prevent="cancelEditComment(comment)">
                                                    Cancel
                                                </b-button>
                                                <b-button type="submit" size="sm" variant="primary" v-if="commentChanges(comment)" :disabled="savingEditedComment">
                                                    <template v-if="savingEditedComment">
                                                        <div class="spinner-border spinner-border-sm" role="status"><span class="sr-only">Loading...</span></div>
                                                    </template>
                                                    <template v-else>
                                                        Save Changes
                                                    </template>
                                                </b-button>
                                            </b-input-group-append>
                                        </b-input-group>
                                    </form>
                                </template>
                                <div v-if="!comment.editable">
                                    <span class="text-muted">
                                        <small>
                                            <span v-if="comment.user && comment.user.displayName">{{comment.user.displayName}}</span><span v-else>{{comment.user.email}}</span><span v-if="comment.created"> <span v-if="comment.user.displayName || comment.user.email"> &middot; </span> {{moment(comment.created).fromNow()}} </span><span v-if="comment.edited">&middot; <span class="text-muted" title="Edited" v-b-tooltip.hover><font-awesome-icon :icon="['far', 'user-edit']" fixed-width /></span></span>
                                        </small>
                                    </span>
                                </div>
                            </div>
                            <div class="d-flex align-self-center ml-auto">
                                <a href="#" @click.prevent="editComment(comment)" v-if="((comment.user && comment.user.uid) && (user && user.uid) && comment.user.uid == user.uid)" :disabled="comment.editable">
                                    <font-awesome-icon :icon="['far', 'edit']" fixed-width />
                                </a>
                                <a href="#" class="text-danger ml-2" v-if="((comment.user && comment.user.uid) && (user && user.uid) && comment.user.uid == user.uid) || ((user && user.uid) && (recipe.created_by && recipe.created_by.uid) && recipe.created_by.uid == user.uid)" @click.prevent="deleteComment(comment)">
                                    <font-awesome-icon :icon="['far', 'trash-alt']" fixed-width />
                                </a>
                            </div>
                        </div>
                    </b-list-group-item>
                </b-list-group>
                <b-card-footer v-if="!comments || comments && !comments.length">
                    <small class="text-warning">0 comments</small>
                </b-card-footer>
            </b-card>
        </template>
    </div>
</template>

<script>
import { mapState } from 'vuex'

import firebase from 'firebase/app'

export default {
    name: "comments",
    props: ['recipe_key'],
    data() {
        return {
            comment: null,
            commenting: false,

            commentCache: {},

            savingEditedComment: false,

            resolved: false
        }
    },
    firestore() {
        return {
            comments: {
                ref: firebase.firestore().collection('recipes').doc(this.recipe_key).collection('comments'),
                resolve: () => {
                    this.resolved = true;
                },
                reject: (error) => {
                    this.$swal({
                        toast: true,
                        html: error.message,
                        type: 'error',
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 5000
                    });
                }
            }
        }
    },
    computed: {
        ...mapState(['user']),
        orderedComments() {
            return _.orderBy(this.comments, 'created', 'desc');
        }
    },
    methods: {
        addComment(recipe, comment) {
            var comments = firebase.firestore().collection('recipes').doc(this.recipe_key).collection('comments');

            var user = null;

            if(this.user && this.user.uid) {
                user = {
                    displayName: this.user.displayName,
                    email: this.user.email,
                    uid: this.user.uid
                }
            }

            this.commenting = true;
            this.comment = null;

            comments.add({comment: comment, user: user, created: this.moment().format("ddd, DD MMM YYYY HH:mm:ss ZZ")})
            .then(response => {
                this.commenting = false;
            });
        },
        editComment(comment) {
            this.commentCache = _.cloneDeep(comment);
            this.$set(comment, 'editable', true);
        },
        cancelEditComment(comment) {
            this.commentCache = {};
            this.$set(comment, 'editable', false);
        },
        saveEditedComment(comment) {
            const commentRef = firebase.firestore().collection('recipes').doc(this.recipe_key).collection('comments').doc(comment['.key']);

            this.savingEditedComment = true;

            commentRef.update({
                comment: comment.comment,
                edited: true
            }).then(response => {
                this.$set(comment, 'editable', false);
                this.commentCache = {};

                this.savingEditedComment = false;
            })
        },
        deleteComment(commentRef) {
            const comment = firebase.firestore().collection('recipes').doc(this.recipe_key).collection('comments').doc(commentRef['.key']);

            this.$swal({
                html: 'Are you sure you want to delete this comment?',
                showCancelButton: true,
                confirmButtonText: 'Delete',
                confirmButtonClass: 'btn btn-danger',
                cancelButtonText: 'Cancel',
                cancelButtonClass: 'btn btn-light',
                buttonsStyling: false,
                reverseButtons: true
            }).then((willDeleteComment) => {
                if (willDeleteComment.value) {
                    comment.delete();
                }
            });
        },
        commentChanges(comment) {
            if(!_.isEqual(comment.comment, this.commentCache.comment)) {
                return true;
            } else {
                return false;
            }
        }
    }
};
</script>

<style scoped>
.send-button {
    border-bottom-left-radius: 0;
    border-bottom-right-radius:  0;
}
</style>
