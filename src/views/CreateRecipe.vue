<template>
    <div class="create-recipe">
        <div class="container">
            <Navbar />



        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import Navbar from "@/components/Navbar.vue";

export default {
    name: "create-recipe",
    components: {
        Navbar
    },
    data() {
        return {

        }
    }
};
</script>
