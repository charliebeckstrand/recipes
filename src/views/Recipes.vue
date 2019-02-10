<template>
    <div class="home">
        <div class="container">
            <Navbar />

            <div class="d-flex align-items-center">
                <div>
                    <router-link :to="{name: 'createRecipe'}" class="btn btn-outline-success rounded-0">
                        Create Recipe
                    </router-link>
                </div>
                <div class="ml-lg-auto ml-1">
                    <button type="button" class="btn btn-outline-primary rounded-0">
                        Filter
                    </button>
                </div>
            </div>

            <div class="list-group" v-if="recipes && recipes.length">
                <a href="#" class="list-group-item list-group-item-action rounded-0" v-for="recipe in recipes">
                    Cras justo odio
                </a>
            </div>

            <div class="alert bg-danger text-white rounded-0" v-else>
                0 recipes
            </div>

        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import Navbar from "@/components/Navbar.vue";

export default {
    name: "recipes",
    components: {
        Navbar
    },
    data() {
        return {
            recipes: []
        }
    }
};
</script>
