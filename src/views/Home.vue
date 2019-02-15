<template>
    <div class="home">
        <div class="container">
            <Navbar />

            <template v-if="!resolved">
                <div class="spinner-grow" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </template>
            <template v-else>
                <Breadcrumb :breadcrumbItems="breadcrumbItems" />

                <div class="d-lg-flex mb-3">
                    <div class="mr-3 mb-lg-0 mb-3" v-if="user && user.uid">
                        <b-button :to="{name: 'create-recipe'}" variant="outline-success">
                            Create Recipe
                        </b-button>
                    </div>
                    <div v-if="recipes && recipes.length" class="flex-grow-1 mb-lg-0 mb-3 ml-lg-auto">
                        <b-form-input type="text" v-model="search" placeholder="Search" />
                    </div>
                </div>
                <div v-if="filteredRecipes && filteredRecipes.length">
                    <template v-for="(recipe, recipeIndex) in filteredRecipes">
                        <b-card no-body class="mb-3">
                            <b-card-header class="h6 d-flex">
                                <div class="align-self-center mr-3">
                                    <router-link :to="{name: 'view-recipe', params: {recipe_key: recipe['.key']}}">{{recipe.name}}</router-link>
                                </div>
                                <div class="align-self-center ml-auto">
                                    <div class="d-flex">
                                        <a href="#" v-if="recipe.time && recipe.time.total" :title="recipe.time.total + ' minutes'" v-b-tooltip.hover :class="{'text-success': recipe.time.total >= 10, 'text-warning': (recipe.time.total > 10 && recipe.time.total <= 30), 'text-danger': recipe.time.total > 30}" @click.prevent>
                                            <font-awesome-icon :icon="['far', 'stopwatch']" fixed-width />
                                        </a>
                                        <div v-if="(recipe.created_by && recipe.created_by.uid) && (user && user.uid) && recipe.created_by.uid == user.uid">
                                            <a href="#" class="text-secondary ml-3" @click.prevent="editRecipe(recipe)">
                                                <font-awesome-icon :icon="['far', 'pen']" />
                                            </a>
                                            <a href="#" class="text-secondary ml-3" @click.prevent="deleteRecipe(recipe)">
                                                <font-awesome-icon :icon="['far', 'trash-alt']" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </b-card-header>
                            <b-card-body v-if="recipe.description">
                                <p class="card-text text-muted">{{recipe.description}}</p>
                            </b-card-body>
                            <b-card-footer :class="{'border-top-0': !recipe.description}">
                                <small class="text-muted">
                                    <template v-if="recipe.created_by && recipe.created_by.displayName">{{recipe.created_by.displayName}}</template><template v-if="recipe.created_by && recipe.created_by.email && !recipe.created_by.displayName">{{recipe.created_by.email}}</template> <template v-if="recipe.created && recipe.created.date_time"> &middot; {{moment(recipe.created.date_time).fromNow()}}</template>
                                </small>
                            </b-card-footer>
                        </b-card>
                    </template>
                </div>
                <b-alert variant="warning" :show="(recipes && recipes.length) && (!filteredRecipes || filteredRecipes && !filteredRecipes.length)">
                    0 recipes match your search
                </b-alert>

                <b-alert variant="danger" :show="!recipes || recipes && !recipes.length">
                    0 recipes
                </b-alert>
            </template>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

import firebase from 'firebase/app'

// @ is an alias to /src
import Navbar from '@/components/Navbar.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'

