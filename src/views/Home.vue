<template>
    <div class="home">
        <div class="container">
            <Navbar />

            <template v-if="loadingRecipes">
                <div class="spinner-grow" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </template>
            <template v-else>
                <Breadcrumb :breadcrumbItems="breadcrumbItems" />

                <div class="d-lg-flex mb-3">
                    <div v-if="currentUser && currentUser.uid" class="mr-3 mb-lg-0 mb-3">
                        <router-link :to="{name: 'create-recipe'}" class="btn btn-outline-success">
                            Create Recipe
                        </router-link>
                    </div>
                    <div v-if="recipes && recipes.length" class="flex-grow-1 mb-lg-0 mb-3 ml-lg-auto">
                        <input type="text" class="form-control" placeholder="Search" v-model="search">
                    </div>
                </div>
                <div v-if="filteredRecipes && filteredRecipes.length">

                    <b-card header-tag="header" footer-tag="footer" :class="{'mb-3': recipeIndex + 1 < filteredRecipes.length}" v-for="(recipe, recipeIndex) in filteredRecipes">
                        <h6 slot="header" class="d-flex mb-0">
                            <div class="align-self-center mr-3">
                                <router-link :to="{name: 'view-recipe', params: {recipe_key: recipe['.key']}}">{{recipe.name}}</router-link>
                            </div>
                            <div class="align-self-center ml-auto">
                                <div class="d-flex">
                                    <div v-if="currentUser && currentUser.uid && (recipe.created_by && recipe.created_by.uid == currentUser.uid)">
                                        <a href="#" class="text-secondary" @click.prevent="editRecipe(recipe)">
                                            <font-awesome-icon :icon="['far', 'pen']" fixed-width />
                                        </a>
                                    </div>
                                    <div v-if="currentUser && currentUser.uid && (recipe.created_by && recipe.created_by.uid == currentUser.uid)" class="ml-2">
                                        <a href="#" class="text-secondary" @click.prevent="deleteRecipe(recipe)">
                                            <font-awesome-icon :icon="['far', 'trash-alt']" fixed-width />
                                        </a>
                                    </div>
                                    <div v-if="currentUser && currentUser.uid" class="ml-2">
                                        <a href="#" class="text-danger" @click.prevent="unfavoriteRecipe(recipe)" v-if="recipeFavorited(recipe)">
                                            <font-awesome-icon :icon="['fas', 'heart']" fixed-width />
                                        </a>
                                        <a href="#" class="text-danger" @click.prevent="favoriteRecipe(recipe)" v-else>
                                            <font-awesome-icon :icon="['far', 'heart']" fixed-width />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </h6>
                        <p class="card-text" v-if="recipe.description">{{recipe.description}}</p>
                        <div slot="footer">
                            <small class="text-muted">created by <template v-if="recipe.created_by && recipe.created_by.displayName">{{recipe.created_by.displayName}}</template><template v-if="recipe.created_by && recipe.created_by.email && !recipe.created_by.displayName">{{recipe.created_by.email}}</template> on <template v-if="recipe.created && recipe.created.date">{{recipe.created.date}}</template></small>
                        </div>
                    </b-card>
                </div>

                <b-alert variant="warning" :show="!filteredRecipes || filteredRecipes && !filteredRecipes.length">
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
import firebase from 'firebase/app';

// @ is an alias to /src
import Navbar from "@/components/Navbar.vue";
import Breadcrumb from "@/components/Breadcrumb.vue";

