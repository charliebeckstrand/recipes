<template>
    <div class="home">
        <div class="container">
            <Navbar />

            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item active" aria-current="page">Recipes</li>
                </ol>
            </nav>

            <template v-if="loadingRecipes">
                <content-placeholders>
                    <content-placeholders-text :lines="5" />
                </content-placeholders>
            </template>
            <template v-else>
                <template v-if="user">
                    <div class="mb-3">
                        <router-link :to="{name: 'create-recipe'}" class="btn btn-outline-success">
                            Create Recipe
                        </router-link>
                    </div>
                </template>

                <div class="mb-3" v-if="recipes && recipes.length">
                    <input type="text" class="form-control" placeholder="Search" v-model="search">
                </div>

                <div class="list-group" v-if="filteredRecipes && filteredRecipes.length">
                    <div v-for="(recipe, recipeIndex) in filteredRecipes" class="list-group-item" :class="{'has-actions': user && user.uid && user.uid == recipe.created_by}">
                        <div class="d-flex align-items-center">
                            <div class="d-sm-flex d-none img-thumbnail" v-if="recipe.thumbnail">
                                <img :src="recipe.thumbnail" class="img-fluid rounded my-auto">
                            </div>
                            <div class="flex-grow-1" :class="{'ml-sm-3 ml-0': recipe.thumbnail, 'mr-3': user && user.uid && user.uid == recipe.created_by}">
                                <h5 class="mb-1 text-capitalize mr-lg-0 mr-auto">
                                    <router-link :to="{name: 'view-recipe', params: {recipe_key: recipe['.key']}}">{{recipe.name}}</router-link>
                                </h5>

                                <p class="text-muted mb-1 d-md-block d-none" v-if="recipe.description">
                                    {{recipe.description}}
                                </p>

                                <div class="d-flex flex-md-row flex-column">
                                    <div v-if="recipe.created_by_display_name">
                                        <span class="badge badge-info">{{recipe.created_by_display_name}}</span>
                                    </div>
                                    <div class="d-flex">
                                        <div v-if="recipe.types" :class="{'ml-md-1': recipe.created_by_display_name}">
                                            <span v-if="recipe.types.length < 3" class="badge badge-secondary" v-for="type in recipe.types">
                                                {{type}}
                                            </span>
                                            <span v-if="recipe.types.length >= 3" class="badge badge-secondary cursor-pointer" v-tippy="{placement: 'bottom', html: '#types', arrow: true, theme: 'light', hideOnClick: false, delay: [100, 0]}">
                                                {{recipe.types.length}} types
                                                <div id="types" class="d-none">
                                                    <span v-for="(type, typeIndex) in recipe.types">{{type}}<span v-if="typeIndex + 1 < recipe.types.length">, </span></span>
                                                </div>
                                            </span>
                                        </div>
                                        <div class="ml-1" v-if="recipe.total_time">
                                            <span class="badge" :class="{'badge-success': recipe.total_time < 10, 'badge-warning': recipe.total_time >= 10 && recipe.total_time < 30, 'badge-danger': recipe.total_time >= 30}">{{recipe.total_time}} minutes</span>
                                        </div>
                                    </div>
                                    <!-- <div class="ml-1">
                                        <span class="badge badge-light">{{recipe.created_date}}</span>
                                    </div> -->
                                </div>
                            </div>
                            <div :class="{'mr-3': user && user.uid && user.uid == recipe.created_by}" v-if="user && user.uid">
                                <a href="#" class="text-danger" @click.prevent="unfavoriteRecipe(recipe)" v-if="recipeFavorited(recipe)">
                                    <font-awesome-icon :icon="['fas', 'heart']" />
                                </a>
                                <a href="#" class="text-danger" @click.prevent="favoriteRecipe(recipe)" v-else>
                                    <font-awesome-icon :icon="['far', 'heart']" />
                                </a>
                            </div>
                            <template v-if="user && user.uid && user.uid == recipe.created_by">
                                <div class="btn-group ml-auto">
                                    <button type="button" class="edit-recipe-button btn btn-sm btn-outline-primary" :class="{'h-50': recipe.created_by && recipe.created_by == user.uid, 'h-100': !recipe.created_by || recipe.created_by && recipe.created_by !== user.uid}" @click.prevent="editRecipe(recipe)">
                                        <font-awesome-icon :icon="['far', 'edit']" fixed-width />
                                    </button>
                                    <button type="button" class="delete-recipe-button btn btn-sm btn-outline-danger h-50" @click.prevent="deleteRecipe(recipe)">
                                        <font-awesome-icon :icon="['far', 'trash']" fixed-width />
                                    </button>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>

                <div class="alert bg-warning text-white" v-if="!filteredRecipes || filteredRecipes && !filteredRecipes.length">
                    0 recipes match your search
                </div>
                <div class="alert bg-danger text-white" v-if="!recipes || recipes && !recipes.length">
                    0 recipes
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase/app';

// @ is an alias to /src
import Navbar from "@/components/Navbar.vue";

export default {
    name: "home",
    components: {
        Navbar
    },
    data() {
        return {
            recipes: [],

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
        user() {
            return this.$store.state.user;
        },
        filteredRecipes() {
            var filteredRecipes = [];
            if(this.search) {
                return this.recipes.filter(recipe => {
                    var search = this.search.toLowerCase();

                    if(recipe.name) {
                        var nameMatch = true ? (this.search === '' || recipe.name.toLowerCase().indexOf(search) > -1) : false;
                    }
                    if(recipe.created_by_display_name) {
                        var displayNameMatch = true ? (this.search === '' || recipe.created_by_display_name.toLowerCase().indexOf(search) > -1) : false;
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

                    if(recipe.name && recipe.created_by_display_name && recipe.types) {
                        return nameMatch || displayNameMatch || typeMatch;
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
            if(recipe.created_by && this.user && recipe.created_by == this.user.uid) {
                this.$router.push({name: 'edit-recipe', params: {recipe_key: recipe['.key']}});
            } else if(!recipe.created_by || recipe.created_by !== this.user.uid) {
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
            if(recipe.created_by && this.user && recipe.created_by == this.user.uid) {
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
            } else if(!this.user || !recipe.created_by || (this.user && recipe.created_by !== this.user.uid)) {
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
            if(this.user) {
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
                                        uid: this.user.uid,
                                        email: this.user.email
                                    }
                                );

                                transaction.update(ref, 'favorited_by', favorited_by);
                            });
                        }).then(response => {
                            // this.$swal({
                            //     toast: true,
                            //     html: recipe.name + ' favorited',
                            //     type: 'success',
                            //     position: 'top-end',
                            //     showConfirmButton: false,
                            //     timer: 5000
                            // });
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
            if(this.user) {
                let ref = firebase.firestore().collection('recipes').doc(recipe['.key']);

                var snapshot = {};

                ref.get().then(snapshot => {
                    if (snapshot.exists) {
                        snapshot = snapshot;

                        firebase.firestore().runTransaction(transaction => {
                            return transaction.get(ref).then(snapshot => {

                                const favorited_by = snapshot.get('favorited_by');

                                const index = _.findIndex(favorited_by, {uid: this.user.uid});

                                favorited_by.splice(index, 1);

                                transaction.update(ref, 'favorited_by', favorited_by);
                            });
                        }).then(response => {
                            // this.$swal({
                            //     toast: true,
                            //     html: recipe.name + ' unfavorited',
                            //     type: 'success',
                            //     position: 'top-end',
                            //     showConfirmButton: false,
                            //     timer: 5000
                            // });
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
            if(this.user) {
                if(_.find(recipe.favorited_by, {uid: this.user.uid})) {
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
