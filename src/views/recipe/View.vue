<template>
    <div class="view-recipe">
        <div class="container">
            <Navbar />

            <template v-if="!resolved">
                <div class="spinner-grow" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </template>
            <template v-else>

                <Breadcrumb :breadcrumbItems="breadcrumbItems" />

                <div class="mb-5 pb-5">
                    <b-card no-body>
                        <b-card-header class="h5">
                            {{recipe.name}}
                        </b-card-header>
                        <b-card-body v-if="recipe.description">
                            <p class="card-text">{{recipe.description}}</p>
                        </b-card-body>
                        <b-card-footer :class="{'border-top-0': !recipe.description}" v-if="recipe.ingredients && recipe.ingredients.length || recipe.instructions && recipe.instructions.length || recipe.nutrition && recipe.nutrition.length">
                            <div class="d-flex">
                                <b-nav pills>
                                  <b-nav-item v-if="recipe.ingredients && recipe.ingredients.length" :active="showIngredientsTab" @click="toggleIngredientsTab()">Ingredients</b-nav-item>
                                  <b-nav-item v-if="recipe.instructions && recipe.instructions.length" :active="showInstructionsTab" @click="toggleInstructionsTab()">Instructions</b-nav-item>
                                  <b-nav-item v-if="recipe.nutrition && recipe.nutrition.length" :active="showNutritionTab" @click="toggleNutrutionTab()">Nutrition</b-nav-item>
                                </b-nav>
                            </div>
                        </b-card-footer>
                        <b-list-group flush v-if="showIngredientsTab">
                            <b-list-group-item v-for="ingredient in recipe.ingredients">
                                {{ingredient.amount}} {{ingredient.measurement}} <u>{{ingredient.ingredient}}</u>
                            </b-list-group-item>
                        </b-list-group>

                        <b-list-group flush v-if="showInstructionsTab">
                            <b-list-group-item v-for="(instruction, instructionIndex) in recipe.instructions">
                                {{instructionIndex + 1}}. {{instruction.instruction}}
                            </b-list-group-item>
                        </b-list-group>

                        <b-list-group flush v-if="showNutritionTab">
                            <b-list-group-item v-for="fact in recipe.nutrition">
                                <strong>{{fact.amount}}</strong> {{fact.fact}}
                            </b-list-group-item>
                        </b-list-group>
                    </b-card>

                    <template v-if="!commentsResolved">
                        <div class="spinner-grow" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </template>
                    <template v-else>
                        <b-card class="mt-3" no-body>
                            <b-card-body class="p-1">
                                <form @submit.prevent="addComment(recipe, comment)">
                                    <b-input-group>
                                        <b-form-textarea type="text" placeholder="Comment" v-model="comment" />
                                        <b-input-group-append v-if="comment">
                                            <b-button type="submit" variant="primary" :disabled="commenting">
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
                                <b-list-group-item v-for="comment in comments">
                                    <div class="d-flex">
                                        <div class="flex-grow-1 align-self-center mr-3">
                                            <template v-if="!commentEditable">
                                                <div>{{comment.comment}}</div>
                                            </template>
                                            <template v-else>
                                                <form @submit.prevent="saveEditedComment(comment)">
                                                    <b-input-group>
                                                        <b-form-textarea type="text" placeholder="Comment" v-model="comment.comment" />
                                                        <b-input-group-append v-if="commentChanges(comment)">
                                                            <b-button type="submit" variant="primary" :disabled="savingEditedComment">
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
                                            <div>
                                                <span class="text-muted"><small>{{comment.by.displayName}}</small> <vue-moments-ago prefix="" suffix="ago" :date="comment.created" lang="en"></vue-moments-ago></span>
                                            </div>
                                        </div>
                                        <div v-if="comment.by.uid == currentUser.uid" class="d-flex align-self-center ml-auto">
                                            <a href="#" class="text-primary" @click.prevent="editComment(comment)">
                                                <font-awesome-icon :icon="['far', 'edit']" fixed-width />
                                            </a>
                                            <a href="#" class="text-danger ml-2" @click.prevent="deleteComment(comment)">
                                                <font-awesome-icon :icon="['far', 'trash-alt']" fixed-width />
                                            </a>
                                        </div>
                                    </div>
                                </b-list-group-item>
                            </b-list-group>
                            <b-card-footer class="text-muted" v-if="!comments || comments && !comments.length">
                                no comments
                            </b-card-footer>
                        </b-card>
                    </template>

                </div>
            </template>

        </div>
    </div>
</template>

<script>
import firebase from 'firebase/app';
import VueMomentsAgo from 'vue-moments-ago';

// @ is an alias to /src
import Navbar from "@/components/Navbar.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";

export default {
    name: "view-recipe",
    components: {
        VueMomentsAgo,

        Navbar,
        Breadcrumb
    },
    props: ['recipe_key'],
    data() {
        return {
            comment: null,
            commenting: false,

            commentCache: {},

            commentEditable: false,
            savingEditedComment: false,

            showIngredientsTab: true,
            showInstructionsTab: false,
            showNutritionTab: false,

            resolved: false,
            commentsResolved: false
        }
    },
    firestore() {
        return {
            recipe: {
                ref: firebase.firestore().collection('test_recipes').doc(this.recipe_key),
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
            },
            comments: {
                ref: firebase.firestore().collection('test_recipes').doc(this.recipe_key).collection('comments'),
                resolve: () => {
                    this.commentsResolved = true;
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
        currentUser() {
            return firebase.auth().currentUser;
        },
        breadcrumbItems() {
            var breadcrumbItems = [];
            breadcrumbItems.push(
                {
                    text: 'Recipes',
                    to: {
                        name: 'home'
                    }
                },
                {
                    text: this.recipe.name,
                    active: true
                }
            );
            return breadcrumbItems;
        }
    },
    methods: {
        toggleIngredientsTab() {
            this.showIngredientsTab = true;
            this.showInstructionsTab = false;
            this.showNutritionTab = false;
        },
        toggleInstructionsTab() {
            this.showIngredientsTab = false;
            this.showInstructionsTab = true;
            this.showNutritionTab = false;
        },
        toggleNutrutionTab() {
            this.showIngredientsTab = false;
            this.showInstructionsTab = false;
            this.showNutritionTab = true;
        },

        addComment(recipe, comment) {
            var comments = firebase.firestore().collection('test_recipes').doc(this.recipe_key).collection('comments');

            const by = {
                displayName: this.currentUser.displayName,
                email: this.currentUser.email,
                uid: this.currentUser.uid
            }

            this.commenting = true;

            comments.add({comment: comment, by: by, created: this.moment().format("ddd, DD MMM YYYY HH:mm:ss ZZ")})
            .then(response => {
                this.commenting = false;
                this.comment = null;
            });
        },
        editComment(comment) {
            this.commentCache = _.cloneDeep(comment);
            this.commentEditable = true;
        },
        saveEditedComment(comment) {
            const commentRef = firebase.firestore().collection('test_recipes').doc(this.recipe_key).collection('comments').doc(comment['.key']);

            this.savingEditedComment = true;

            commentRef.update({
                comment: comment.comment
            }).then(response => {
                this.commentEditable = false;
                this.savingEditedComment = false;
            })
        },
        deleteComment(comment) {
            const commentRef = firebase.firestore().collection('test_recipes').doc(this.recipe_key).collection('comments').doc(comment['.key']);

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
                    commentRef.delete();
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
.img-thumbnail {
    height: 100px;
    width: 100px;
}
@media(max-width: 767px) {
    .img-thumbnail {
        height: 150px;
        width: 150px;
    }
}
</style>

<style lang="scss">

</style>
