<template>
    <div class="view-recipe">
        <div class="container">
            <Navbar />

            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <router-link :to="{name: 'home'}" class="breadcrumb-item text-capitalize">Recipes</router-link>
                    <li class="breadcrumb-item text-capitalize active" aria-current="page">{{recipe.name}}</li>
                </ol>
            </nav>

            <h4 class="mb-3">
                {{recipe.name}}
            </h4>

            <div class="d-flex mb-3">
                <span class="badge d-md-inline-block d-block" :class="{'badge-warning': type == 'breakfast', 'badge-success': type == 'lunch', 'badge-danger': type == 'dinner'}" v-for="type in recipe.types">{{type}}</span>
            </div>

        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import Navbar from "@/components/Navbar.vue";

import { db } from '@/main';

export default {
    name: "view-recipe",
    components: {
        Navbar
    },
    data() {
        return {
            recipe: {}
        }
    },
    props: ['recipe_id'],
    methods: {
        getRecipe() {
            let ref = db.collection('recipes').doc(this.recipe_id)
            ref.get()
            .then(snapshot => {
                if (snapshot.exists) {
                    this.recipe = snapshot.data();
                } else {
                    console.log("No such document!");
                }
            })
        }
    },
    mounted() {
        this.getRecipe();
    }
};
</script>