export default {
    name: "home",
    components: {
        Navbar,
        Breadcrumb
    },
    data() {
        return {
            breadcrumbItems: [
                {
                    text: 'Recipes',
                    active: true
                }
            ],

            search: null,

            resolved: false
        }
    },
    firestore() {
        return {
            recipes: {
                ref: firebase.firestore().collection('recipes'),
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
        }
    },
    computed: {
        ...mapState(['user']),
        filteredRecipes () {
            if(!this.search) return _.orderBy(this.recipes, 'created.date_time', 'desc');

            return this.recipes.filter(recipe => {
                if(recipe.name) {
                    if(_.includes(recipe.name.toLowerCase(), this.search.toLowerCase())) {
                        return recipe
                    }
                }
                if(recipe.created_by) {
                    if(_.includes(recipe.created_by.email.toLowerCase(), this.search.toLowerCase())) {
                        return recipe
                    }
                    else if(_.includes(recipe.created_by.displayName.toLowerCase(), this.search.toLowerCase())) {
                        return recipe
                    }
                }
                if(recipe.types) {
                    _.forEach(recipe.types, type => {
                        if(_.includes(type.toLowerCase(), this.search.toLowerCase())) {
                            return recipe
                        }
                    })
                }
            })
        }
    },
    methods: {
        editRecipe (recipe) {
            if((recipe.created_by && recipe.created_by.uid) && (this.user && this.user.uid) && recipe.created_by.uid == this.user.uid) {
                this.$router.push({name: 'edit-recipe', params: {recipe_key: recipe['.key']}});
            } else if(!recipe.created_by || recipe.created_by !== this.currentUser.uid) {
                this.$swal({
                    toast: true,
                    html: "You do not have priviledges to edit this recipe",
                    type: "error",
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 5000
                });
            }
        },
        deleteRecipe (recipe) {
            if((recipe.created_by && recipe.created_by.uid) && (this.user && this.user.uid) && recipe.created_by.uid == this.user.uid) {
                this.$swal({
                    html: 'Are you sure you want to delete "' + recipe.name + '"?',
                    showCancelButton: true,
                    confirmButtonText: 'Delete',
                    confirmButtonClass: 'btn btn-danger',
                    cancelButtonText: 'Cancel',
                    cancelButtonClass: 'btn btn-light',
                    buttonsStyling: false,
                    reverseButtons: true
                }).then((willDeleteRecipe) => {
                    if (willDeleteRecipe.value) {
                        firebase.firestore().collection('recipes').doc(recipe['.key']).delete();
                    }
                });
            } else if(!this.user || !recipe.created_by || ((this.user && this.user.uid) && (recipe.created_by && recipe.created_by.uid) && recipe.created_by.uid !== this.user.uid)) {
                this.$swal({
                    toast: true,
                    html: "You do not have priviledges to delete this recipe",
                    type: "error",
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 5000
                });

            }
        },
        // favoriteRecipe(recipe) {
        //     if(this.currentUser && this.currentUser.uid) {
        //         const usersCollection = firebase.firestore().collection('users');
        //
        //         const userQuery = usersCollection.where("uid", "==", this.currentUser.uid);
        //
        //         userQuery.get().then((snapshot) => {
        //             if(snapshot.docs && snapshot.docs.length) {
        //                 var user = null;
        //
        //                 _.forEach(snapshot.docs, doc => {
        //                     user = usersCollection.doc(doc.id);
        //                 })
        //
        //                 user.update({
        //                     favorites: firebase.firestore.FieldValue.arrayUnion(recipe['.key'])
        //                 });
        //             }
        //         });
        //     }
        // },
        // unfavoriteRecipe(recipe) {
        //     if(this.currentUser && this.currentUser.uid) {
        //         const usersCollection = firebase.firestore().collection('users');
        //
        //         const userQuery = usersCollection.where("uid", "==", this.currentUser.uid);
        //
        //         userQuery.get().then((snapshot) => {
        //             if(snapshot.docs && snapshot.docs.length) {
        //                 var user = null;
        //
        //                 _.forEach(snapshot.docs, doc => {
        //                     user = usersCollection.doc(doc.id);
        //                 })
        //
        //                 user.update({
        //                     favorites: firebase.firestore.FieldValue.arrayRemove(recipe['.key'])
        //                 });
        //             }
        //         });
        //     }
        // },
        // recipeFavorited(recipe) {
        //     var favorited = false;
        //     _.forEach(this.users, user => {
        //         if(user.uid == this.currentUser.uid) {
        //             _.forEach(user.favorites, favorite => {
        //                 if(favorite == recipe['.key']) {
        //                     favorited = true;
        //                 }
        //             })
        //         }
        //     });
        //     return favorited;
        // }
    }
};
</script>