export default {
    name: "home",
    components: {
        Navbar,
        Breadcrumb
    },
    data() {
        return {
            recipes: [],

            breadcrumbItems: [
                {
                    text: 'Recipes',
                    active: true
                }
            ],

            search: null,

            loadingRecipes: true
        }
    },
    firestore() {
        return {
            recipes: firebase.firestore().collection('recipes'),
        }
    },
    watch: {
        filteredRecipes(recipes) {
            if(recipes && recipes.length) {
                this.loadingRecipes = false;
            }
        }
    },
    computed: {
        currentUser() {
            return firebase.auth().currentUser;
        },
        filteredRecipes() {
            var filteredRecipes = [];
            if(this.search) {
                return this.recipes.filter(recipe => {
                    var search = this.search.toLowerCase();

                    if(recipe.name) {
                        var nameMatch = true ? (this.search === '' || recipe.name.toLowerCase().indexOf(search) > -1) : false;
                    }

                    if(recipe.created_by && recipe.created_by.email) {
                        var emailMatch = true ? (this.search === '' || recipe.created_by.email.toLowerCase().indexOf(search) > -1) : false;
                    }

                    if(recipe.created_by && recipe.created_by.displayName) {
                        var displayNameMatch = true ? (this.search === '' || recipe.created_by.displayName.toLowerCase().indexOf(search) > -1) : false;
                    }

                    if(recipe.types) {
                        var typeMatch = false;
                        var typeMatches = recipe.types.filter(type => {
                            if(type.indexOf(this.search) > -1) {
                                return type;
                            }
                        });
                        var typeMatch = true ? (this.search === '' || typeMatches.length) : false;
                    }

                    if(recipe.name && !recipe.types && !recipe.created_by) {
                        return nameMatch;
                    } else if(recipe.name && recipe.types && !recipe.created_by) {
                        return nameMatch || typeMatch;
                    } else if(recipe.name && recipe.types && recipe.created_by) {
                        return nameMatch || emailMatch || displayNameMatch || typeMatch;
                    }
                });
            } else {
                filteredRecipes = _.orderBy(this.recipes, 'created');
            }
            return _.orderBy(filteredRecipes, 'created');
        }
    },
    methods: {
        editRecipe(recipe) {
            if((recipe.created_by && recipe.created_by.uid) && (this.currentUser && this.currentUser.uid) && recipe.created_by.uid == this.currentUser.uid) {
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
        deleteRecipe(recipe) {
            if((recipe.created_by && recipe.created_by.uid) && (this.currentUser && this.currentUser.uid) && recipe.created_by.uid == this.currentUser.uid) {
                this.$swal({
                    html: 'Are you sure you want to delete this recipe?',
                    showCancelButton: true,
                    confirmButtonText: 'Delete Recipe',
                    confirmButtonClass: 'btn btn-danger',
                    cancelButtonText: 'Cancel',
                    cancelButtonClass: 'btn btn-light',
                    buttonsStyling: false,
                    reverseButtons: true
                }).then((willDeleteRecipe) => {
                    if (willDeleteRecipe.value) {
                        firebase.firestore().collection('recipes').doc(recipe['.key']).delete();

                        if(recipe.name) {
                            var message = recipe.name + ' deleted';
                        } else {
                            var message = 'Recipe deleted';
                        }

                        this.$swal({
                            toast: true,
                            html: message,
                            type: 'success',
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 5000
                        });
                    }
                });
            } else if(!this.currentUser || !recipe.created_by || (this.currentUser && this.currentUser.uid) && (recipe.created_by && recipe.created_by.uid) && recipe.created_by.uid !== this.currentUser.uid) {
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
        favoriteRecipe(recipe) {
            if(this.currentUser) {
                let ref = firebase.firestore().collection('recipes').doc(recipe['.key']);

                var snapshot = {};

                ref.get().then(snapshot => {
                    if (snapshot.exists) {
                        snapshot = snapshot;

                        firebase.firestore().runTransaction(transaction => {
                            return transaction.get(ref).then(snapshot => {

                                const favorited_by = snapshot.get('favorited_by');

                                favorited_by.push(
                                    {
                                        uid: this.currentUser.uid,
                                        email: this.currentUser.email
                                    }
                                );

                                transaction.update(ref, 'favorited_by', favorited_by);
                            });
                        }).then(response => {
                            // recipe favorited
                        })
                        .catch(error => {
                            this.$swal("Error", error.message, "error");
                        });
                    } else {
                        console.log("No such document exists!");
                    }
                });
            }
        },
        unfavoriteRecipe(recipe) {
            if(this.currentUser) {
                let ref = firebase.firestore().collection('recipes').doc(recipe['.key']);

                var snapshot = {};

                ref.get().then(snapshot => {
                    if (snapshot.exists) {
                        snapshot = snapshot;

                        firebase.firestore().runTransaction(transaction => {
                            return transaction.get(ref).then(snapshot => {

                                const favorited_by = snapshot.get('favorited_by');

                                const index = _.findIndex(favorited_by, {uid: this.currentUser.uid});

                                favorited_by.splice(index, 1);

                                transaction.update(ref, 'favorited_by', favorited_by);
                            });
                        }).then(response => {
                            // recipe unfavorited
                        })
                        .catch(error => {
                            this.$swal("Error", error.message, "error");
                        });
                    } else {
                        console.log("No such document exists!");
                    }
                });
            }
        },
        recipeFavorited(recipe) {
            var favorited = false;
            if(this.currentUser && this.currentUser.uid) {
                if(_.find(recipe.favorited_by, {uid: this.currentUser.uid})) {
                    favorited = true;
                }
            }
            return favorited;
        }
    }
};
</script>

<style scoped>
.img-thumbnail {
    height: 75px;
    width: 75px;
    min-width: 75px;
    min-height: 75px;
}
/* .badge + .badge {
    margin-top: .25rem;
} */
/* .edit-recipe-button {
    border-top-left-radius: 0;
}
.delete-recipe-button {
    border-bottom-left-radius: 0;
}
.list-group-item.has-actions {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
} */
</style>
